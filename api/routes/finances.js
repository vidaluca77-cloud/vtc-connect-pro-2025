const express = require('express');
const auth = require('../middleware/auth');
const Finance = require('../models/Finance');
const Course = require('../models/Course');
const { z } = require('zod');

const router = express.Router();

// Validation schemas
const financeSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().min(0),
  category: z.string(),
  description: z.string().min(1),
  date: z.string().datetime().optional(),
  paymentMethod: z.enum(['cash', 'card', 'bank_transfer', 'check', 'app_payment', 'other']),
  courseId: z.string().optional(),
  receiptUrl: z.string().url().optional(),
  vendor: z.object({
    name: z.string(),
    address: z.string().optional(),
    phone: z.string().optional()
  }).optional(),
  location: z.object({
    address: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  }).optional(),
  taxDeductible: z.boolean().optional(),
  notes: z.string().optional(),
  mileage: z.number().optional()
});

// Get all financial records for user
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type, 
      category, 
      startDate, 
      endDate,
      taxDeductible 
    } = req.query;

    const filter = { userId: req.user.id };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (taxDeductible !== undefined) filter.taxDeductible = taxDeductible === 'true';
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const finances = await Finance.find(filter)
      .populate('courseId', 'platform startLocation endLocation price')
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalCount = await Finance.countDocuments(filter);

    // Calculate totals
    const totals = await Finance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalIncome = totals.find(t => t._id === 'income')?.total || 0;
    const totalExpenses = totals.find(t => t._id === 'expense')?.total || 0;

    res.json({
      success: true,
      data: {
        finances,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        },
        summary: {
          totalIncome,
          totalExpenses,
          netIncome: totalIncome - totalExpenses
        }
      }
    });
  } catch (error) {
    console.error('Get finances error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des finances'
    });
  }
});

// Get financial summary by period
router.get('/summary', auth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const userId = req.user.id;
    
    const now = new Date();
    let startDate, endDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = now;
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Get totals by type
    const totals = await Finance.getTotalsByPeriod(userId, startDate, endDate);
    
    // Get expense breakdown by category
    const expenseBreakdown = await Finance.getCategoryBreakdown(userId, 'expense', startDate, endDate);
    
    // Get income breakdown by category
    const incomeBreakdown = await Finance.getCategoryBreakdown(userId, 'income', startDate, endDate);

    // Get top expenses
    const topExpenses = await Finance.find({
      userId,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate }
    }).sort({ amount: -1 }).limit(5);

    const totalIncome = totals.find(t => t._id === 'income')?.total || 0;
    const totalExpenses = totals.find(t => t._id === 'expense')?.total || 0;

    res.json({
      success: true,
      data: {
        period,
        dateRange: { startDate, endDate },
        totals: {
          income: totalIncome,
          expenses: totalExpenses,
          net: totalIncome - totalExpenses
        },
        breakdown: {
          expenses: expenseBreakdown,
          income: incomeBreakdown
        },
        topExpenses
      }
    });
  } catch (error) {
    console.error('Financial summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul du résumé financier'
    });
  }
});

// Create a new financial record
router.post('/', auth, async (req, res) => {
  try {
    const validatedData = financeSchema.parse(req.body);
    
    const finance = new Finance({
      ...validatedData,
      userId: req.user.id,
      date: validatedData.date ? new Date(validatedData.date) : new Date()
    });

    await finance.save();

    res.status(201).json({
      success: true,
      data: finance,
      message: 'Transaction financière enregistrée avec succès'
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      });
    }

    console.error('Create finance error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de la transaction'
    });
  }
});

// Update a financial record
router.put('/:id', auth, async (req, res) => {
  try {
    const validatedData = financeSchema.partial().parse(req.body);
    
    const finance = await Finance.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      validatedData,
      { new: true, runValidators: true }
    );

    if (!finance) {
      return res.status(404).json({
        success: false,
        message: 'Transaction non trouvée'
      });
    }

    res.json({
      success: true,
      data: finance,
      message: 'Transaction mise à jour avec succès'
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      });
    }

    console.error('Update finance error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la transaction'
    });
  }
});

// Delete a financial record
router.delete('/:id', auth, async (req, res) => {
  try {
    const finance = await Finance.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!finance) {
      return res.status(404).json({
        success: false,
        message: 'Transaction non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Transaction supprimée avec succès'
    });
  } catch (error) {
    console.error('Delete finance error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la transaction'
    });
  }
});

// Get financial categories
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = {
      income: [
        { value: 'course_revenue', label: 'Revenus courses', icon: '💰' },
        { value: 'tip', label: 'Pourboires', icon: '💵' },
        { value: 'bonus', label: 'Bonus plateformes', icon: '🎁' },
        { value: 'referral', label: 'Parrainage', icon: '👥' },
        { value: 'other_income', label: 'Autres revenus', icon: '💲' }
      ],
      expense: [
        { value: 'fuel', label: 'Carburant', icon: '⛽' },
        { value: 'maintenance', label: 'Entretien', icon: '🔧' },
        { value: 'insurance', label: 'Assurance', icon: '🛡️' },
        { value: 'vehicle_payment', label: 'Crédit véhicule', icon: '🚗' },
        { value: 'parking', label: 'Stationnement', icon: '🅿️' },
        { value: 'tolls', label: 'Péages', icon: '🛣️' },
        { value: 'phone', label: 'Téléphone', icon: '📱' },
        { value: 'internet', label: 'Internet', icon: '🌐' },
        { value: 'cleaning', label: 'Nettoyage', icon: '🧽' },
        { value: 'equipment', label: 'Équipement', icon: '🛠️' },
        { value: 'registration', label: 'Immatriculation', icon: '📋' },
        { value: 'license_renewal', label: 'Renouvellement licence', icon: '📄' },
        { value: 'accounting', label: 'Comptabilité', icon: '📊' },
        { value: 'legal', label: 'Juridique', icon: '⚖️' },
        { value: 'marketing', label: 'Marketing', icon: '📢' },
        { value: 'other_expense', label: 'Autres dépenses', icon: '💳' }
      ]
    };

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des catégories'
    });
  }
});

// Export financial data for accounting
router.get('/export', auth, async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    
    const filter = { userId: req.user.id };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const finances = await Finance.find(filter)
      .populate('courseId', 'platform startLocation endLocation')
      .sort({ date: -1 });

    if (format === 'csv') {
      // Generate CSV format for accounting
      const csv = [
        'Date,Type,Catégorie,Description,Montant,Méthode de paiement,Déductible,Fournisseur,Lieu,Notes'
      ];
      
      finances.forEach(finance => {
        csv.push([
          finance.date.toISOString().split('T')[0],
          finance.type === 'income' ? 'Revenu' : 'Dépense',
          finance.category,
          finance.description,
          finance.amount,
          finance.paymentMethod,
          finance.taxDeductible ? 'Oui' : 'Non',
          finance.vendor?.name || '',
          finance.location?.address || '',
          finance.notes || ''
        ].map(field => `"${field}"`).join(','));
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=finances.csv');
      return res.send(csv.join('\n'));
    }

    res.json({
      success: true,
      data: {
        finances,
        exportDate: new Date(),
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    console.error('Export finances error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export des données financières'
    });
  }
});

module.exports = router;