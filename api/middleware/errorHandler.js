const winston = require('winston');

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'vtc-connect-pro-api' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  const error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  };

  // Log error
  logger.error('API Error', {
    error: error,
    userId: req.user?.id,
    body: req.method !== 'GET' ? req.body : undefined
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.status = 400;
    error.message = 'Données de validation invalides';
    error.details = Object.values(err.errors).map(e => e.message);
  } else if (err.name === 'CastError') {
    error.status = 400;
    error.message = 'ID invalide';
  } else if (err.code === 11000) {
    error.status = 400;
    error.message = 'Ressource déjà existante';
    const field = Object.keys(err.keyValue)[0];
    error.details = [`${field} déjà utilisé`];
  } else if (err.name === 'JsonWebTokenError') {
    error.status = 401;
    error.message = 'Token invalide';
  } else if (err.name === 'TokenExpiredError') {
    error.status = 401;
    error.message = 'Token expiré';
  }

  // Send error response
  res.status(error.status).json({
    success: false,
    message: error.message,
    details: error.details,
    timestamp: error.timestamp,
    requestId: req.id // Add request ID if available
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  const error = {
    message: 'Endpoint non trouvé',
    status: 404,
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString()
  };

  logger.warn('404 Error', error);

  res.status(404).json({
    success: false,
    message: error.message,
    timestamp: error.timestamp
  });
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  // Generate request ID
  req.id = Math.random().toString(36).substring(2, 15);
  
  const start = Date.now();
  
  // Log request
  logger.info('Request', {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('Response', {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id
    });
  });

  next();
};

// Async wrapper to catch errors in async middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  logger,
  errorHandler,
  notFoundHandler,
  requestLogger,
  asyncHandler
};