import { body, query, param } from 'express-validator';

export const createInventoryValidation = [
  body('itemName')
    .trim()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Item name must be between 2 and 100 characters'),
  body('unit')
    .trim()
    .notEmpty()
    .withMessage('Unit of measurement is required')
    .isLength({ max: 30 })
    .withMessage('Unit cannot exceed 30 characters'),
  body('minimumStock')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum stock must be a non-negative number'),
  body('currentStock')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current stock must be a non-negative number'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid Category ID format'),
];

export const stockMovementValidation = [
  param('id').isMongoId().withMessage('Invalid Inventory Item ID format'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isFloat({ gt: 0 })
    .withMessage('Quantity must be a number greater than 0'),
  body('reason')
    .optional()
    .trim()
    .isString()
    .withMessage('Reason must be a string'),
];

export const updateInventoryValidation = [
  param('id').isMongoId().withMessage('Invalid Inventory Item ID format'),
  body('itemName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Item name cannot be empty')
    .isLength({ min: 2, max: 100 }),
  body('unit')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Unit cannot be empty')
    .isLength({ max: 30 }),
  body('minimumStock')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum stock must be a non-negative number'),
  body('currentStock')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current stock must be a non-negative number'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid Category ID format'),
];

export const listInventoryValidation = [
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
  query('category')
    .optional()
    .isMongoId()
    .withMessage('Category filter must be a valid MongoId'),
  query('isLowStock')
    .optional()
    .isBoolean()
    .withMessage('isLowStock filter must be a boolean (true or false)'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['createdAt', 'updatedAt', 'itemName', 'currentStock', 'minimumStock'])
    .withMessage('sortBy must be one of: createdAt, updatedAt, itemName, currentStock, minimumStock'),
  query('sortOrder')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];

export const inventoryIdParamValidation = [
  param('id').isMongoId().withMessage('Invalid Inventory Item ID format'),
];
