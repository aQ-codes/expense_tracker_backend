import express from 'express';
import { authenticateUser } from '../middlewares/authenticate-user.js';

const router = express.Router();

// All category routes require authentication
router.use(authenticateUser);

/**
 * @route GET /api/categories
 * @desc Get all categories for the authenticated user
 * @access Private
 */
router.get('/', (req, res) => {
  // TODO: Implement get categories logic
  res.json({ message: 'Get categories - protected route' });
});

/**
 * @route POST /api/categories
 * @desc Create a new category
 * @access Private
 */
router.post('/', (req, res) => {
  // TODO: Implement create category logic
  res.json({ message: 'Create category - protected route' });
});

/**
 * @route PUT /api/categories/:id
 * @desc Update a category
 * @access Private
 */
router.put('/:id', (req, res) => {
  // TODO: Implement update category logic
  res.json({ message: 'Update category - protected route' });
});

/**
 * @route DELETE /api/categories/:id
 * @desc Delete a category
 * @access Private
 */
router.delete('/:id', (req, res) => {
  // TODO: Implement delete category logic
  res.json({ message: 'Delete category - protected route' });
});

export default router;
