const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection configuration for Cloud
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
};

async function testMongoDBConnection() {
  try {
    console.log('🔄 Testing MongoDB Cloud connection...');
    console.log('URI:', process.env.MONGODB_URI ? 'Set in environment' : 'Not set - using fallback');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vtcconnectpro', mongoOptions);
    
    console.log('✅ Connected to MongoDB');
    
    // Test the connection with a ping
    await mongoose.connection.db.admin().ping();
    console.log('✅ Pinged your deployment. You successfully connected to MongoDB Cloud!');
    
    // Get database stats
    const stats = await mongoose.connection.db.stats();
    console.log('📊 Database stats:', {
      db: stats.db,
      collections: stats.collections,
      objects: stats.objects,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  }
}

// Run the test
testMongoDBConnection();