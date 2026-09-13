import morgan from 'morgan';
import { logger } from '../config/logger.js';
import { envConfig } from '../config/env.js';

// Custom morgan format string
const morganFormat = envConfig.isProduction
  ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
  : ':method :url :status :res[content-length] - :response-time ms';

export const requestLogger = morgan(morganFormat, {
  stream: logger.stream,
});
