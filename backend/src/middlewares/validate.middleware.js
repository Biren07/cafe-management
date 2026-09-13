import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

/**
 * Middleware to process express-validator errors
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    throw new ApiError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      'Validation Failed',
      formattedErrors
    );
  }
  next();
};
