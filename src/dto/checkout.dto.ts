import { body } from 'express-validator';

export const createCheckoutValidation = [
  body('book')
    .notEmpty()
    .withMessage('Book ID is required')
    .isMongoId()
    .withMessage('Invalid book ID'),
];

export const markReturnedValidation = [
  body('checkoutId')
    .notEmpty()
    .withMessage('Checkout ID is required')
    .isMongoId()
    .withMessage('Invalid checkout ID'),
];
