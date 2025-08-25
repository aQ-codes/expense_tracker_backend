import express from 'express';
import { authenticateUser } from '../middlewares/authenticate-user.js';
import ExpenseController from '../controllers/expense-controller.js';

const router = express.Router();
const expenseController = new ExpenseController();

// All expense routes require authentication
router.use(authenticateUser);

/**
 * @route POST /api/expenses/list
 * @desc Get all expenses for the authenticated user with pagination and filters
 * @access Private
 */
router.post('/list', expenseController.getExpenses.bind(expenseController));

/**
 * @route POST /api/expenses/get
 * @desc Get a single expense by ID
 * @access Private
 */
router.post('/get', expenseController.getExpenseById.bind(expenseController));

/**
 * @route POST /api/expenses
 * @desc Create a new expense
 * @access Private
 */
router.post('/', expenseController.createExpense.bind(expenseController));

/**
 * @route POST /api/expenses/update
 * @desc Update an expense
 * @access Private
 */
router.post('/update', expenseController.updateExpense.bind(expenseController));

/**
 * @route POST /api/expenses/delete
 * @desc Delete an expense
 * @access Private
 */
router.post('/delete', expenseController.deleteExpense.bind(expenseController));

/**
 * @route POST /api/expenses/stats
 * @desc Get expense statistics for the authenticated user
 * @access Private
 */
router.post('/stats', expenseController.getExpenseStats.bind(expenseController));

/**
 * @route POST /api/expenses/chart-data
 * @desc Get chart data for expense overview
 * @access Private
 */
router.post('/chart-data', expenseController.getChartData.bind(expenseController));

/**
 * @route POST /api/expenses/export
 * @desc Export expenses to CSV
 * @access Private
 */
router.post('/export', expenseController.exportExpenses.bind(expenseController));

/**
 * @route POST /api/expenses/dashboard
 * @desc Get complete dashboard data
 * @access Private
 */
router.post('/dashboard', expenseController.getDashboardData.bind(expenseController));

/**
 * @route POST /api/expenses/dashboard/stats
 * @desc Get dashboard statistics
 * @access Private
 */
router.post('/dashboard/stats', expenseController.getDashboardStats.bind(expenseController));

/**
 * @route POST /api/expenses/dashboard/recent
 * @desc Get recent expenses for dashboard
 * @access Private
 */
router.post('/dashboard/recent', expenseController.getRecentExpenses.bind(expenseController));

/**
 * @route POST /api/expenses/dashboard/distribution
 * @desc Get expense distribution for pie chart
 * @access Private
 */
router.post('/dashboard/distribution', expenseController.getExpenseDistribution.bind(expenseController));

/**
 * @route POST /api/expenses/dashboard/monthly
 * @desc Get monthly expenses data for bar chart
 * @access Private
 */
router.post('/dashboard/monthly', expenseController.getMonthlyExpensesData.bind(expenseController));

export default router;
