const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Admin middleware (check if user is admin)
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès administrateur requis'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur de vérification des permissions'
    });
  }
};

// Get admin dashboard data
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const adminData = {
      stats: {
        totalUsers: 1247,
        activeUsers: 892,
        totalRides: 15690,
        totalRevenue: 456789.50,
        monthlyGrowth: 12.5,
        averageRating: 4.7
      },
      recentActivity: [
        {
          type: 'user_registration',
          message: 'Nouvel utilisateur: Marie Dubois',
          timestamp: new Date(),
          severity: 'info'
        },
        {
          type: 'ride_completed',
          message: 'Course terminée: CDG → Paris (85.50€)',
          timestamp: new Date(Date.now() - 300000),
          severity: 'success'
        },
        {
          type: 'payment_issue',
          message: 'Problème de paiement: TXN001',
          timestamp: new Date(Date.now() - 600000),
          severity: 'warning'
        }
      ],
      topDrivers: [
        { name: 'Jean Martin', rides: 156, rating: 4.9, earnings: 12450 },
        { name: 'Pierre Durand', rides: 142, rating: 4.8, earnings: 11890 },
        { name: 'Michel Bernard', rides: 128, rating: 4.7, earnings: 10560 }
      ]
    };

    res.json({
      success: true,
      data: adminData
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement du tableau de bord admin'
    });
  }
});

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = 'all' } = req.query;
    
    // Mock users data
    const users = [
      {
        id: '1',
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean.martin@email.com',
        phone: '+33123456789',
        vtcLicense: 'VTC001',
        status: 'active',
        registrationDate: new Date(Date.now() - 30 * 86400000),
        lastActivity: new Date(),
        totalRides: 156,
        rating: 4.9
      },
      {
        id: '2',
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie.dubois@email.com',
        phone: '+33123456790',
        vtcLicense: 'VTC002',
        status: 'active',
        registrationDate: new Date(Date.now() - 15 * 86400000),
        lastActivity: new Date(Date.now() - 86400000),
        totalRides: 89,
        rating: 4.7
      },
      {
        id: '3',
        firstName: 'Pierre',
        lastName: 'Durand',
        email: 'pierre.durand@email.com',
        phone: '+33123456791',
        vtcLicense: 'VTC003',
        status: 'suspended',
        registrationDate: new Date(Date.now() - 60 * 86400000),
        lastActivity: new Date(Date.now() - 7 * 86400000),
        totalRides: 203,
        rating: 4.2
      }
    ];

    const filteredUsers = users.filter(user => {
      const matchesSearch = search === '' || 
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = status === 'all' || user.status === status;
      
      return matchesSearch && matchesStatus;
    });

    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredUsers.length / limit),
          totalUsers: filteredUsers.length,
          hasNext: startIndex + parseInt(limit) < filteredUsers.length,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des utilisateurs'
    });
  }
});

// Update user status
router.put('/users/:userId/status', auth, adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    // In real implementation, update user in database
    // await User.findByIdAndUpdate(userId, { status });

    res.json({
      success: true,
      message: `Statut utilisateur mis à jour: ${status}`
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
});

// Get system settings
router.get('/settings', auth, adminAuth, async (req, res) => {
  try {
    const settings = {
      general: {
        siteName: 'VTC Connect Pro',
        timezone: 'Europe/Paris',
        currency: 'EUR',
        language: 'fr'
      },
      business: {
        commissionRate: 10,
        minimumFare: 5.00,
        cancellationFee: 2.50,
        waitingTimeRate: 0.50
      },
      features: {
        enableNotifications: true,
        enableGeolocation: true,
        enableAutoDispatch: true,
        enableRatingSystem: true
      }
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Admin settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des paramètres'
    });
  }
});

// Update system settings
router.put('/settings', auth, adminAuth, async (req, res) => {
  try {
    const { settings } = req.body;

    // In real implementation, save settings to database
    console.log('Updating settings:', settings);

    res.json({
      success: true,
      message: 'Paramètres mis à jour avec succès'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des paramètres'
    });
  }
});

module.exports = router;