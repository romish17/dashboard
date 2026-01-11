import axios from 'axios';
import type { User, Link, Category, AuthResponse, AdminStats } from '../types';

// Use same hostname as the browser, with backend port
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001/api`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', { email, password, name });
    return data;
  },
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile');
    return data;
  },
  updateProfile: async (updates: { name?: string; password?: string }): Promise<User> => {
    const { data } = await api.put('/auth/profile', updates);
    return data;
  },
};

export const linkService = {
  getAll: async (params?: { categoryId?: number; favorite?: boolean; search?: string }): Promise<Link[]> => {
    const { data } = await api.get('/links', { params });
    return data;
  },
  getOne: async (id: number): Promise<Link> => {
    const { data } = await api.get(`/links/${id}`);
    return data;
  },
  create: async (link: Partial<Link>): Promise<Link> => {
    const { data } = await api.post('/links', link);
    return data;
  },
  update: async (id: number, link: Partial<Link>): Promise<Link> => {
    const { data } = await api.put(`/links/${id}`, link);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/links/${id}`);
  },
  toggleFavorite: async (id: number): Promise<Link> => {
    const { data } = await api.post(`/links/${id}/favorite`);
    return data;
  },
  incrementClicks: async (id: number): Promise<Link> => {
    const { data } = await api.post(`/links/${id}/click`);
    return data;
  },
};

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },
  getOne: async (id: number): Promise<Category> => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },
  create: async (category: Partial<Category>): Promise<Category> => {
    const { data } = await api.post('/categories', category);
    return data;
  },
  update: async (id: number, category: Partial<Category>): Promise<Category> => {
    const { data } = await api.put(`/categories/${id}`, category);
    return data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get('/admin/stats');
    return data;
  },
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/admin/users');
    return data;
  },
  getUser: async (id: number): Promise<User> => {
    const { data } = await api.get(`/admin/users/${id}`);
    return data;
  },
  createUser: async (user: { email: string; password: string; name: string; role?: string }): Promise<User> => {
    const { data } = await api.post('/admin/users', user);
    return data;
  },
  updateUser: async (id: number, user: Partial<User & { password?: string }>): Promise<User> => {
    const { data } = await api.put(`/admin/users/${id}`, user);
    return data;
  },
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};

export default api;
