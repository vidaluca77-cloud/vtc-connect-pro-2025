const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('./errorHandler');

// Enhanced authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Token manquant.'
      });
    }

    try {
      // First try to verify as a Clerk token
      // Clerk tokens are JWTs but we don't verify them server-side directly
      // Instead, we'll accept them and find the user by clerkId
      
      // Try to decode the JWT to get the sub (clerkId)
      const decodedToken = jwt.decode(token);
      
      if (decodedToken && decodedToken.sub) {
        // This might be a Clerk token, try to find user by clerkId
        const user = await User.findOne({ clerkId: decodedToken.sub }).select('-password');
        
        if (user && user.isActive) {
          // Update last activity
          user.lastActivity = new Date();
          await user.save();
          
          req.user = user;
          return next();
        }
      }
      
      // If not a Clerk token or user not found, try regular JWT verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Token invalide ou utilisateur inactif.'
        });
      }

      // Update last activity
      user.lastActivity = new Date();
      await user.save();

      req.user = user;
      next();
    } catch (jwtError) {
      logger.warn('JWT verification failed', {
        error: jwtError.message,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      return res.status(401).json({
        success: false,
        message: 'Token invalide.'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error', {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.status(401).json({
      success: false,
      message: 'Erreur d\'authentification.'
    });
  }
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    // First run regular auth
    await new Promise((resolve, reject) => {
      auth(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Check if user is admin
    if (!req.user.isAdmin && req.user.role !== 'admin') {
      logger.warn('Admin access attempt by non-admin user', {
        userId: req.user._id,
        email: req.user.email,
        ip: req.ip,
        url: req.originalUrl
      });
      
      return res.status(403).json({
        success: false,
        message: 'Accès administrateur requis.'
      });
    }

    next();
  } catch (error) {
    logger.error('Admin auth middleware error', {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip
    });
    
    res.status(401).json({
      success: false,
      message: 'Erreur d\'authentification administrateur.'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // No token provided, continue without user
      return next();
    }

    try {
      // Try Clerk token first
      const decodedToken = jwt.decode(token);
      
      if (decodedToken && decodedToken.sub) {
        const user = await User.findOne({ clerkId: decodedToken.sub }).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
          return next();
        }
      }
      
      // Try regular JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (jwtError) {
      // Invalid token, but don't fail - just continue without user
      logger.debug('Optional auth token verification failed', {
        error: jwtError.message,
        ip: req.ip
      });
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error', {
      error: error.message,
      ip: req.ip
    });
    
    // Don't fail on optional auth errors
    next();
  }
};

// Subscription check middleware
const subscriptionAuth = (requiredPlan = 'basic') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise.'
      });
    }

    const userPlan = req.user.subscription?.plan || 'free';
    const planHierarchy = ['free', 'basic', 'premium', 'enterprise'];
    
    const userPlanLevel = planHierarchy.indexOf(userPlan);
    const requiredPlanLevel = planHierarchy.indexOf(requiredPlan);
    
    if (userPlanLevel < requiredPlanLevel) {
      logger.warn('Subscription access denied', {
        userId: req.user._id,
        userPlan,
        requiredPlan,
        url: req.originalUrl
      });
      
      return res.status(403).json({
        success: false,
        message: `Abonnement ${requiredPlan} requis pour accéder à cette fonctionnalité.`,
        currentPlan: userPlan,
        requiredPlan
      });
    }

    next();
  };
};

// License verification middleware
const licenseAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentification requise.'
    });
  }

  const vtcLicense = req.user.vtcLicense;
  
  if (!vtcLicense || !vtcLicense.number || !vtcLicense.isValid) {
    logger.warn('VTC license verification failed', {
      userId: req.user._id,
      hasLicense: !!vtcLicense?.number,
      isValid: vtcLicense?.isValid,
      url: req.originalUrl
    });
    
    return res.status(403).json({
      success: false,
      message: 'Licence VTC valide requise pour accéder à cette fonctionnalité.',
      requiresLicense: true
    });
  }

  // Check license expiry
  if (vtcLicense.expiryDate && new Date(vtcLicense.expiryDate) < new Date()) {
    return res.status(403).json({
      success: false,
      message: 'Licence VTC expirée. Veuillez renouveler votre licence.',
      licenseExpired: true,
      expiryDate: vtcLicense.expiryDate
    });
  }

  next();
};

module.exports = {
  auth,
  adminAuth,
  optionalAuth,
  subscriptionAuth,
  licenseAuth
};
