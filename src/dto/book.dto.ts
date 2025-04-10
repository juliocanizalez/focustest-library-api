import { body } from 'express-validator';

export const createBookValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('publishedYear')
    .notEmpty()
    .withMessage('Published year is required')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(
      `Published year must be between 1000 and ${new Date().getFullYear()}`,
    ),
  body('genre').notEmpty().withMessage('Genre is required'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive number'),
];

export const updateBookValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().notEmpty().withMessage('Author cannot be empty'),
  body('publishedYear')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(
      `Published year must be between 1000 and ${new Date().getFullYear()}`,
    ),
  body('genre').optional().notEmpty().withMessage('Genre cannot be empty'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive number'),
];
