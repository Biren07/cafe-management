import { body, param, query } from 'express-validator';
import { BILL_STATUS_LIST } from '../models/billing.model.js';

export const generateBillValidation = [
  body('order')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid Order ID format'),
  body('tax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax must be a non-negative number'),
  body('discount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount must be a non-negative number'),
  body('serviceCharge')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Service charge must be a non-negative number'),
];

export const updateBillStatusValidation = [
  param('id').isMongoId().withMessage('Invalid Bill ID format'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .toUpperCase()
    .isIn(BILL_STATUS_LIST)
    .withMessage(`Status must be one of: ${BILL_STATUS_LIST.join(', ')}`),
];

export const splitBillValidation = [
  param('id').isMongoId().withMessage('Invalid Bill ID format'),
  body('splitCount')
    .notEmpty()
    .withMessage('Split count is required')
    .isInt({ min: 2 })
    .withMessage('Split count must be an integer of at least 2'),
  body('customAmounts')
    .optional()
    .isArray()
    .withMessage('Custom amounts must be an array of numbers'),
  body('customAmounts.*')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Each custom split amount must be a positive number'),
];

export const billIdParamValidation = [
  param('id')
    .notEmpty()
    .withMessage('Bill ID or Receipt Number is required')
    .trim(),
];

export const listBillsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .toUpperCase()
    .isIn(BILL_STATUS_LIST)
    .withMessage(`Status filter must be one of: ${BILL_STATUS_LIST.join(', ')}`),
  query('isSplit')
    .optional()
    .isBoolean()
    .withMessage('isSplit must be a boolean string'),
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
    .isIn(['createdAt', 'updatedAt', 'grandTotal', 'status', 'receiptNumber'])
    .withMessage('sortBy must be one of: createdAt, updatedAt, grandTotal, status, receiptNumber'),
  query('sortOrder')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];
