import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';

export const setupMongooseConnectionEvents = () => {
  mongoose.connection.on('connected', () => {
    Logger.log('✅ Connected to MongoDB', 'MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    Logger.error(`❌ MongoDB connection error: ${err}`, '', 'MongoDB');
  });

  mongoose.connection.on('disconnected', () => {
    Logger.warn('⚠️ MongoDB disconnected', 'MongoDB');
  });
};
