import FormatDate from '../utils/format-date.js';

const formatDate = new FormatDate();

export default class MonthlyBreakdownResponse {
    /**
     * Format monthly breakdown summary data
     * @param {Object} summaryData - Summary statistics
     * @param {Number} month - Month number
     * @param {Number} year - Year number
     * @returns {Object} Formatted summary response
     */
    static formatMonthlySummary(summaryData, month, year) {
        const daysInMonth = new Date(year, month, 0).getDate();
        const averagePerDay = summaryData.totalAmount > 0 ? summaryData.totalAmount / daysInMonth : 0;

        return {
            totalSpent: summaryData.totalAmount || 0,
            totalExpenses: summaryData.totalExpenses || 0,
            averagePerDay: parseFloat(averagePerDay.toFixed(2)),
            daysInMonth: daysInMonth
        };
    }

    /**
     * Format monthly expenses list
     * @param {Array} expenses - Array of expense objects
     * @returns {Array} Formatted expenses with category details
     */
    static formatMonthlyExpenses(expenses) {
        // Safety check: ensure expenses is an array
        if (!Array.isArray(expenses)) {
            console.warn('formatMonthlyExpenses: expenses is not an array:', expenses);
            return [];
        }
        
        return expenses.map(expense => ({
            _id: expense._id,
            title: expense.title,
            amount: expense.amount,
            category: {
                _id: expense.category._id,
                name: expense.category.name,
                isDefault: expense.category.isDefault
            },
            date: expense.date,
            formattedDate: formatDate.formatDateForDisplay(expense.date),
            createdBy: expense.createdBy,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt
        }));
    }

    /**
     * Format category distribution for charts
     * @param {Array} categoryData - Raw category distribution data
     * @returns {Array} Formatted category distribution with colors
     */
    static formatCategoryDistribution(categoryData) {
        // Safety check: ensure categoryData is an array
        if (!Array.isArray(categoryData)) {
            console.warn('formatCategoryDistribution: categoryData is not an array:', categoryData);
            return [];
        }
        
        return categoryData.map(item => ({
            name: item.name,
            value: item.value,
            color: this.getCategoryColor(item.name)
        }));
    }

    /**
     * Format daily breakdown data
     * @param {Array} dailyData - Raw daily expense data
     * @returns {Array} Formatted daily breakdown
     */
    static formatDailyBreakdown(dailyData) {
        // Safety check: ensure dailyData is an array
        if (!Array.isArray(dailyData)) {
            console.warn('formatDailyBreakdown: dailyData is not an array:', dailyData);
            return [];
        }
        
        return dailyData.map(item => ({
            date: item.date,
            amount: item.amount,
            formattedDate: formatDate.formatDateForDisplay(item.date)
        }));
    }

    /**
     * Format complete monthly breakdown data
     * @param {Object} breakdownData - Complete breakdown data
     * @param {Number} month - Month number
     * @param {Number} year - Year number
     * @returns {Object} Formatted complete breakdown response
     */
    static formatCompleteMonthlyBreakdown(breakdownData, month, year) {
        return {
            summary: this.formatMonthlySummary(breakdownData.summary, month, year),
            expenses: this.formatMonthlyExpenses(breakdownData.expenses),
            categoryDistribution: this.formatCategoryDistribution(breakdownData.categoryDistribution),
            dailyBreakdown: this.formatDailyBreakdown(breakdownData.dailyBreakdown)
        };
    }

    /**
     * Get color for category (for chart visualization)
     * @param {String} categoryName - Name of the category
     * @returns {String} Hex color code
     */
    static getCategoryColor(categoryName) {
        const categoryColors = {
            'Food': '#10b981',      // Vibrant green
            'Travel': '#3b82f6',    // Bright blue
            'Bills': '#f59e0b',     // Vibrant orange
            'Shopping': '#ec4899',  // Bright pink
            'Transport': '#8b5cf6', // Vibrant purple
            'Education': '#06b6d4', // Bright cyan
            'Others': '#ef4444'     // Bright red
        };
        return categoryColors[categoryName] || '#6b7280';
    }

    /**
     * Format monthly breakdown for export
     * @param {Array} expenses - Array of expense objects
     * @returns {Array} Formatted expenses for CSV export
     */
    static formatForExport(expenses) {
        return expenses.map(expense => ({
            title: expense.title,
            amount: expense.amount,
            category: expense.category.name,
            date: formatDate.formatDateForDisplay(expense.date),
            formattedDate: formatDate.formatDateForDisplay(expense.date)
        }));
    }
}
