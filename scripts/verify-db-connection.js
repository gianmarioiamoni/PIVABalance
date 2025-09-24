#!/usr/bin/env node

/**
 * Verifica la connessione a MongoDB Atlas per il deployment
 */

const mongoose = require('mongoose');

async function verifyDatabaseConnection() {
  console.log('🔍 Verifying MongoDB Atlas connection...\n');

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('Please set MONGODB_URI in your .env.local file or environment');
    process.exit(1);
  }

  // Mask the password in the URI for logging
  const maskedUri = mongoUri.replace(/:([^:@]{1,})+@/, ':****@');
  console.log(`📡 Connecting to: ${maskedUri}`);

  try {
    // Connect with production-ready options
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      minPoolSize: 1,
    });

    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test basic operations
    console.log('\n🧪 Testing basic database operations...');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📋 Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`   - ${col.name}`));

    // Test a simple operation
    const stats = await mongoose.connection.db.stats();
    console.log(`\n📊 Database stats:`);
    console.log(`   - Database: ${stats.db}`);
    console.log(`   - Collections: ${stats.collections}`);
    console.log(`   - Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);

    console.log('\n🎉 Database verification completed successfully!');
    console.log('\n✅ Your MongoDB Atlas setup is ready for production deployment.');

  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(error.message);
    
    // Common error messages and solutions
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Possible solutions:');
      console.log('   1. Check your MongoDB Atlas username and password');
      console.log('   2. Verify the connection string format');
      console.log('   3. Ensure your IP address is whitelisted in MongoDB Atlas');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Possible solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify the cluster endpoint in your connection string');
      console.log('   3. Ensure your cluster is running in MongoDB Atlas');
    } else if (error.message.includes('serverSelectionTimeoutMS')) {
      console.log('\n🔧 Possible solutions:');
      console.log('   1. Add 0.0.0.0/0 to IP Access List in MongoDB Atlas');
      console.log('   2. Check your network/firewall settings');
      console.log('   3. Verify your cluster is in the correct region');
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB Atlas');
  }
}

// Run the verification
verifyDatabaseConnection().catch(console.error);
