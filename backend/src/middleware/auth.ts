import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthRequest } from '../types';
import { verifyToken } from '../utils/jwt';

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== Role.ADMIN) {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}
