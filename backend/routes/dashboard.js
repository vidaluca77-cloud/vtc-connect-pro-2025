const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get dashboard data
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Mock dashboard data for now
    const dashboardData = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        vtcLicense: user.vtcLicense
      },
      stats: {
        totalRides: 156,
        totalEarnings: 12850.50,
        weeklyRides: 23,
        weeklyEarnings: 1820.75,
        averageRating: 4.8,
        totalDistance: 3450
      },
      recentRides: [
        {
          id: 1,
          date: new Date(),
          from: "Paris CDG",
          to: "16e Arrondissement",
          amount: 85.50,
          status: "completed"
        },
        {
          id: 2,
          date: new Date(Date.now() - 86400000),
          from: "Gare du Nord",
          to: "La Défense",
          amount: 45.00,
          status: "completed"
        }
      ],
      nextRides: [
        {
          id: 3,
          date: new Date(Date.now() + 3600000),
          from: "Orly Airport",
          to: "Champs-Élysées",
          amount: 75.00,
          status: "scheduled"
        }
      ]
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement du tableau de bord'
    });
  }
});

// Get statistics
router.get('/stats', auth, async (req, res) => {
  try {
    // Mock statistics data
    const stats = {
      daily: {
        rides: [12, 15, 10, 18, 22, 8, 14],
        earnings: [450, 675, 380, 720, 890, 320, 560]
      },
      monthly: {
        rides: [120, 135, 98, 156, 178, 145, 167, 189, 201, 156, 134, 167],
        earnings: [4500, 5200, 3800, 6100, 7200, 5800, 6700, 7800, 8500, 6900, 5600, 7100]
      },
      topDestinations: [
        { name: "Charles de Gaulle", count: 45 },
        { name: "Orly", count: 32 },
        { name: "Gare du Nord", count: 28 },
        { name: "La Défense", count: 24 },
        { name: "Champs-Élysées", count: 19 }
      ]
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des statistiques'
    });
  }
});

module.exports = router;