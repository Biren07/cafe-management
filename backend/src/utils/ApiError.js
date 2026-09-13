import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

/**
 * Custom Error Class for Operational / API Errors
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP Status Code
   * @param {string} message - Error message
   * @param {Array} errors - List of detailed validation or contextual errors
   * @param {string} stack - Optional error stack trace
   */
  constructor(
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message = 'Something went wrong',
    errors = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
