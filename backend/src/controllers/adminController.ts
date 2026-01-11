import { Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export async function getUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            links: true,
            categories: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            links: true,
            categories: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password, name, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || Role.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (email && email !== existing.email) {
      const duplicate = await prisma.user.findUnique({ where: { email } });
      if (duplicate) {
        res.status(400).json({ error: 'Email already in use' });
        return;
      }
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (userId === req.user!.userId) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }

    const existing = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const [totalUsers, totalLinks, totalCategories, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.link.count(),
      prisma.category.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

    const topLinks = await prisma.link.findMany({
      take: 5,
      orderBy: { clicks: 'desc' },
      select: {
        id: true,
        title: true,
        url: true,
        clicks: true,
      },
    });

    res.json({
      totalUsers,
      totalLinks,
      totalCategories,
      recentUsers,
      topLinks,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
