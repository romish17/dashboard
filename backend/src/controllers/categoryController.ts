import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, CreateCategoryDto, UpdateCategoryDto } from '../types';

const prisma = new PrismaClient();

export async function getCategories(req: AuthRequest, res: Response): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user!.userId },
      include: {
        _count: {
          select: { links: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user!.userId,
      },
      include: {
        _count: {
          select: { links: true },
        },
      },
    });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data: CreateCategoryDto = req.body;

    const existing = await prisma.category.findFirst({
      where: {
        name: data.name,
        userId: req.user!.userId,
      },
    });

    if (existing) {
      res.status(400).json({ error: 'Category already exists' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        ...data,
        userId: req.user!.userId,
      },
      include: {
        _count: {
          select: { links: true },
        },
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const data: UpdateCategoryDto = req.body;

    const existing = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (data.name) {
      const duplicate = await prisma.category.findFirst({
        where: {
          name: data.name,
          userId: req.user!.userId,
          id: { not: parseInt(id) },
        },
      });

      if (duplicate) {
        res.status(400).json({ error: 'Category name already exists' });
        return;
      }
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data,
      include: {
        _count: {
          select: { links: true },
        },
      },
    });

    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
