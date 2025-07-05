import mongoose from 'mongoose';
import { config } from '../config/config';

export async function connectToMongoDB() {
  try {
    await mongoose.connect(config.mongodb.uri, {
      dbName: config.mongodb.dbName
    });
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
} 