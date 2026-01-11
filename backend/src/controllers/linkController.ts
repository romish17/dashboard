import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, CreateLinkDto, UpdateLinkDto } from '../types';

const prisma = new PrismaClient();

export async function getLinks(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { categoryId, favorite, search } = req.query;

    const where: Record<string, unknown> = {
      userId: req.user!.userId,
    };

    if (categoryId) {
      where.categoryId = parseInt(categoryId as string);
    }

    if (favorite === 'true') {
      where.isFavorite = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string } },
        { description: { contains: search as string } },
        { url: { contains: search as string } },
      ];
    }

    const links = await prisma.link.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(links);
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getLink(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const link = await prisma.link.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user!.userId,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    if (!link) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }

    res.json(link);
  } catch (error) {
    console.error('Get link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createLink(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data: CreateLinkDto = req.body;

    const link = await prisma.link.create({
      data: {
        ...data,
        userId: req.user!.userId,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    res.status(201).json(link);
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateLink(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const data: UpdateLinkDto = req.body;

    const existing = await prisma.link.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }

    const link = await prisma.link.update({
      where: { id: parseInt(id) },
      data,
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    res.json(link);
  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteLink(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.link.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }

    await prisma.link.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function toggleFavorite(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.link.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }

    const link = await prisma.link.update({
      where: { id: parseInt(id) },
      data: { isFavorite: !existing.isFavorite },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    res.json(link);
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function incrementClicks(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const existing = await prisma.link.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      res.status(404).json({ error: 'Link not found' });
      return;
    }

    const link = await prisma.link.update({
      where: { id: parseInt(id) },
      data: { clicks: { increment: 1 } },
    });

    res.json(link);
  } catch (error) {
    console.error('Increment clicks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
