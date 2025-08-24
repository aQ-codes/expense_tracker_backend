import express from 'express';
import { authenticateUser } from '../middlewares/authenticate-user.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticateUser);

/**
 * @route GET /api/dashboard/summary
 * @desc Get dashboard summary for the authenticated user
 * @access Private
 */
router.get('/summary', (req, res) => {
  // TODO: Implement dashboard summary logic
  res.json({ message: 'Dashboard summary - protected route' });
});

/**
 * @route GET /api/dashboard/expenses
 * @desc Get recent expenses for dashboard
 * @access Private
 */
router.get('/expenses', (req, res) => {
  // TODO: Implement recent expenses logic
  res.json({ message: 'Recent expenses - protected route' });
});

/**
 * @route GET /api/dashboard/charts
 * @desc Get chart data for dashboard
 * @access Private
 */
router.get('/charts', (req, res) => {
  // TODO: Implement chart data logic
  res.json({ message: 'Chart data - protected route' });
});

export default router;
