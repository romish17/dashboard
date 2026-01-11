import { Router } from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getStats,
} from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/users/:id', getUser);

router.post(
  '/users',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  createUser
);

router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
