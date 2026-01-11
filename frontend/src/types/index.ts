export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  _count?: {
    links: number;
    categories: number;
  };
}

export interface Category {
  id: number;
  name: string;
  color: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    links: number;
  };
}

export interface Link {
  id: number;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  clicks: number;
  isFavorite: boolean;
  userId: number;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
    color: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AdminStats {
  totalUsers: number;
  totalLinks: number;
  totalCategories: number;
  recentUsers: User[];
  topLinks: Link[];
}
