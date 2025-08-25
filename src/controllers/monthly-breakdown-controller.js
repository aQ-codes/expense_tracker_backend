import MonthlyBreakdownRepository from "../repositories/monthly-breakdown-repository.js";
import MonthlyBreakdownResponse from "../responses/monthly-breakdown-response.js";
import MonthlyBreakdownRequest from "../requests/monthly-breakdown-request.js";
import { CustomValidationError } from "../exceptions/custom-validation-error.js";

const monthlyBreakdownRepo = new MonthlyBreakdownRepository();

export default class MonthlyBreakdownController {
    /**
     * Get complete monthly breakdown data
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getMonthlyBreakdown(req, res) {
        try {
            const userId = req.user._id;
            const { month, year } = req.body;
            
            // Validate request
            const validation = MonthlyBreakdownRequest.validateMonthlyBreakdown({
                month, year
            });
            
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }
            
            const breakdownData = await monthlyBreakdownRepo.getMonthlyBreakdown(
                userId,
                validation.data.month,
                validation.data.year
            );
            
            const formattedData = MonthlyBreakdownResponse.formatCompleteMonthlyBreakdown(
                breakdownData,
                validation.data.month,
                validation.data.year
            );
            
            return res.status(200).json({
                status: true,
                message: "Monthly breakdown retrieved successfully",
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
            
            console.error('Get monthly breakdown error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve monthly breakdown",
                data: null
            });
        }
    }

    /**
     * Get monthly summary statistics
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getMonthlySummary(req, res) {
        try {
            const userId = req.user._id;
            const { month, year } = req.body;
            
            // Validate request
            const validation = MonthlyBreakdownRequest.validateMonthlyBreakdown({
                month, year
            });
            
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }
            
            const summaryData = await monthlyBreakdownRepo.getMonthlySummary(
                userId,
                validation.data.month,
                validation.data.year
            );
            
            const formattedData = MonthlyBreakdownResponse.formatMonthlySummary(
                summaryData,
                validation.data.month,
                validation.data.year
            );
            
            return res.status(200).json({
                status: true,
                message: "Monthly summary retrieved successfully",
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
            
            console.error('Get monthly summary error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve monthly summary",
                data: null
            });
        }
    }

    /**
     * Get monthly expenses list
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getMonthlyExpenses(req, res) {
        try {
            const userId = req.user._id;
            const { month, year, page, limit } = req.body;
            
            // Validate request
            const validation = MonthlyBreakdownRequest.validateMonthlyBreakdownWithPagination({
                month, year, page, limit
            });
            
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }
            
            const result = await monthlyBreakdownRepo.getMonthlyExpenses(
                userId,
                validation.data.month,
                validation.data.year,
                validation.data.page,
                validation.data.limit
            );
            
            if (result.status) {
                const formattedData = MonthlyBreakdownResponse.formatMonthlyExpenses(result.data);
                
                return res.status(200).json({
                    status: true,
                    message: "Monthly expenses retrieved successfully",
                    data: formattedData,
                    pagination: result.pagination
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Failed to retrieve monthly expenses",
                    data: []
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
            
            console.error('Get monthly expenses error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve monthly expenses",
                data: null
            });
        }
    }

    /**
     * Get monthly category distribution
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getMonthlyCategoryDistribution(req, res) {
        try {
            const userId = req.user._id;
            const { month, year } = req.body;
            
            // Validate request
            const validation = MonthlyBreakdownRequest.validateMonthlyBreakdown({
                month, year
            });
            
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }
            
            const categoryData = await monthlyBreakdownRepo.getMonthlyCategoryDistribution(
                userId,
                validation.data.month,
                validation.data.year
            );
            
            const formattedData = MonthlyBreakdownResponse.formatCategoryDistribution(categoryData);
            
            return res.status(200).json({
                status: true,
                message: "Category distribution retrieved successfully",
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
            
            console.error('Get category distribution error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve category distribution",
                data: null
            });
        }
    }

    /**
     * Get daily breakdown for the month
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getDailyBreakdown(req, res) {
        try {
            const userId = req.user._id;
            const { month, year } = req.body;
            
            // Validate request
            const validation = MonthlyBreakdownRequest.validateMonthlyBreakdown({
                month, year
            });
            
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }
            
            const dailyData = await monthlyBreakdownRepo.getDailyBreakdown(
                userId,
                validation.data.month,
                validation.data.year
            );
            
            const formattedData = MonthlyBreakdownResponse.formatDailyBreakdown(dailyData);
            
            return res.status(200).json({
                status: true,
                message: "Daily breakdown retrieved successfully",
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
            
            console.error('Get daily breakdown error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve daily breakdown",
                data: null
            });
        }
    }

    /**
     * Export monthly expenses to CSV
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async exportMonthlyExpenses(req, res) {
        try {
            const userId = req.user._id;
            const { month, year } = req.body;
            
            // Validate request
            const validation = MonthlyBreakdownRequest.validateMonthlyBreakdown({
                month, year
            });
            
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }
            
            const expenses = await monthlyBreakdownRepo.getMonthlyExpensesForExport(
                userId,
                validation.data.month,
                validation.data.year
            );
            
            const formattedData = MonthlyBreakdownResponse.formatForExport(expenses);
            
            // Generate CSV content
            const csvHeaders = ['Title', 'Amount', 'Category', 'Date'];
            const csvRows = formattedData.map(expense => [
                expense.title,
                expense.amount.toString(),
                expense.category,
                expense.formattedDate
            ]);
            
            const csvContent = [csvHeaders, ...csvRows]
                .map(row => row.map(field => `"${field}"`).join(','))
                .join('\n');
            
            // Return JSON response with CSV content for frontend to handle
            return res.status(200).json({
                status: true,
                message: "Monthly expenses exported successfully",
                data: csvContent
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
            
            console.error('Export monthly expenses error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to export monthly expenses",
                data: null
            });
        }
    }
}
