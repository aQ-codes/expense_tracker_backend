import ExpenseRepository from "../repositories/expense-repository.js";
import ExpenseResponse from "../responses/expense-response.js";
import ExpenseRequest from "../requests/expense-request.js";
import { CustomValidationError } from "../exceptions/custom-validation-error.js";

const expenseRepo = new ExpenseRepository();

export default class ExpenseController {
    /**
     * Get all expenses for the authenticated user with pagination
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getExpenses(req, res) {
        try {
            const userId = req.user._id;
            const { page, limit, category, month, startDate, endDate } = req.body;
            
            // Validate filters
            const validation = ExpenseRequest.validateExpenseFilters({
                page, limit, category, month, startDate, endDate
            });
            
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }
            
            const filters = {};
            if (category) filters.category = category;
            if (month) {
                // Convert month to date range
                const year = new Date().getFullYear();
                const startOfMonth = new Date(year, parseInt(month) - 1, 1);
                const endOfMonth = new Date(year, parseInt(month), 0);
                filters.date = {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                };
            }
            if (startDate && endDate) {
                filters.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            
            const result = await expenseRepo.getExpensesForUser(userId, page || 1, limit || 10, filters);
            
            if (result.status) {
                const formattedData = ExpenseResponse.formatExpenseSetWithCategory(result.data);
                
                // Debug: Log the first expense to see if formattedDate is included
                if (formattedData.length > 0) {
                    console.log('First formatted expense:', {
                        id: formattedData[0]._id,
                        title: formattedData[0].title,
                        date: formattedData[0].date,
                        formattedDate: formattedData[0].formattedDate
                    });
                }
                
                return res.status(200).json({
                    status: true,
                    message: "Expenses retrieved successfully",
                    data: formattedData,
                    pagination: result.pagination
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Failed to retrieve expenses",
                    data: []
                });
            }
        } catch (error) {
            if (error instanceof CustomValidationError) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed",
                    data: [],
                    errors: error.errors
                });
            }
            
            console.error('Get expenses error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve expenses",
                data: []
            });
        }
    }

    /**
     * Get a single expense by ID
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getExpenseById(req, res) {
        try {
            const { expenseId } = req.body;
            const userId = req.user._id;
            
            if (!expenseId) {
                throw new CustomValidationError(['Expense ID is required']);
            }
            
            const expense = await expenseRepo.getExpenseById(expenseId, userId);
            
            if (!expense) {
                return res.status(404).json({
                    status: false,
                    message: "Expense not found",
                    data: null
                });
            }
            
            const formattedData = ExpenseResponse.formatExpenseWithCategory(expense);
            
            return res.status(200).json({
                status: true,
                message: "Expense retrieved successfully",
                data: formattedData
            });
        } catch (error) {
            if (error instanceof CustomValidationError) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed",
                    data: null,
                    errors: error.errors
                });
            }
            
            console.error('Get expense by ID error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve expense",
                data: null
            });
        }
    }

    /**
     * Create a new expense
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async createExpense(req, res) {
        try {
            const { title, amount, category, date } = req.body;
            const userId = req.user._id;

            // Validate input
            const validation = ExpenseRequest.validateCreateExpense({
                title, amount, category, date
            });
            
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }

            // Create expense data
            const expenseData = {
                title: validation.data.title.trim(),
                amount: validation.data.amount,
                category: validation.data.category,
                date: validation.data.date,
                createdBy: userId
            };

            const result = await expenseRepo.createExpense(expenseData);
            
            if (result.status) {
                const formattedData = ExpenseResponse.formatExpense(result.data);
                
                return res.status(201).json({
                    status: true,
                    message: "Expense created successfully",
                    data: formattedData
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Failed to create expense",
                    data: null
                });
            }
        } catch (error) {
            if (error instanceof CustomValidationError) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed",
                    data: null,
                    errors: error.errors
                });
            }
            
            console.error('Create expense error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to create expense",
                data: null
            });
        }
    }

    /**
     * Update an expense
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async updateExpense(req, res) {
        try {
            const { expenseId, title, amount, category, date } = req.body;
            const userId = req.user._id;

            if (!expenseId) {
                throw new CustomValidationError(['Expense ID is required']);
            }

            // Validate input
            const validation = ExpenseRequest.validateUpdateExpense({
                title, amount, category, date
            });
            
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }

            // Update fields
            const updateFields = {};
            if (validation.data.title !== undefined) updateFields.title = validation.data.title.trim();
            if (validation.data.amount !== undefined) updateFields.amount = validation.data.amount;
            if (validation.data.category !== undefined) updateFields.category = validation.data.category;
            if (validation.data.date !== undefined) updateFields.date = validation.data.date;

            const result = await expenseRepo.updateExpense(expenseId, userId, updateFields);
            
            if (result.status) {
                const formattedData = ExpenseResponse.formatExpenseWithCategory(result.data);
                
                return res.status(200).json({
                    status: true,
                    message: "Expense updated successfully",
                    data: formattedData
                });
            } else {
                return res.status(404).json({
                    status: false,
                    message: result.message,
                    data: null
                });
            }
        } catch (error) {
            if (error instanceof CustomValidationError) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed",
                    data: null,
                    errors: error.errors
                });
            }
            
            console.error('Update expense error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to update expense",
                data: null
            });
        }
    }

    /**
     * Delete an expense
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async deleteExpense(req, res) {
        try {
            const { expenseId } = req.body;
            const userId = req.user._id;

            if (!expenseId) {
                throw new CustomValidationError(['Expense ID is required']);
            }

            const result = await expenseRepo.deleteExpense(expenseId, userId);
            
            if (result.status) {
                return res.status(200).json({
                    status: true,
                    message: result.message,
                    data: null
                });
            } else {
                return res.status(404).json({
                    status: false,
                    message: result.message,
                    data: null
                });
            }
        } catch (error) {
            if (error instanceof CustomValidationError) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed",
                    data: null,
                    errors: error.errors
                });
            }
            
            console.error('Delete expense error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to delete expense",
                data: null
            });
        }
    }

    /**
     * Get expense statistics for the authenticated user
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getExpenseStats(req, res) {
        try {
            const userId = req.user._id;
            const { startDate, endDate } = req.body;
            
            // Validate date range
            const validation = ExpenseRequest.validateDateRange({ startDate, endDate });
            
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }
            
            const dateRange = {};
            if (startDate && endDate) {
                dateRange.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            
            const stats = await expenseRepo.getExpenseStats(userId, dateRange);
            
            return res.status(200).json({
                status: true,
                message: "Statistics retrieved successfully",
                data: stats
            });
        } catch (error) {
            if (error instanceof CustomValidationError) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed",
                    data: null,
                    errors: error.errors
                });
            }
            
            console.error('Get expense stats error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve statistics",
                data: null
            });
        }
    }

    /**
     * Get chart data for expense overview
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getChartData(req, res) {
        try {
            const userId = req.user._id;
            const { startDate, endDate } = req.body;
            
            // Only validate date range if both dates are provided
            let dateRange = {};
            if (startDate && endDate) {
                const validation = ExpenseRequest.validateDateRange({ startDate, endDate });
                
                if (!validation.isValid) {
                    throw new CustomValidationError(validation.errors);
                }
                
                dateRange.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            
            const rawChartData = await expenseRepo.getChartData(userId, dateRange);
            const formattedChartData = ExpenseResponse.formatChartData(rawChartData);
            
            return res.status(200).json({
                status: true,
                message: "Chart data retrieved successfully",
                data: formattedChartData
            });
        } catch (error) {
            if (error instanceof CustomValidationError) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed",
                    data: null,
                    errors: error.errors
                });
            }
            
            console.error('Get chart data error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve chart data",
                data: null
            });
        }
    }

    /**
     * Export expenses to CSV
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async exportExpenses(req, res) {
        try {
            const userId = req.user._id;
            const { category, month, startDate, endDate } = req.body;
            
            // Validate filters
            const validation = ExpenseRequest.validateExpenseFilters({
                category, month, startDate, endDate
            });
            
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }
            
            const filters = {};
            if (category) filters.category = category;
            if (month) {
                // Convert month to date range
                const year = new Date().getFullYear();
                const startOfMonth = new Date(year, parseInt(month) - 1, 1);
                const endOfMonth = new Date(year, parseInt(month), 0);
                filters.date = {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                };
            }
            if (startDate && endDate) {
                filters.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            
            const expenses = await expenseRepo.getExpensesForExport(userId, filters);
            const formattedData = ExpenseResponse.formatExpenseSetWithCategory(expenses);
            
            // Generate CSV content
            const csvHeaders = ['Title', 'Amount', 'Category', 'Date'];
            const csvRows = formattedData.map(expense => [
                expense.title,
                expense.amount.toString(),
                expense.category.name,
                expense.formattedDate || expense.date
            ]);
            
            const csvContent = [csvHeaders, ...csvRows]
                .map(row => row.map(field => `"${field}"`).join(','))
                .join('\n');
            
            // Set response headers for CSV download
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
            
            return res.status(200).send(csvContent);
        } catch (error) {
            if (error instanceof CustomValidationError) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed",
                    data: null,
                    errors: error.errors
                });
            }
            
            console.error('Export expenses error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to export expenses",
                data: null
            });
        }
    }

    /**
     * Get complete dashboard data
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getDashboardData(req, res) {
        try {
            const userId = req.user._id;
            
            const dashboardData = await expenseRepo.getDashboardData(userId);
            
            // Format the data for frontend
            const formattedData = {
                stats: dashboardData.stats,
                recentExpenses: ExpenseResponse.formatExpenseSetWithCategory(dashboardData.recentExpenses),
                expenseDistribution: ExpenseResponse.formatChartData(dashboardData).categoryDistribution,
                monthlyExpensesData: dashboardData.monthlyData.map(item => ({
                    date: item.month,
                    amount: item.amount
                }))
            };
            
            return res.status(200).json({
                status: true,
                message: "Dashboard data retrieved successfully",
                data: formattedData
            });
        } catch (error) {
            console.error('Get dashboard data error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve dashboard data",
                data: null
            });
        }
    }

    /**
     * Get dashboard statistics
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getDashboardStats(req, res) {
        try {
            const userId = req.user._id;
            
            const stats = await expenseRepo.getDashboardStats(userId);
            
            return res.status(200).json({
                status: true,
                message: "Dashboard statistics retrieved successfully",
                data: stats
            });
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve dashboard statistics",
                data: null
            });
        }
    }

    /**
     * Get recent expenses for dashboard
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getRecentExpenses(req, res) {
        try {
            const userId = req.user._id;
            const { limit = 5 } = req.body;
            
            // Validate request
            const validation = ExpenseRequest.validateDashboardRequest({ limit });
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }
            
            const recentExpenses = await expenseRepo.getRecentExpenses(userId, validation.data.limit);
            const formattedData = ExpenseResponse.formatRecentExpensesForDashboard(recentExpenses);
            
            return res.status(200).json({
                status: true,
                message: "Recent expenses retrieved successfully",
                data: formattedData
            });
        } catch (error) {
            if (error instanceof CustomValidationError) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed",
                    data: null,
                    errors: error.errors
                });
            }
            
            console.error('Get recent expenses error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve recent expenses",
                data: null
            });
        }
    }

    /**
     * Get expense distribution for pie chart
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getExpenseDistribution(req, res) {
        try {
            const userId = req.user._id;
            
            const categoryDistribution = await expenseRepo.getCategoryDistributionData(userId);
            const formattedData = ExpenseResponse.formatChartData({ categoryDistribution }).categoryDistribution;
            
            return res.status(200).json({
                status: true,
                message: "Expense distribution retrieved successfully",
                data: formattedData
            });
        } catch (error) {
            console.error('Get expense distribution error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve expense distribution",
                data: null
            });
        }
    }

    /**
     * Get monthly expenses data for bar chart
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getMonthlyExpensesData(req, res) {
        try {
            const userId = req.user._id;
            const { months = 6 } = req.body;
            
            // Validate request
            const validation = ExpenseRequest.validateDashboardRequest({ months });
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }
            
            const monthlyData = await expenseRepo.getMonthlyExpensesData(userId, validation.data.months);
            
            // Transform the data to match frontend expectations
            const formattedData = monthlyData.map(item => ({
                date: item.month,
                amount: item.amount
            }));
            
            return res.status(200).json({
                status: true,
                message: "Monthly expenses data retrieved successfully",
                data: formattedData
            });
        } catch (error) {
            if (error instanceof CustomValidationError) {
                return res.status(422).json({
                    status: false,
                    message: "Validation failed",
                    data: null,
                    errors: error.errors
                });
            }
            
            console.error('Get monthly expenses data error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve monthly expenses data",
                data: null
            });
        }
    }
}
