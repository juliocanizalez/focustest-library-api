# Library Management System API

A backend for a university library system built with Node.js, Express, and MongoDB.

## Features

- JWT Authentication and Authorization
- User management (Librarians and Students)
- Book management
- Checkout system for borrowing and returning books
- API Documentation with Swagger
- Database integration with MongoDB
- Role-based access control

## Requirements

- Node.js (Made with Node LTS/Jod)
- Docker (for running MongoDB)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd focustest-library-api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/library
   JWT_SECRET=secret
   JWT_EXPIRES_IN=1d
   ```
5. Create the MongoDB with docker and seed the data
   ```bash
   docker run -d -p 27017:27017 --name library mongo:latest
   ```
   ```bash
   npm run seed
   ```
6. Run the application
   ```
   npm run dev
   ```

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication

- POST /api/v1/auth/login - User login
- POST /api/v1/auth/register - User registration

### Users

- GET /api/v1/users - Get all users (Librarian only)
- GET /api/v1/users/me - Get current user
- GET /api/v1/users/:id - Get user by ID (Librarian only)
- POST /api/v1/users - Create a new user (Librarian only)

### Books

- GET /api/v1/books - Get all books (with optional filtering)
- GET /api/v1/books/:id - Get book by ID
- POST /api/v1/books - Create a new book (Librarian only)
- PUT /api/v1/books/:id - Update a book (Librarian only)
- DELETE /api/v1/books/:id - Delete a book (Librarian only)

### Checkouts

- GET /api/v1/checkouts - Get all checkouts (Librarian only)
- GET /api/v1/checkouts/me - Get current user's checkouts
- POST /api/v1/checkouts - Create a checkout (Student only)
- POST /api/v1/checkouts/return - Return a book (Librarian only)

You can also check this [Postman collection](https://www.postman.com/juliocanizalez/library-focustest/documentation/cup19e3/library-api-collection) for more details
