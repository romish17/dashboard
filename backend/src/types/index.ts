import { Request } from 'express';
import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface CreateLinkDto {
  title: string;
  url: string;
  description?: string;
  categoryId?: number;
  isFavorite?: boolean;
}

export interface UpdateLinkDto {
  title?: string;
  url?: string;
  description?: string;
  categoryId?: number | null;
  isFavorite?: boolean;
}

export interface CreateCategoryDto {
  name: string;
  color?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
