const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();

// Clerk webhook handler
router.post('/webhook/clerk', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const payload = req.body;
    const evt = JSON.parse(payload.toString());

    console.log('Clerk webhook received:', evt.type);

    switch (evt.type) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      case 'session.created':
        await handleSessionCreated(evt.data);
        break;
      default:
        console.log(`Unhandled Clerk event type: ${evt.type}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Clerk webhook error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

async function handleUserCreated(userData) {
  try {
    const existingUser = await User.findOne({ clerkId: userData.id });
    if (existingUser) {
      console.log('User already exists, skipping creation');
      return;
    }

    const email = userData.email_addresses?.[0]?.email_address;
    if (!email) {
      console.error('No email found in Clerk user data');
      return;
    }

    const user = new User({
      clerkId: userData.id,
      email: email,
      firstName: userData.first_name || 'User',
      lastName: userData.last_name || '',
      imageUrl: userData.image_url,
      isActive: true,
      lastActivity: new Date(),
      vtcLicense: {
        number: '',
        expiryDate: null,
        isValid: false
      },
      subscription: {
        plan: 'free',
        status: 'inactive'
      },
      stats: {
        totalRides: 0,
        totalRevenue: 0,
        totalHours: 0,
        averageRating: 5.0,
        thisWeek: { rides: 0, earnings: 0, hours: 0 },
        thisMonth: { rides: 0, earnings: 0, hours: 0 },
        allTime: { rides: 0, earnings: 0, hours: 0 }
      },
      driverProfile: {
        experience: 'Nouveau chauffeur',
        rating: 5.0,
        totalTrips: 0,
        totalEarnings: 0,
        status: 'offline',
        workingHours: {
          weekdays: { start: '08:00', end: '20:00' },
          weekends: { start: '09:00', end: '22:00' }
        },
        preferredAreas: ['Paris'],
        bio: ''
      }
    });

    await user.save();
    console.log('User created successfully:', user.email);
  } catch (error) {
    console.error('Error creating user from Clerk webhook:', error);
  }
}

async function handleUserUpdated(userData) {
  try {
    const user = await User.findOne({ clerkId: userData.id });
    if (!user) {
      console.log('User not found, creating new user');
      await handleUserCreated(userData);
      return;
    }

    const email = userData.email_addresses?.[0]?.email_address;
    if (email) {
      user.email = email;
    }
    
    user.firstName = userData.first_name || user.firstName;
    user.lastName = userData.last_name || user.lastName;
    user.imageUrl = userData.image_url || user.imageUrl;
    user.lastActivity = new Date();

    await user.save();
    console.log('User updated successfully:', user.email);
  } catch (error) {
    console.error('Error updating user from Clerk webhook:', error);
  }
}

async function handleUserDeleted(userData) {
  try {
    const user = await User.findOne({ clerkId: userData.id });
    if (user) {
      user.isActive = false;
      user.deletedAt = new Date();
      await user.save();
      console.log('User marked as deleted:', user.email);
    }
  } catch (error) {
    console.error('Error deleting user from Clerk webhook:', error);
  }
}

async function handleSessionCreated(sessionData) {
  try {
    const user = await User.findOne({ clerkId: sessionData.user_id });
    if (user) {
      user.lastActivity = new Date();
      await user.save();
    }
  } catch (error) {
    console.error('Error updating session from Clerk webhook:', error);
  }
}

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
      vtcLicense: { number: vtcLicense, isValid: false },
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
          vtcLicense: {
            number: '',
            expiryDate: null,
            isValid: false
          },
          subscription: {
            plan: 'free',
            status: 'inactive'
          },
          stats: {
            totalRides: 0,
            totalRevenue: 0,
            totalHours: 0,
            averageRating: 5.0,
            thisWeek: { rides: 0, earnings: 0, hours: 0 },
            thisMonth: { rides: 0, earnings: 0, hours: 0 },
            allTime: { rides: 0, earnings: 0, hours: 0 }
          },
          driverProfile: {
            experience: 'Nouveau chauffeur',
            rating: 5.0,
            totalTrips: 0,
            totalEarnings: 0,
            status: 'offline',
            workingHours: {
              weekdays: { start: '08:00', end: '20:00' },
              weekends: { start: '09:00', end: '22:00' }
            },
            preferredAreas: ['Paris'],
            bio: ''
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
        imageUrl: user.imageUrl,
        vtcLicense: user.vtcLicense,
        subscription: user.subscription,
        stats: user.stats,
        driverProfile: user.driverProfile
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

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updateSchema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      vehicle: z.object({
        brand: z.string(),
        model: z.string(),
        licensePlate: z.string(),
        year: z.number().optional(),
        type: z.enum(['sedan', 'suv', 'van', 'luxury']).optional(),
        color: z.string().optional(),
        seats: z.number().optional()
      }).optional(),
      vtcLicense: z.object({
        number: z.string(),
        expiryDate: z.string().datetime().optional()
      }).optional(),
      driverProfile: z.object({
        experience: z.string().optional(),
        bio: z.string().optional(),
        workingHours: z.object({
          weekdays: z.object({
            start: z.string(),
            end: z.string()
          }),
          weekends: z.object({
            start: z.string(),
            end: z.string()
          })
        }).optional(),
        preferredAreas: z.array(z.string()).optional(),
        languages: z.array(z.string()).optional()
      }).optional(),
      businessInfo: z.object({
        siretNumber: z.string().optional(),
        vatNumber: z.string().optional(),
        businessAddress: z.string().optional(),
        accountantEmail: z.string().email().optional()
      }).optional()
    });

    const validatedData = updateSchema.parse(req.body);
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      user,
      message: 'Profil mis à jour avec succès'
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      });
    }

    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
});

module.exports = router;
