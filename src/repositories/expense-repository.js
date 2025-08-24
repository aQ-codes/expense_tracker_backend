import Expense from "../models/expense.js";

export default class ExpenseRepository {
    /**
     * Create a new expense
     * @param {Object} expenseData - Expense data
     * @returns {Object} Created expense
     */
    async createExpense(expenseData) {
        try {
            const newExpense = await Expense.create(expenseData);
            return { status: true, data: newExpense };
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Get all expenses for a user with pagination
     * @param {String} userId - User ID
     * @param {Number} page - Page number
     * @param {Number} limit - Items per page
     * @param {Object} filters - Additional filters
     * @returns {Object} Expenses with pagination info
     */
    async getExpensesForUser(userId, page = 1, limit = 10, filters = {}) {
        try {
            const skip = (page - 1) * limit;
            
            // Build query
            const query = { createdBy: userId, ...filters };
            
            // Get total count
            const total = await Expense.countDocuments(query);
            
            // Get expenses with category populated
            const expenses = await Expense.find(query)
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
     * Get expense by ID for a specific user
     * @param {String} expenseId - Expense ID
     * @param {String} userId - User ID
     * @returns {Object} Expense
     */
    async getExpenseById(expenseId, userId) {
        try {
            const expense = await Expense.findOne({ 
                _id: expenseId, 
                createdBy: userId 
            }).populate('category', 'name isDefault');
            
            return expense;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Update an expense
     * @param {String} expenseId - Expense ID
     * @param {String} userId - User ID
     * @param {Object} updateFields - Fields to update
     * @returns {Object} Updated expense
     */
    async updateExpense(expenseId, userId, updateFields) {
        try {
            const updatedExpense = await Expense.findOneAndUpdate(
                { _id: expenseId, createdBy: userId },
                { $set: updateFields },
                { new: true }
            ).populate('category', 'name isDefault');
            
            if (!updatedExpense) {
                return { status: false, message: 'Expense not found or not authorized' };
            }
            
            return { status: true, data: updatedExpense };
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Delete an expense
     * @param {String} expenseId - Expense ID
     * @param {String} userId - User ID
     * @returns {Object} Deletion result
     */
    async deleteExpense(expenseId, userId) {
        try {
            const expense = await Expense.findOne({ 
                _id: expenseId, 
                createdBy: userId 
            });
            
            if (!expense) {
                return { status: false, message: 'Expense not found or not authorized' };
            }
            
            await Expense.findByIdAndDelete(expenseId);
            return { status: true, message: 'Expense deleted successfully' };
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Get expense statistics for a user
     * @param {String} userId - User ID
     * @param {Object} dateRange - Date range filter
     * @returns {Object} Statistics
     */
    async getExpenseStats(userId, dateRange = {}) {
        try {
            const query = { createdBy: userId, ...dateRange };
            
            const stats = await Expense.aggregate([
                { $match: query },
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
     * Get expenses by category for a user
     * @param {String} userId - User ID
     * @param {String} categoryId - Category ID
     * @param {Number} page - Page number
     * @param {Number} limit - Items per page
     * @returns {Object} Expenses by category
     */
    async getExpensesByCategory(userId, categoryId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            
            const total = await Expense.countDocuments({ 
                createdBy: userId, 
                category: categoryId 
            });
            
            const expenses = await Expense.find({ 
                createdBy: userId, 
                category: categoryId 
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
     * Get daily expense data for charts (better for line chart visualization)
     * @param {String} userId - User ID
     * @param {Object} dateRange - Date range filter
     * @returns {Array} Daily expense data
     */
    async getDailyExpenseData(userId, dateRange = {}) {
        try {
            const query = { createdBy: userId, ...dateRange };
            
            const dailyData = await Expense.aggregate([
                { $match: query },
                // Convert date string to date object safely
                {
                    $addFields: {
                        parsedDate: {
                            $toDate: "$date"
                        }
                    }
                },
                // Filter out documents with invalid dates
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
            console.error('Error in getDailyExpenseData:', error);
            throw new Error(error);
        }
    }

    /**
     * Get monthly expense data for charts (fallback method)
     * @param {String} userId - User ID
     * @param {Object} dateRange - Date range filter
     * @returns {Array} Monthly expense data
     */
    async getMonthlyExpenseData(userId, dateRange = {}) {
        try {
            const query = { createdBy: userId, ...dateRange };
            
            const monthlyData = await Expense.aggregate([
                { $match: query },
                // Convert date string to date object safely
                {
                    $addFields: {
                        parsedDate: {
                            $toDate: "$date"
                        }
                    }
                },
                // Filter out documents with invalid dates
                { $match: { parsedDate: { $ne: null } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$parsedDate" },
                            month: { $month: "$parsedDate" }
                        },
                        amount: { $sum: '$amount' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: {
                            $concat: [
                                { $toString: '$_id.month' },
                                '/',
                                { $toString: '$_id.year' }
                            ]
                        },
                        amount: 1
                    }
                },
                { $sort: { month: 1 } }
            ]);
            
            return monthlyData;
        } catch (error) {
            console.error('Error in getMonthlyExpenseData:', error);
            throw new Error(error);
        }
    }

    /**
     * Get monthly expense data for charts (fallback method)
     * @param {String} userId - User ID
     * @param {Object} dateRange - Date range filter
     * @returns {Array} Monthly expense data
     */
    async getMonthlyExpenseDataSimple(userId, dateRange = {}) {
        try {
            const query = { createdBy: userId, ...dateRange };
            
            // Get all expenses and process them in JavaScript
            const expenses = await Expense.find(query);
            
            // Group by month/year
            const monthlyMap = new Map();
            
            expenses.forEach(expense => {
                try {
                    const date = new Date(expense.date);
                    if (isNaN(date.getTime())) {
                        console.log('Invalid date for expense:', expense._id, expense.date);
                        return; // Skip invalid dates
                    }
                    
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1; // getMonth() returns 0-11
                    const key = `${month}/${year}`;
                    
                    if (monthlyMap.has(key)) {
                        monthlyMap.set(key, monthlyMap.get(key) + expense.amount);
                    } else {
                        monthlyMap.set(key, expense.amount);
                    }
                } catch (error) {
                    console.log('Error processing expense date:', expense._id, expense.date, error);
                }
            });
            
            // Convert to array format
            const monthlyData = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
                month,
                amount
            }));
            
            // Sort by month
            monthlyData.sort((a, b) => {
                const [aMonth, aYear] = a.month.split('/').map(Number);
                const [bMonth, bYear] = b.month.split('/').map(Number);
                return aYear - bYear || aMonth - bMonth;
            });
            
            return monthlyData;
        } catch (error) {
            console.error('Error in getMonthlyExpenseDataSimple:', error);
            throw new Error(error);
        }
    }

    /**
     * Get daily expense data for charts (fallback method)
     * @param {String} userId - User ID
     * @param {Object} dateRange - Date range filter
     * @returns {Array} Daily expense data
     */
    async getDailyExpenseDataSimple(userId, dateRange = {}) {
        try {
            const query = { createdBy: userId, ...dateRange };
            
            // Get all expenses and process them in JavaScript
            const expenses = await Expense.find(query);
            
            // Group by date
            const dailyMap = new Map();
            
            expenses.forEach(expense => {
                try {
                    const date = new Date(expense.date);
                    if (isNaN(date.getTime())) {
                        console.log('Invalid date for expense:', expense._id, expense.date);
                        return; // Skip invalid dates
                    }
                    
                    // Format date as YYYY-MM-DD
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
            
            // Convert to array format
            const dailyData = Array.from(dailyMap.entries()).map(([date, amount]) => ({
                date,
                amount
            }));
            
            // Sort by date
            dailyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            return dailyData;
        } catch (error) {
            console.error('Error in getDailyExpenseDataSimple:', error);
            throw new Error(error);
        }
    }

    /**
     * Get category distribution data for charts
     * @param {String} userId - User ID
     * @param {Object} dateRange - Date range filter
     * @returns {Array} Category distribution data
     */
    async getCategoryDistributionData(userId, dateRange = {}) {
        try {
            const query = { createdBy: userId, ...dateRange };
            
            const categoryData = await Expense.aggregate([
                { $match: query },
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
     * Get chart data (daily and category distribution)
     * @param {String} userId - User ID
     * @param {Object} dateRange - Date range filter
     * @returns {Object} Chart data
     */
    async getChartData(userId, dateRange = {}) {
        try {
            console.log('Getting chart data for user:', userId);
            console.log('Date range:', dateRange);
            
            // If no date range provided, default to last 30 days
            let finalDateRange = dateRange;
            if (!dateRange.date && Object.keys(dateRange).length === 0) {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                finalDateRange = {
                    date: {
                        $gte: thirtyDaysAgo
                    }
                };
                console.log('Using default date range (last 30 days):', finalDateRange);
            }
            
            // First, let's check what expenses exist for this user
            const sampleExpenses = await Expense.find({ createdBy: userId }).limit(5);
            console.log('Sample expenses:', sampleExpenses.map(exp => ({
                id: exp._id,
                title: exp.title,
                date: exp.date,
                dateType: typeof exp.date
            })));
            
            let dailyData, categoryDistribution;
            
            try {
                // Try the aggregation approach first
                [dailyData, categoryDistribution] = await Promise.all([
                    this.getDailyExpenseData(userId, finalDateRange),
                    this.getCategoryDistributionData(userId, finalDateRange)
                ]);
            } catch (aggregationError) {
                console.log('Aggregation failed, using simple approach:', aggregationError.message);
                // Fallback to simple approach
                [dailyData, categoryDistribution] = await Promise.all([
                    this.getDailyExpenseDataSimple(userId, finalDateRange),
                    this.getCategoryDistributionData(userId, finalDateRange)
                ]);
            }
            
            console.log('Daily data result:', dailyData);
            console.log('Category distribution result:', categoryDistribution);
            
            return {
                monthlyData: dailyData, // Keep the same key for compatibility
                categoryDistribution
            };
        } catch (error) {
            console.error('Error in getChartData:', error);
            throw new Error(error);
        }
    }

    /**
     * Get all expenses for export (without pagination)
     * @param {String} userId - User ID
     * @param {Object} filters - Filters to apply
     * @returns {Array} All expenses matching filters
     */
    async getExpensesForExport(userId, filters = {}) {
        try {
            const query = { createdBy: userId, ...filters };
            
            const expenses = await Expense.find(query)
                .populate('category', 'name isDefault')
                .sort({ date: -1, createdAt: -1 });
            
            return expenses;
        } catch (error) {
            throw new Error(error);
        }
    }
}
