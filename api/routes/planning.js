const express = require('express');
const auth = require('../middleware/auth');
const Planning = require('../models/Planning');
const Course = require('../models/Course');
const { z } = require('zod');

const router = express.Router();

// Validation schemas
const planningSchema = z.object({
  date: z.string().datetime(),
  availability: z.object({
    status: z.enum(['available', 'busy', 'off', 'maintenance']),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    breakTimes: z.array(z.object({
      startTime: z.string(),
      endTime: z.string(),
      reason: z.string().optional()
    })).optional()
  }),
  dailyGoals: z.object({
    targetRides: z.number().min(0).optional(),
    targetEarnings: z.number().min(0).optional(),
    targetHours: z.number().min(0).optional(),
    preferredZones: z.array(z.string()).optional()
  }).optional(),
  notes: z.string().optional(),
  reminders: z.array(z.object({
    time: z.string(),
    message: z.string(),
    isCompleted: z.boolean().optional()
  })).optional()
});

const eventSchema = z.object({
  courseId: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
  platform: z.string().optional(),
  estimatedEarnings: z.number().min(0).optional()
});

// Get planning for a date range (week or month)
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, view = 'week' } = req.query;
    
    let start, end;
    
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      const now = new Date();
      if (view === 'week') {
        // Get current week (Monday to Sunday)
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        start = new Date(now.setDate(diff));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
      } else {
        // Get current month
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }
    }

    const planning = await Planning.getWeeklyPlanning(req.user.id, start, end)
      .populate('bookedCourses.courseId', 'platform startLocation endLocation price status');

    // Fill missing days with default planning
    const planningMap = new Map();
    planning.forEach(p => {
      const dateKey = p.date.toISOString().split('T')[0];
      planningMap.set(dateKey, p);
    });

    const result = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      if (planningMap.has(dateKey)) {
        result.push(planningMap.get(dateKey));
      } else {
        // Create default planning for missing days
        result.push({
          date: dateKey,
          availability: {
            status: 'available',
            startTime: '08:00',
            endTime: '20:00'
          },
          bookedCourses: [],
          dailyGoals: {},
          actualResults: {}
        });
      }
    }

    res.json({
      success: true,
      data: {
        planning: result,
        period: { startDate: start, endDate: end, view }
      }
    });
  } catch (error) {
    console.error('Get planning error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement du planning'
    });
  }
});

// Get planning for a specific date
router.get('/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const planningDate = new Date(date);

    let planning = await Planning.findOne({
      userId: req.user.id,
      date: planningDate
    }).populate('bookedCourses.courseId', 'platform startLocation endLocation price status passenger');

    if (!planning) {
      // Create default planning for the date
      planning = {
        date: planningDate,
        availability: {
          status: 'available',
          startTime: '08:00',
          endTime: '20:00'
        },
        bookedCourses: [],
        dailyGoals: {},
        actualResults: {},
        platformSync: {},
        conditions: {},
        notes: '',
        reminders: []
      };
    }

    // Get actual courses for this date
    const actualCourses = await Course.find({
      userId: req.user.id,
      scheduledDateTime: {
        $gte: new Date(planningDate.getFullYear(), planningDate.getMonth(), planningDate.getDate()),
        $lt: new Date(planningDate.getFullYear(), planningDate.getMonth(), planningDate.getDate() + 1)
      }
    });

    // Calculate actual results
    const actualResults = {
      totalRides: actualCourses.filter(c => c.status === 'completed').length,
      totalEarnings: actualCourses
        .filter(c => c.status === 'completed')
        .reduce((sum, c) => sum + c.price.net + (c.price.tip || 0), 0),
      totalHours: actualCourses
        .filter(c => c.actualStartTime && c.actualEndTime)
        .reduce((sum, c) => {
          const hours = (c.actualEndTime - c.actualStartTime) / (1000 * 60 * 60);
          return sum + hours;
        }, 0),
      averageRating: actualCourses
        .filter(c => c.rating?.score)
        .reduce((sum, c, _, arr) => sum + c.rating.score / arr.length, 0) || 0
    };

    res.json({
      success: true,
      data: {
        ...planning,
        actualResults
      }
    });
  } catch (error) {
    console.error('Get single planning error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement du planning pour cette date'
    });
  }
});

// Create or update planning for a specific date
router.post('/:date', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const planningDate = new Date(date);
    const validatedData = planningSchema.parse(req.body);

    let planning = await Planning.findOne({
      userId: req.user.id,
      date: planningDate
    });

    if (planning) {
      // Update existing planning
      Object.assign(planning, validatedData);
      await planning.save();
    } else {
      // Create new planning
      planning = new Planning({
        userId: req.user.id,
        date: planningDate,
        ...validatedData
      });
      await planning.save();
    }

    res.json({
      success: true,
      data: planning,
      message: 'Planning mis à jour avec succès'
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      });
    }

    console.error('Update planning error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du planning'
    });
  }
});

