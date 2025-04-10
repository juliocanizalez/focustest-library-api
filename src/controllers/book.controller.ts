import { Request, Response } from 'express';
import Book from '../models/Book';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, genre } = req.query;

    /*
     * FILTER
     * this is a filter that helps us filter the books by title, author, or genre
     * we use the $regex operator to filter the books
     * the $options: 'i' is used to make the filter case insensitive
     *
     * Example:
     * /books?title=The Great Gatsby
     * /books?author=F. Scott Fitzgerald
     * /books?genre=Fiction
     */

    const filter: Record<string, Record<string, string>> = {};

    if (title) {
      filter.title = { $regex: title as string, $options: 'i' };
    }

    if (author) {
      filter.author = { $regex: author as string, $options: 'i' };
    }

    if (genre) {
      filter.genre = { $regex: genre as string, $options: 'i' };
    }

    /*
     * find the books that match the filter
     * if no filter is provided, it will return all the books
     */
    const books = await Book.find(filter);
    res.json(books);
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    res.json(book);
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, author, publishedYear, genre, stock } = req.body;

    // Create book
    const book = new Book({
      title,
      author,
      publishedYear,
      genre,
      stock,
    });

    await book.save();

    res.status(201).json(book);
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, author, publishedYear, genre, stock } = req.body;

    // Find and update book
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        publishedYear,
        genre,
        stock,
      },
      { new: true, runValidators: true },
    );

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    res.json(book);
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    res.json({ message: 'Book removed' });
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};
