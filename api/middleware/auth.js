const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
        
        if (user) {
          req.user = user;
          return next();
        }
      }
      
      // If not a Clerk token or user not found, try regular JWT verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token invalide.'
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      // If JWT verification fails, the token might be a Clerk token
      // For now, we'll just return invalid token error
      return res.status(401).json({
        success: false,
        message: 'Token invalide.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide.'
    });
  }
};

module.exports = auth;