// Add a booked course to planning
router.post('/:date/courses', auth, async (req, res) => {
  try {
    const { date } = req.params;
    const planningDate = new Date(date);
    const validatedEvent = eventSchema.parse(req.body);

    let planning = await Planning.findOne({
      userId: req.user.id,
      date: planningDate
    });

    if (!planning) {
      planning = new Planning({
        userId: req.user.id,
        date: planningDate,
        availability: { status: 'available' },
        bookedCourses: [],
        dailyGoals: {},
        actualResults: {}
      });
    }

    // Check if time slot is available
    const isAvailable = planning.isTimeSlotAvailable(validatedEvent.startTime, validatedEvent.endTime);
    
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Créneaux horaires non disponibles'
      });
    }

    planning.bookedCourses.push(validatedEvent);
    await planning.save();

    res.json({
      success: true,
      data: planning,
      message: 'Course ajoutée au planning'
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      });
    }

    console.error('Add course to planning error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la course au planning'
    });
  }
});

// Remove a booked course from planning
router.delete('/:date/courses/:courseIndex', auth, async (req, res) => {
  try {
    const { date, courseIndex } = req.params;
    const planningDate = new Date(date);

    const planning = await Planning.findOne({
      userId: req.user.id,
      date: planningDate
    });

    if (!planning) {
      return res.status(404).json({
        success: false,
        message: 'Planning non trouvé'
      });
    }

    const index = parseInt(courseIndex);
    if (index < 0 || index >= planning.bookedCourses.length) {
      return res.status(400).json({
        success: false,
        message: 'Index de course invalide'
      });
    }

    planning.bookedCourses.splice(index, 1);
    await planning.save();

    res.json({
      success: true,
      data: planning,
      message: 'Course supprimée du planning'
    });
  } catch (error) {
    console.error('Remove course from planning error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la course du planning'
    });
  }
});

// Get availability summary for a period
router.get('/availability/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

    const planning = await Planning.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    const summary = {
      totalDays: Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1,
      availableDays: 0,
      busyDays: 0,
      offDays: 0,
      maintenanceDays: 0,
      totalAvailableHours: 0,
      totalBookedHours: 0,
      totalTargetEarnings: 0,
      totalTargetRides: 0
    };

    planning.forEach(p => {
      switch (p.availability.status) {
        case 'available':
          summary.availableDays++;
          break;
        case 'busy':
          summary.busyDays++;
          break;
        case 'off':
          summary.offDays++;
          break;
        case 'maintenance':
          summary.maintenanceDays++;
          break;
      }

      summary.totalAvailableHours += p.getTotalAvailableHours();
      summary.totalBookedHours += p.getTotalBookedHours();
      summary.totalTargetEarnings += p.dailyGoals?.targetEarnings || 0;
      summary.totalTargetRides += p.dailyGoals?.targetRides || 0;
    });

    summary.utilizationRate = summary.totalAvailableHours > 0 
      ? Math.round((summary.totalBookedHours / summary.totalAvailableHours) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        summary,
        period: { startDate: start, endDate: end }
      }
    });
  } catch (error) {
    console.error('Availability summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul du résumé de disponibilité'
    });
  }
});

// Sync with external platforms
router.post('/sync/:platform', auth, async (req, res) => {
  try {
    const { platform } = req.params;
    const { date, isOnline } = req.body;

    const validPlatforms = ['uber', 'bolt', 'heetch', 'marcel'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({
        success: false,
        message: 'Plateforme non supportée'
      });
    }

    const planningDate = new Date(date);
    let planning = await Planning.findOne({
      userId: req.user.id,
      date: planningDate
    });

    if (!planning) {
      planning = new Planning({
        userId: req.user.id,
        date: planningDate,
        availability: { status: 'available' },
        bookedCourses: [],
        dailyGoals: {},
        actualResults: {},
        platformSync: {}
      });
    }

    planning.platformSync[platform] = {
      isOnline: isOnline,
      lastSync: new Date()
    };

    await planning.save();

    res.json({
      success: true,
      data: planning,
      message: `Synchronisation ${platform} mise à jour`
    });
  } catch (error) {
    console.error('Platform sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la synchronisation avec la plateforme'
    });
  }
});

// Get planning templates/suggestions
router.get('/templates', auth, async (req, res) => {
  try {
    const templates = [
      {
        name: 'Semaine standard',
        description: 'Planning type pour une semaine de travail normale',
        weekdays: {
          startTime: '07:00',
          endTime: '19:00',
          breakTimes: [
            { startTime: '12:00', endTime: '13:00', reason: 'Pause déjeuner' }
          ]
        },
        weekends: {
          startTime: '09:00',
          endTime: '22:00',
          breakTimes: []
        }
      },
      {
        name: 'Soirées et weekends',
        description: 'Planning pour maximiser les revenus en soirée',
        weekdays: {
          startTime: '16:00',
          endTime: '23:00',
          breakTimes: []
        },
        weekends: {
          startTime: '08:00',
          endTime: '02:00',
          breakTimes: [
            { startTime: '14:00', endTime: '15:00', reason: 'Pause' }
          ]
        }
      },
      {
        name: 'Aéroports',
        description: 'Planning optimisé pour les trajets aéroport',
        weekdays: {
          startTime: '05:00',
          endTime: '23:00',
          breakTimes: [
            { startTime: '10:00', endTime: '11:00', reason: 'Repos' },
            { startTime: '15:00', endTime: '16:00', reason: 'Repos' }
          ]
        },
        weekends: {
          startTime: '05:00',
          endTime: '23:00',
          breakTimes: [
            { startTime: '12:00', endTime: '13:00', reason: 'Pause déjeuner' }
          ]
        }
      }
    ];

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des modèles'
    });
  }
});

module.exports = router;