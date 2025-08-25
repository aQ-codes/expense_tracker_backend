import Expense from "../models/expense.js";

export default class MonthlyBreakdownRepository {
    /**
     * Get monthly breakdown data for a specific month and year
     * @param {String} userId - User ID
     * @param {Number} month - Month number (1-12)
     * @param {Number} year - Year number
     * @returns {Object} Monthly breakdown data
     */
    async getMonthlyBreakdown(userId, month, year) {
        try {
            // Calculate date range for the month
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

            const dateRange = {
                date: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                }
            };

            // Get all data in parallel
            const [summary, expensesResult, categoryDistribution, dailyBreakdown] = await Promise.all([
                this.getMonthlySummary(userId, month, year),
                this.getMonthlyExpenses(userId, month, year),
                this.getMonthlyCategoryDistribution(userId, month, year),
                this.getDailyBreakdown(userId, month, year)
            ]);

            return {
                summary,
                expenses: expensesResult.data || [], // Extract just the expenses array
                categoryDistribution,
                dailyBreakdown
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Get monthly summary statistics
     * @param {String} userId - User ID
     * @param {Number} month - Month number (1-12)
     * @param {Number} year - Year number
     * @returns {Object} Summary statistics
     */
    async getMonthlySummary(userId, month, year) {
        try {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

            const stats = await Expense.aggregate([
                {
                    $match: {
                        createdBy: userId,
                        date: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                        totalExpenses: { $sum: 1 },
                        averageAmount: { $avg: '$amount' }
                    }
                }
            ]);

            return stats[0] || { totalAmount: 0, totalExpenses: 0, averageAmount: 0 };
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Get monthly expenses with pagination
     * @param {String} userId - User ID
     * @param {Number} month - Month number (1-12)
     * @param {Number} year - Year number
     * @param {Number} page - Page number
     * @param {Number} limit - Items per page
     * @returns {Object} Expenses with pagination
     */
    async getMonthlyExpenses(userId, month, year, page = 1, limit = 10) {
        try {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
            const skip = (page - 1) * limit;

            // Get total count
            const total = await Expense.countDocuments({
                createdBy: userId,
                date: { $gte: startOfMonth, $lte: endOfMonth }
            });

            // Get expenses with category populated
            const expenses = await Expense.find({
                createdBy: userId,
                date: { $gte: startOfMonth, $lte: endOfMonth }
            })
            .populate('category', 'name isDefault')
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

            return {
                status: true,
                data: expenses,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Get monthly category distribution
     * @param {String} userId - User ID
     * @param {Number} month - Month number (1-12)
     * @param {Number} year - Year number
     * @returns {Array} Category distribution data
     */
    async getMonthlyCategoryDistribution(userId, month, year) {
        try {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

            const categoryData = await Expense.aggregate([
                {
                    $match: {
                        createdBy: userId,
                        date: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'categoryInfo'
                    }
                },
                { $unwind: '$categoryInfo' },
                {
                    $group: {
                        _id: '$categoryInfo.name',
                        value: { $sum: '$amount' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: '$_id',
                        value: 1
                    }
                },
                { $sort: { value: -1 } }
            ]);

            return categoryData;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Get daily breakdown for the month
     * @param {String} userId - User ID
     * @param {Number} month - Month number (1-12)
     * @param {Number} year - Year number
     * @returns {Array} Daily breakdown data
     */
    async getDailyBreakdown(userId, month, year) {
        try {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

            const dailyData = await Expense.aggregate([
                {
                    $match: {
                        createdBy: userId,
                        date: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                {
                    $addFields: {
                        parsedDate: {
                            $toDate: "$date"
                        }
                    }
                },
                { $match: { parsedDate: { $ne: null } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$parsedDate" },
                            month: { $month: "$parsedDate" },
                            day: { $dayOfMonth: "$parsedDate" }
                        },
                        amount: { $sum: '$amount' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: {
                                    $dateFromParts: {
                                        year: "$_id.year",
                                        month: "$_id.month",
                                        day: "$_id.day"
                                    }
                                }
                            }
                        },
                        amount: 1
                    }
                },
                { $sort: { date: 1 } }
            ]);

            return dailyData;
        } catch (error) {
            console.error('Error in getDailyBreakdown:', error);
            // Fallback to simple approach
            return this.getDailyBreakdownSimple(userId, month, year);
        }
    }

    /**
     * Get daily breakdown using simple approach (fallback)
     * @param {String} userId - User ID
     * @param {Number} month - Month number (1-12)
     * @param {Number} year - Year number
     * @returns {Array} Daily breakdown data
     */
    async getDailyBreakdownSimple(userId, month, year) {
        try {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

            const expenses = await Expense.find({
                createdBy: userId,
                date: { $gte: startOfMonth, $lte: endOfMonth }
            });

            const dailyMap = new Map();

            expenses.forEach(expense => {
                try {
                    const date = new Date(expense.date);
                    if (isNaN(date.getTime())) {
                        return; // Skip invalid dates
                    }

                    const dateKey = date.toISOString().split('T')[0];

                    if (dailyMap.has(dateKey)) {
                        dailyMap.set(dateKey, dailyMap.get(dateKey) + expense.amount);
                    } else {
                        dailyMap.set(dateKey, expense.amount);
                    }
                } catch (error) {
                    console.log('Error processing expense date:', expense._id, expense.date, error);
                }
            });

            const dailyData = Array.from(dailyMap.entries()).map(([date, amount]) => ({
                date,
                amount
            }));

            dailyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            return dailyData;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Get all monthly expenses for export (without pagination)
     * @param {String} userId - User ID
     * @param {Number} month - Month number (1-12)
     * @param {Number} year - Year number
     * @returns {Array} All monthly expenses
     */
    async getMonthlyExpensesForExport(userId, month, year) {
        try {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

            const expenses = await Expense.find({
                createdBy: userId,
                date: { $gte: startOfMonth, $lte: endOfMonth }
            })
            .populate('category', 'name isDefault')
            .sort({ date: -1, createdAt: -1 });

            return expenses;
        } catch (error) {
            throw new Error(error);
        }
    }
}
