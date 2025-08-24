import express from 'express';
import { authenticateUser } from '../middlewares/authenticate-user.js';

const router = express.Router();

// All expense routes require authentication
router.use(authenticateUser);

/**
 * @route GET /api/expenses
 * @desc Get all expenses for the authenticated user
 * @access Private
 */
router.get('/', (req, res) => {
  // TODO: Implement get expenses logic
  res.json({ message: 'Get expenses - protected route' });
});

/**
 * @route POST /api/expenses
 * @desc Create a new expense
 * @access Private
 */
router.post('/', (req, res) => {
  // TODO: Implement create expense logic
  res.json({ message: 'Create expense - protected route' });
});

/**
 * @route PUT /api/expenses/:id
 * @desc Update an expense
 * @access Private
 */
router.put('/:id', (req, res) => {
  // TODO: Implement update expense logic
  res.json({ message: 'Update expense - protected route' });
});

/**
 * @route DELETE /api/expenses/:id
 * @desc Delete an expense
 * @access Private
 */
router.delete('/:id', (req, res) => {
  // TODO: Implement delete expense logic
  res.json({ message: 'Delete expense - protected route' });
});

export default router;
