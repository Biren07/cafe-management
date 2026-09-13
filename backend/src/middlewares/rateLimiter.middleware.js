import rateLimit from 'express-rate-limit';
import { envConfig } from '../config/env.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { ApiError } from '../utils/ApiError.js';

export const globalRateLimiter = rateLimit({
  windowMs: envConfig.rateLimit.windowMs,
  max: envConfig.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new ApiError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        RESPONSE_MESSAGES.TOO_MANY_REQUESTS
      )
    );
  },
});
