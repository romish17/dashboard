import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getCategories);
router.get('/:id', getCategory);

router.post(
  '/',
  [body('name').notEmpty().withMessage('Name is required')],
  createCategory
);

router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
