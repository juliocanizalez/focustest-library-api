import mongoose from 'mongoose';
import User, { UserRole } from '../models/User';
import Book from '../models/Book';
import config from '../config/config';

const seedData = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(config.mongodbUri);
      // eslint-disable-next-line no-console
      console.log('MongoDB Connected for seeding data');
    }

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});

    // Create default users
    const librarian = new User({
      firstName: 'Librarian',
      lastName: 'Role',
      email: 'librarian@mail.com',
      password: 'password123',
      role: UserRole.LIBRARIAN,
    });

    const student = new User({
      firstName: 'Studen',
      lastName: 'Role',
      email: 'student@mail.com',
      password: 'password123',
      role: UserRole.STUDENT,
    });

    await librarian.save();
    await student.save();

    // Create sample books
    const books = [
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        publishedYear: 1960,
        genre: 'Fiction',
        stock: 5,
      },
      {
        title: '1984',
        author: 'George Orwell',
        publishedYear: 1949,
        genre: 'Dystopian',
        stock: 3,
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        publishedYear: 1925,
        genre: 'Classic',
        stock: 2,
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        publishedYear: 1813,
        genre: 'Romance',
        stock: 4,
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        publishedYear: 1937,
        genre: 'Fantasy',
        stock: 7,
      },
    ];

    await Book.insertMany(books);
    console.log('Seed data inserted successfully');

    // Only exit if run directly
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding data:', error);

    // Only exit if run directly
    if (require.main === module) {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

if (require.main === module) {
  seedData();
}

export default seedData;
