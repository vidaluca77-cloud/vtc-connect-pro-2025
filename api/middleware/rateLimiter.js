const rateLimit = require('express-rate-limit');
const { logger } = require('./errorHandler');

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method
    });
    
    res.status(429).json({
      success: false,
      message: 'Trop de requêtes, veuillez réessayer plus tard.',
      retryAfter: '15 minutes'
    });
  }
});

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method
    });
    
    res.status(429).json({
      success: false,
      message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.',
      retryAfter: '15 minutes'
    });
  }
});

// Rate limiting for file uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    success: false,
    message: 'Limite d\'upload atteinte, veuillez réessayer dans 1 heure.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Upload rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method
    });
    
    res.status(429).json({
      success: false,
      message: 'Limite d\'upload atteinte, veuillez réessayer dans 1 heure.',
      retryAfter: '1 hour'
    });
  }
});

// Rate limiting for password reset
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Trop de demandes de réinitialisation de mot de passe, veuillez réessayer dans 1 heure.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Password reset rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method
    });
    
    res.status(429).json({
      success: false,
      message: 'Trop de demandes de réinitialisation de mot de passe, veuillez réessayer dans 1 heure.',
      retryAfter: '1 hour'
    });
  }
});

// Rate limiting for webhook endpoints
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 webhook requests per minute
  message: {
    success: false,
    message: 'Webhook rate limit exceeded',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Webhook rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method
    });
    
    res.status(429).json({
      success: false,
      message: 'Webhook rate limit exceeded',
      retryAfter: '1 minute'
    });
  }
});

// Custom rate limiter based on user
const createUserRateLimiter = (windowMs, max, message) => {
  const store = new Map();
  
  return (req, res, next) => {
    const key = req.user?.id || req.ip;
    const now = Date.now();
    
    if (!store.has(key)) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const userData = store.get(key);
    
    if (now > userData.resetTime) {
      userData.count = 1;
      userData.resetTime = now + windowMs;
      return next();
    }
    
    if (userData.count >= max) {
      logger.warn('User rate limit exceeded', {
        userId: req.user?.id,
        ip: req.ip,
        url: req.originalUrl,
        method: req.method,
        count: userData.count,
        max: max
      });
      
      return res.status(429).json({
        success: false,
        message: message,
        retryAfter: Math.ceil((userData.resetTime - now) / 1000)
      });
    }
    
    userData.count++;
    next();
  };
};

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  // This would need to be implemented properly for production
  // For now, we rely on the express-rate-limit built-in cleanup
}, 10 * 60 * 1000); // Clean every 10 minutes

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  passwordResetLimiter,
  webhookLimiter,
  createUserRateLimiter
};