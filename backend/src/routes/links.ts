import { Router } from 'express';
import { body } from 'express-validator';
import {
  getLinks,
  getLink,
  createLink,
  updateLink,
  deleteLink,
  toggleFavorite,
  incrementClicks,
} from '../controllers/linkController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getLinks);
router.get('/:id', getLink);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('url').isURL().withMessage('Valid URL required'),
  ],
  createLink
);

router.put('/:id', updateLink);
router.delete('/:id', deleteLink);
router.post('/:id/favorite', toggleFavorite);
router.post('/:id/click', incrementClicks);

export default router;
