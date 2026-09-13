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

// 1. Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: envConfig.cors.origin,
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

// 7. API Routes Versioning (/api/v1)
app.use('/api/v1', v1Router);

// 8. 404 Not Found Handler
app.use(notFoundHandler);

// 9. Global Error Handler Middleware
app.use(errorHandler);

export default app;
