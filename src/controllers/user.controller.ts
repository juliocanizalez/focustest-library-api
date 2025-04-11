import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Check if password is provided and if it is, update the user with the new password
 * Otherwise, update the user without changing the password
 * If password is provided, hash it
 */
export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if password is provided and if it is, hash it
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    res.status(200).json(user);
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (_error) {
    console.error(_error);
    res.status(500).json({ message: 'Server error' });
  }
};
