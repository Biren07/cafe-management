import { body, query, param } from 'express-validator';

export const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be URL-friendly hyphen-separated lowercase alphanumeric characters'),
  body('status')
    .optional()
    .toUpperCase()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be either ACTIVE or INACTIVE'),
];

export const updateCategoryValidation = [
  param('id').isMongoId().withMessage('Invalid Category ID format'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be URL-friendly hyphen-separated lowercase alphanumeric characters'),
  body('status')
    .optional()
    .toUpperCase()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status must be either ACTIVE or INACTIVE'),
];

export const listCategoryValidation = [
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
  query('status')
    .optional()
    .toUpperCase()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Status filter must be ACTIVE or INACTIVE'),
  query('sortBy')
    .optional()
    .trim()
    .isIn(['createdAt', 'updatedAt', 'name', 'status', 'slug'])
    .withMessage('sortBy must be one of: createdAt, updatedAt, name, status, slug'),
  query('sortOrder')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];

export const categoryIdParamValidation = [
  param('id').isMongoId().withMessage('Invalid Category ID format'),
];
