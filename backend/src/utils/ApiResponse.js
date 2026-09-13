import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

/**
 * Standardized API Response Structure
 */
export class ApiResponse {
  /**
   * @param {number} statusCode - HTTP Status Code
   * @param {any} data - Response payload
   * @param {string} message - Response descriptive message
   */
  constructor(statusCode = HTTP_STATUS.OK, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
