import { Router } from 'express';
import {
  getCheckouts,
  getUserCheckouts,
  createCheckout,
  returnBook,
} from '../controllers/checkout.controller';
import {
  createCheckoutValidation,
  markReturnedValidation,
} from '../dto/checkout.dto';
import { validate } from '../middlewares/validation.middleware';
import {
  authenticate,
  authorizeLibrarian,
  authorizeStudent,
} from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /checkouts:
 *   get:
 *     summary: Get all checkouts (librarians only)
 *     tags: [Checkouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all checkouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Checkout'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.get('/', authenticate, authorizeLibrarian, getCheckouts);

/**
 * @swagger
 * /checkouts/me:
 *   get:
 *     summary: Get the current user's checkouts
 *     tags: [Checkouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's checkouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Checkout'
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authenticate, getUserCheckouts);

/**
 * @swagger
 * /checkouts:
 *   post:
 *     summary: Create a new checkout (check out a book)
 *     tags: [Checkouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book
 *             properties:
 *               book:
 *                 type: string
 *                 description: Book ID to check out
 *     responses:
 *       201:
 *         description: Checkout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Checkout'
 *       400:
 *         description: Book is out of stock
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Book not found
 */
router.post(
  '/',
  authenticate,
  authorizeStudent,
  createCheckoutValidation,
  validate,
  createCheckout,
);

/**
 * @swagger
 * /checkouts/return:
 *   post:
 *     summary: Return a book (mark a checkout as returned)
 *     tags: [Checkouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - checkoutId
 *             properties:
 *               checkoutId:
 *                 type: string
 *                 description: Checkout ID to mark as returned
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Checkout'
 *       400:
 *         description: Book already returned
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Checkout record not found
 */
router.post(
  '/return',
  authenticate,
  authorizeLibrarian,
  markReturnedValidation,
  validate,
  returnBook,
);

export default router;
