import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { envConfig } from './config/env.js';
import { setupSwagger } from './config/swagger.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';
import { globalRateLimiter } from './middlewares/rateLimiter.middleware.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';
import v1Router from './routes/v1/index.js';

const app = express();

// Trust reverse proxy (Render, Cloudflare, Heroku, etc.)
app.set('trust proxy', 1);

// 1. Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Dynamic CORS configuration supporting multiple origins, wildcard, and credentials
const configuredOrigin = envConfig.cors.origin;
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, server-to-server, Render pings)
      if (!origin) return callback(null, true);

      if (configuredOrigin === '*' || !configuredOrigin) {
        return callback(null, true);
      }

      const allowedOrigins = configuredOrigin.split(',').map((o) => o.trim());
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// 2. Performance Middlewares
app.use(compression());

// 3. Request Rate Limiter
app.use(globalRateLimiter);

// 4. Request Logging (Morgan -> Winston)
app.use(requestLogger);

// 5. Body & Cookie Parsing
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// 6. Swagger API Documentation
setupSwagger(app);

// Root route for cloud deployment health check & service status
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cafe Management System API is running smoothly',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      documentation: '/api-docs',
    },
  });
});

// 7. API Routes Versioning (/api/v1)
app.use('/api/v1', v1Router);

// 8. 404 Not Found Handler
app.use(notFoundHandler);

// 9. Global Error Handler Middleware
app.use(errorHandler);

export default app;
