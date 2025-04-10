import mongoose, { Document, Schema } from 'mongoose';

export interface ICheckout extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  checkoutDate: Date;
  returnDate: Date | null;
  returned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const checkoutSchema = new Schema<ICheckout>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    checkoutDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    returned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Checkout:
 *       type: object
 *       required:
 *         - user
 *         - book
 *       properties:
 *         user:
 *           type: string
 *           format: uuid
 *           description: User ID who checked out the book
 *         book:
 *           type: string
 *           format: uuid
 *           description: Book ID that was checked out
 *         checkoutDate:
 *           type: string
 *           format: date-time
 *           description: Date when the book was checked out
 *         returnDate:
 *           type: string
 *           format: date-time
 *           description: Date when the book was returned (null if not returned)
 *         returned:
 *           type: boolean
 *           description: Whether the book has been returned
 */

const Checkout = mongoose.model<ICheckout>('Checkout', checkoutSchema);

export default Checkout;
