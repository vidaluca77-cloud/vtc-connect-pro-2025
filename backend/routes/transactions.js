const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    // Mock transaction data
    const transactions = [
      {
        id: 'TXN001',
        date: new Date(),
        type: 'ride',
        description: 'Course Paris CDG - 16e Arrondissement',
        amount: 85.50,
        status: 'completed',
        paymentMethod: 'card',
        commission: 8.55
      },
      {
        id: 'TXN002',
        date: new Date(Date.now() - 86400000),
        type: 'ride',
        description: 'Course Gare du Nord - La Défense',
        amount: 45.00,
        status: 'completed',
        paymentMethod: 'cash',
        commission: 4.50
      },
      {
        id: 'TXN003',
        date: new Date(Date.now() - 2 * 86400000),
        type: 'withdrawal',
        description: 'Retrait vers compte bancaire',
        amount: -250.00,
        status: 'completed',
        paymentMethod: 'bank_transfer'
      },
      {
        id: 'TXN004',
        date: new Date(Date.now() - 3 * 86400000),
        type: 'ride',
        description: 'Course Orly - Champs-Élysées',
        amount: 75.00,
        status: 'completed',
        paymentMethod: 'card',
        commission: 7.50
      },
      {
        id: 'TXN005',
        date: new Date(Date.now() - 4 * 86400000),
        type: 'bonus',
        description: 'Bonus qualité de service',
        amount: 20.00,
        status: 'completed'
      }
    ];

    res.json({
      success: true,
      data: {
        transactions,
        summary: {
          totalAmount: transactions
            .filter(t => t.type !== 'withdrawal')
            .reduce((sum, t) => sum + t.amount, 0),
          totalCommissions: transactions
            .filter(t => t.commission)
            .reduce((sum, t) => sum + t.commission, 0),
          totalWithdrawals: Math.abs(transactions
            .filter(t => t.type === 'withdrawal')
            .reduce((sum, t) => sum + t.amount, 0))
        }
      }
    });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des transactions'
    });
  }
});

// Get transaction by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock transaction detail
    const transaction = {
      id: id,
      date: new Date(),
      type: 'ride',
      description: 'Course Paris CDG - 16e Arrondissement',
      amount: 85.50,
      status: 'completed',
      paymentMethod: 'card',
      commission: 8.55,
      details: {
        distance: '35.2 km',
        duration: '45 minutes',
        from: {
          address: 'Aéroport Charles de Gaulle, 95700 Roissy-en-France',
          coordinates: [49.0097, 2.5479]
        },
        to: {
          address: '123 Avenue Foch, 75016 Paris',
          coordinates: [48.8742, 2.2840]
        },
        passenger: {
          name: 'Client Anonyme',
          rating: 5
        }
      }
    };

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Transaction detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement de la transaction'
    });
  }
});

// Export transactions (CSV)
router.get('/export/csv', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Mock CSV export
    const csvData = [
      'Date,Type,Description,Montant,Commission,Statut',
      '2025-01-04,Course,Course Paris CDG - 16e Arrondissement,85.50,8.55,Terminé',
      '2025-01-03,Course,Course Gare du Nord - La Défense,45.00,4.50,Terminé',
      '2025-01-02,Retrait,Retrait vers compte bancaire,-250.00,,Terminé'
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(csvData);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export'
    });
  }
});

module.exports = router;