import { body, query, param } from 'express-validator';

export const processPaymentValidation = [
  body('order')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid Order ID format'),
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a non-negative number'),
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .toUpperCase()
    .isIn(['CASH', 'ONLINE'])
    .withMessage('Payment method must be either CASH or ONLINE'),
  body('onlineProvider')
    .optional()
    .toUpperCase()
    .isIn(['FONEPAY', 'ESEWA', 'KHALTI', 'OTHER', ''])
    .withMessage('onlineProvider must be one of: FONEPAY, ESEWA, KHALTI, OTHER'),
  body('paymentStatus')
    .optional()
    .toUpperCase()
    .isIn(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])
    .withMessage('Payment status must be one of: PENDING, COMPLETED, FAILED, REFUNDED'),
  body('referenceNumber')
    .optional()
    .trim()
    .isString()
    .withMessage('Reference number must be a string'),
];

export const updatePaymentStatusValidation = [
  param('id').isMongoId().withMessage('Invalid Payment ID format'),
  body('paymentStatus')
    .notEmpty()
    .withMessage('Payment status is required')
    .toUpperCase()
    .isIn(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])
    .withMessage('Payment status must be one of: PENDING, COMPLETED, FAILED, REFUNDED'),
];

export const listPaymentValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search query must be a string'),
  query('paymentStatus')
    .optional()
    .toUpperCase()
    .isIn(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])
    .withMessage('Payment status filter must be one of: PENDING, COMPLETED, FAILED, REFUNDED'),
  query('paymentMethod')
    .optional()
    .toUpperCase()
    .isIn(['CASH', 'ONLINE'])
    .withMessage('Payment method filter must be CASH or ONLINE'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO8601 date string'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO8601 date string'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['createdAt', 'updatedAt', 'amount', 'paymentStatus', 'invoiceNumber'])
    .withMessage('sortBy must be one of: createdAt, updatedAt, amount, paymentStatus, invoiceNumber'),
  query('sortOrder')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];

export const paymentIdParamValidation = [
  param('id').isMongoId().withMessage('Invalid Payment ID format'),
];
