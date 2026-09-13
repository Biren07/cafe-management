import { body, param, query } from 'express-validator';
import { TABLE_STATUS_LIST } from '../models/table.model.js';

export const createTableValidation = [
  body('tableNumber')
    .trim()
    .notEmpty()
    .withMessage('Table number is required')
    .isLength({ max: 20 })
    .withMessage('Table number cannot exceed 20 characters'),
  body('tableName')
    .trim()
    .notEmpty()
    .withMessage('Table name is required')
    .isLength({ max: 100 })
    .withMessage('Table name cannot exceed 100 characters'),
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1 })
    .withMessage('Capacity must be an integer of at least 1'),
  body('status')
    .optional()
    .toUpperCase()
    .isIn(TABLE_STATUS_LIST)
    .withMessage(`Status must be one of: ${TABLE_STATUS_LIST.join(', ')}`),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

export const updateTableValidation = [
  body('tableNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Table number cannot be empty')
    .isLength({ max: 20 })
    .withMessage('Table number cannot exceed 20 characters'),
  body('tableName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Table name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Table name cannot exceed 100 characters'),
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be an integer of at least 1'),
  body('status')
    .optional()
    .toUpperCase()
    .isIn(TABLE_STATUS_LIST)
    .withMessage(`Status must be one of: ${TABLE_STATUS_LIST.join(', ')}`),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

export const updateStatusValidation = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .toUpperCase()
    .isIn(TABLE_STATUS_LIST)
    .withMessage(`Status must be one of: ${TABLE_STATUS_LIST.join(', ')}`),
];

export const tableIdParamValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Table ID format'),
];

export const listTablesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  query('status')
    .optional()
    .toUpperCase()
    .isIn(TABLE_STATUS_LIST)
    .withMessage(`Status must be one of: ${TABLE_STATUS_LIST.join(', ')}`),
  query('minCapacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum capacity must be an integer of at least 1'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean string'),
];
