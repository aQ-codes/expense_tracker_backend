import express from 'express';
import { authenticateUser } from '../middlewares/authenticate-user.js';
import MonthlyBreakdownController from '../controllers/monthly-breakdown-controller.js';

const router = express.Router();
const monthlyBreakdownController = new MonthlyBreakdownController();

// All monthly breakdown routes require authentication
router.use(authenticateUser);

/**
 * @route POST /api/monthly-breakdown
 * @desc Get complete monthly breakdown data for a specific month and year
 * @access Private
 */
router.post('/', monthlyBreakdownController.getMonthlyBreakdown.bind(monthlyBreakdownController));

/**
 * @route POST /api/monthly-breakdown/summary
 * @desc Get monthly summary statistics
 * @access Private
 */
router.post('/summary', monthlyBreakdownController.getMonthlySummary.bind(monthlyBreakdownController));

/**
 * @route POST /api/monthly-breakdown/expenses
 * @desc Get monthly expenses list with pagination
 * @access Private
 */
router.post('/expenses', monthlyBreakdownController.getMonthlyExpenses.bind(monthlyBreakdownController));

/**
 * @route POST /api/monthly-breakdown/category-distribution
 * @desc Get monthly category distribution for charts
 * @access Private
 */
router.post('/category-distribution', monthlyBreakdownController.getMonthlyCategoryDistribution.bind(monthlyBreakdownController));

/**
 * @route POST /api/monthly-breakdown/daily
 * @desc Get daily breakdown for the month
 * @access Private
 */
router.post('/daily', monthlyBreakdownController.getDailyBreakdown.bind(monthlyBreakdownController));

/**
 * @route POST /api/monthly-breakdown/export
 * @desc Export monthly expenses to CSV
 * @access Private
 */
router.post('/export', monthlyBreakdownController.exportMonthlyExpenses.bind(monthlyBreakdownController));

export default router;
