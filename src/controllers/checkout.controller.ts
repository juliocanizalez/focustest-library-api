import { Request, Response } from 'express';
import Book from '../models/Book';
import Checkout from '../models/Checkout';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getCheckouts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const checkouts = await Checkout.find()
      .populate('user', 'firstName lastName email')
      .populate('book', 'title author');

    res.json(checkouts);
  } catch (_error) {
    res.status(500).json({ message: 'Server error' });
    console.error(_error);
  }
};

export const getUserCheckouts = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const checkouts = await Checkout.find({ user: req.user?.id }).populate(
      'book',
      'title author publishedYear genre',
    );

    res.json(checkouts);
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCheckout = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { book: bookId } = req.body;

    // Check if book exists and has stock
    const book = await Book.findById(bookId);

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    if (book.stock <= 0) {
      res.status(400).json({ message: 'Book is out of stock' });
      return;
    }

    // Create checkout
    const checkout = new Checkout({
      user: req.user?.id,
      book: bookId,
    });

    await checkout.save();

    // Decrease book stock
    book.stock -= 1;
    await book.save();

    await checkout.populate('book', 'title author publishedYear genre');

    res.status(201).json(checkout);
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const returnBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { checkoutId } = req.body;

    // Find checkout
    const checkout = await Checkout.findById(checkoutId);

    if (!checkout) {
      res.status(404).json({ message: 'Checkout record not found' });
      return;
    }

    if (checkout.returned) {
      res.status(400).json({ message: 'Book already returned' });
      return;
    }

    // Mark as returned
    checkout.returned = true;
    checkout.returnDate = new Date();
    await checkout.save();

    // Increase book stock
    const book = await Book.findById(checkout.book);

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    book.stock += 1;
    await book.save();

    res.json(checkout);
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};
