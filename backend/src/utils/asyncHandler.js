/**
 * Async Error Handler Wrapper for Express Controllers
 * Catches unhandled promise rejections and forwards them to next middleware
 *
 * @param {Function} requestHandler - Async express route handler function
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
