import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongod: MongoMemoryServer | undefined;

// Increase timeout for the setup
jest.setTimeout(30000);

beforeAll(async () => {
  try {
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'jest-test-db',
        storageEngine: 'wiredTiger'
      }
    });
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Failed to cleanup test environment:', error);
    throw error;
  }
});

beforeEach(async () => {
  if (!mongoose.connection.db) {
    throw new Error('Database connection not established');
  }
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
