import mongoose from 'mongoose';
import { envConfig } from './env.js';
import { logger } from './logger.js';
import { seedDefaultOwner } from '../utils/seedOwner.js';

/**
 * Connect to MongoDB database using Mongoose
 */
export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(envConfig.db.uri);

    logger.info(
      `MongoDB connected successfully! DB Host: ${connectionInstance.connection.host}, DB Name: ${connectionInstance.connection.name}`
    );

    // Seed default owner account if not exists
    await seedDefaultOwner();

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection disconnected.');
    });
  } catch (error) {
    logger.error(`MongoDB initial connection failure: ${error.message}`);
    process.exit(1);
  }
};
