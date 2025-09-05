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
      
      // If not a Clerk token, try to verify as a regular JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        logger.warn('User not found for token', { userId: decoded.id });
        return res.status(401).json({
          success: false,
          message: 'Token invalide.'
        });
      }
      
      if (!user.isActive) {
        logger.warn('Inactive user attempted access', { userId: user._id });
        return res.status(401).json({
          success: false,
          message: 'Compte désactivé.'
        });
      }
      
      // Update last activity
      user.lastActivity = new Date();
      await user.save();
      
      req.user = user;
      next();
    } catch (jwtError) {
      logger.warn('JWT verification failed', { error: jwtError.message });
      return res.status(401).json({
        success: false,
        message: 'Token invalide.'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'authentification.'
    });
  }
};

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        logger.warn('Non-admin user attempted admin access', {
          userId: req.user?._id,
          role: req.user?.role,
          url: req.originalUrl
        });
        res.status(403).json({
          success: false,
          message: 'Accès administrateur requis.'
        });
      }
    });
  } catch (error) {
    logger.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification admin.'
    });
  }
};

// Optional authentication middleware
const optionalAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return next();
  }
  
  try {
    // Try to decode and find user, but don't fail if token is invalid
    const decodedToken = jwt.decode(token);
    
    if (decodedToken && decodedToken.sub) {
      const user = await User.findOne({ clerkId: decodedToken.sub }).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    logger.debug('Optional auth failed', { error: error.message });
  }
  
  next();
};

// Subscription-based authentication middleware
const subscriptionAuth = (requiredPlan) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise.'
      });
    }
    
    const userPlan = req.user.subscription?.plan || 'free';
    const planHierarchy = ['free', 'basic', 'premium', 'enterprise'];
    
    const userPlanIndex = planHierarchy.indexOf(userPlan);
    const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);
    
    if (userPlanIndex < requiredPlanIndex) {
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

// Export the main auth function as default and named exports for others
module.exports = auth;
module.exports.auth = auth;
module.exports.adminAuth = adminAuth;
module.exports.optionalAuth = optionalAuth;
module.exports.subscriptionAuth = subscriptionAuth;
module.exports.licenseAuth = licenseAuth;
