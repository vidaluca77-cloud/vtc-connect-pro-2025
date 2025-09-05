const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Ride = require('../models/Ride');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Get dashboard data
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Get real statistics from database
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get today's rides
    const todayRides = await Ride.find({
      userId: user._id,
      scheduledDateTime: { $gte: startOfDay },
      status: { $in: ['completed', 'in_progress'] }
    });

    // Get today's earnings
    const todayTransactions = await Transaction.find({
      userId: user._id,
      createdAt: { $gte: startOfDay },
      type: 'earning',
      status: 'completed'
    });

    // Get recent completed rides
    const recentRides = await Ride.find({
      userId: user._id,
      status: 'completed'
    }).sort({ actualEndTime: -1 }).limit(5);

    // Get upcoming scheduled rides
    const upcomingRides = await Ride.find({
      userId: user._id,
      status: 'scheduled',
      scheduledDateTime: { $gte: new Date() }
    }).sort({ scheduledDateTime: 1 }).limit(3);

    // Calculate statistics
    const todayRidesCount = todayRides.length;
    const todayEarnings = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
    const todayHours = todayRides.reduce((sum, ride) => {
      if (ride.actualStartTime && ride.actualEndTime) {
        return sum + (ride.actualEndTime - ride.actualStartTime) / (1000 * 60 * 60);
      }
      return sum;
    }, 0);

    const dashboardData = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        imageUrl: user.imageUrl,
        vtcLicense: user.vtcLicense,
        driverProfile: user.driverProfile
      },
      stats: {
        today: {
          rides: todayRidesCount,
          earnings: todayEarnings,
          hours: Math.round(todayHours * 10) / 10,
          avgRating: user.driverProfile?.rating || 5.0
        },
        week: user.stats?.thisWeek || { rides: 0, earnings: 0, hours: 0 },
        month: user.stats?.thisMonth || { rides: 0, earnings: 0, hours: 0 },
        allTime: user.stats?.allTime || { rides: 0, earnings: 0, hours: 0 }
      },
      recentRides: recentRides.map(ride => ({
        id: ride._id,
        date: ride.actualEndTime || ride.scheduledDateTime,
        from: ride.pickupLocation.address,
        to: ride.dropoffLocation.address,
        amount: ride.fare.totalAmount,
        status: ride.status,
        rating: ride.rating?.score
      })),
      upcomingRides: upcomingRides.map(ride => ({
        id: ride._id,
        date: ride.scheduledDateTime,
        from: ride.pickupLocation.address,
        to: ride.dropoffLocation.address,
        amount: ride.fare.totalAmount,
        status: ride.status,
        passengerName: ride.passengerInfo.name
      }))
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

// Get recent activity
router.get('/activity', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get recent transactions and rides for activity feed
    const recentTransactions = await Transaction.find({
      userId: user._id
    }).sort({ createdAt: -1 }).limit(10);

    const recentRides = await Ride.find({
      userId: user._id,
      status: { $in: ['completed', 'cancelled'] }
    }).sort({ createdAt: -1 }).limit(5);

    const activities = [];

    // Add transaction activities
    recentTransactions.forEach(transaction => {
      activities.push({
        id: `tx_${transaction._id}`,
        type: 'transaction',
        title: transaction.type === 'earning' ? 'Paiement reçu' : 'Dépense enregistrée',
        description: transaction.description,
        amount: transaction.amount,
        timestamp: transaction.createdAt,
        icon: transaction.type === 'earning' ? '💳' : '💰'
      });
    });

    // Add ride activities
    recentRides.forEach(ride => {
      activities.push({
        id: `ride_${ride._id}`,
        type: 'ride',
        title: ride.status === 'completed' ? 'Course terminée' : 'Course annulée',
        description: `${ride.pickupLocation.address} → ${ride.dropoffLocation.address}`,
        amount: ride.fare.totalAmount,
        timestamp: ride.actualEndTime || ride.createdAt,
        icon: ride.status === 'completed' ? '✓' : '❌'
      });
    });

    // Sort activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      data: activities.slice(0, 10) // Return last 10 activities
    });
  } catch (error) {
    console.error('Activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement de l\'activité'
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