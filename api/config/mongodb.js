const mongoose = require('mongoose');

/**
 * MongoDB Cloud configuration options
 * Compatible with MongoDB Atlas and Cloud deployments
 */
const mongoCloudOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
};

/**
 * Connect to MongoDB Cloud with proper error handling
 * @param {string} uri - MongoDB connection URI
 * @returns {Promise} Connection promise
 */
async function connectToMongoDB(uri) {
  try {
    await mongoose.connect(uri, mongoCloudOptions);
    console.log('✅ Connected to MongoDB Cloud');
    
    // Test the connection with a ping
    await mongoose.connection.db.admin().ping();
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

/**
 * Get MongoDB connection status
 * @returns {Object} Connection status information
 */
function getConnectionStatus() {
  const readyState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    status: states[readyState] || 'unknown',
    readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name
  };
}

module.exports = {
  mongoCloudOptions,
  connectToMongoDB,
  getConnectionStatus
};