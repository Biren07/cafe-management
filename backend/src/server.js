import app from './app.js';
import { envConfig } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './config/logger.js';
import mongoose from 'mongoose';

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! 💥 Shutting down... Reason: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

let server;

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();

  server = app.listen(envConfig.port, () => {
    logger.info(
      `🚀 Cafe Management Server running in [${envConfig.env.toUpperCase()}] mode on port ${envConfig.port}`
    );
    logger.info(`📄 API Docs available at http://localhost:${envConfig.port}/api-docs`);
    logger.info(`🏥 Health Check endpoint at http://localhost:${envConfig.port}/api/v1/health`);
  });
};

startServer();

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION! 💥 Shutting down... Reason: ${err.message}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful Shutdown Signal Handler (SIGTERM / SIGINT)
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Gracefully shutting down server and closing database connection...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await mongoose.connection.close();
      logger.info('MongoDB connection closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
