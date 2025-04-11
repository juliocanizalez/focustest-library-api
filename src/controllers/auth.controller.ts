import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User, { UserRole } from '../models/User';
import config from '../config/config';
import { AuthRequest } from '../middlewares/auth.middleware';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const payload = { id: user._id.toString() };
    const { secret } = config.jwt;
    // Cast expiresIn to a type that satisfies both our custom type and @types/jsonwebtoken
    const options: SignOptions = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expiresIn: config.jwt.expiresIn as any,
    };

    const token = jwt.sign(payload, secret, options);

    res.json({
      token,
      user: {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role = UserRole.STUDENT,
    } = req.body;

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

    // Generate token
    const payload = { id: user._id.toString() };
    const { secret } = config.jwt;
    // Cast expiresIn to a type that satisfies both our custom type and @types/jsonwebtoken
    const options: SignOptions = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expiresIn: config.jwt.expiresIn as any,
    };

    const token = jwt.sign(payload, secret, options);

    res.status(201).json({
      token,
      user: {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAuthenticatedUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get authorization header to extract the token
    const authHeader = req.header('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : '';

    // Generate new token if not provided
    let validToken = token;
    if (!validToken) {
      const payload = { id: user._id.toString() };
      const { secret } = config.jwt;
      const options: SignOptions = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expiresIn: config.jwt.expiresIn as any,
      };
      validToken = jwt.sign(payload, secret, options);
    }

    res.json({
      token: validToken,
      user: {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get authenticated user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
