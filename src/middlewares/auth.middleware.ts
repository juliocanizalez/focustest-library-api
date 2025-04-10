import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import User, { UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token using properly typed JWT verify
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
    };

    // Find user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Set user in request
    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const authorizeLibrarian = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== UserRole.LIBRARIAN) {
    res
      .status(403)
      .json({ message: 'Access denied: Librarian access required' });
    return;
  }
  next();
};

export const authorizeStudent = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== UserRole.STUDENT) {
    res.status(403).json({ message: 'Access denied: Student access required' });
    return;
  }
  next();
};
