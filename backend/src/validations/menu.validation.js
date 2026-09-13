import { body, query, param } from 'express-validator';

export const createMenuValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Menu item name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid Category ID format'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a number greater than or equal to 0'),
  body('isAvailable')
    .optional()
    .customSanitizer((value) => {
      if (typeof value === 'string') return value.toLowerCase() === 'true';
      return Boolean(value);
    })
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
];

export const updateMenuValidation = [
  param('id').isMongoId().withMessage('Invalid Menu Item ID format'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid Category ID format'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a number greater than or equal to 0'),
  body('isAvailable')
    .optional()
    .customSanitizer((value) => {
      if (typeof value === 'string') return value.toLowerCase() === 'true';
      return Boolean(value);
    })
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
];

export const listMenuValidation = [
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
  query('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable filter must be a boolean (true or false)'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a number >= 0'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a number >= 0'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['createdAt', 'updatedAt', 'price', 'name'])
    .withMessage('sortBy must be one of: createdAt, updatedAt, price, name'),
  query('sortOrder')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];

export const menuIdParamValidation = [
  param('id').isMongoId().withMessage('Invalid Menu Item ID format'),
];
