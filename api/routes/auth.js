const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, vtcLicense } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email déjà utilisé'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      vtcLicense,
      isActive: true
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Sync Clerk user with database
router.post('/clerk-sync', async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName, imageUrl } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Clerk ID and email are required'
      });
    }

    // Check if user already exists with this clerkId
    let user = await User.findOne({ clerkId });
    
    if (!user) {
      // Check if user exists with this email (legacy user)
      user = await User.findOne({ email });
      
      if (user) {
        // Update existing user with Clerk ID
        user.clerkId = clerkId;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.imageUrl = imageUrl || user.imageUrl;
        user.lastActivity = new Date();
        await user.save();
      } else {
        // Create new user
        user = new User({
          clerkId,
          email,
          firstName: firstName || 'User',
          lastName: lastName || '',
          imageUrl,
          isActive: true,
          lastActivity: new Date(),
          vtcLicense: 'PENDING', // Will be updated later
          driverProfile: {
            experience: 'Nouveau chauffeur',
            rating: 5.0,
            totalTrips: 0,
            totalEarnings: 0,
            status: 'offline'
          }
        });
        await user.save();
      }
    } else {
      // Update existing Clerk user
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.imageUrl = imageUrl || user.imageUrl;
      user.lastActivity = new Date();
      await user.save();
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl
      }
    });
  } catch (error) {
    console.error('Clerk sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la synchronisation'
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;
