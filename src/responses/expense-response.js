import FormatDate from '../utils/format-date.js';

const formatDate = new FormatDate();

export default class ExpenseResponse {
    /**
     * Transform a single expense into a formatted response object.
     * @param {Object} expense - The expense object from database.
     * @return {Object} - Formatted expense response.
     */
    static formatExpense(expense) {
        return {
            _id: expense._id,
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            formattedDate: formatDate.formatDateForDisplay(expense.date),
            createdBy: expense.createdBy,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt
        };
    }

    /**
     * Transform multiple expenses into formatted response objects.
     * @param {Array} expenses - Array of expense objects from database.
     * @return {Array} - Array of formatted expense responses.
     */
    static formatExpenseSet(expenses) {
        return expenses.map(expense => this.formatExpense(expense));
    }

    /**
     * Transform expense with populated category details.
     * @param {Object} expense - The expense object with populated category.
     * @return {Object} - Formatted expense response with category details.
     */
    static formatExpenseWithCategory(expense) {
        return {
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
        };
    }

    /**
     * Transform multiple expenses with populated category details.
     * @param {Array} expenses - Array of expense objects with populated categories.
     * @return {Array} - Array of formatted expense responses with category details.
     */
    static formatExpenseSetWithCategory(expenses) {
        return expenses.map(expense => this.formatExpenseWithCategory(expense));
    }

    /**
     * Transform chart data for line chart component.
     * @param {Object} chartData - Raw chart data from repository.
     * @return {Object} - Formatted chart data for frontend.
     */
    static formatChartData(chartData) {
        return {
            monthlyData: chartData.monthlyData.map(item => ({
                date: item.date, // Now using actual date format (YYYY-MM-DD)
                amount: item.amount
            })),
            categoryDistribution: chartData.categoryDistribution.map(item => ({
                name: item.name,
                value: item.value,
                color: this.getCategoryColor(item.name)
            }))
        };
    }

    /**
     * Get color for category (for chart visualization).
     * @param {String} categoryName - Name of the category.
     * @return {String} - Hex color code.
     */
    static getCategoryColor(categoryName) {
        const categoryColors = {
            'Food': '#dcfce7',
            'Travel': '#dbeafe',
            'Bills': '#fef3c7',
            'Shopping': '#fce7f3',
            'Transport': '#f3e8ff',
            'Education': '#fef3c7',
            'Others': '#fee2e2'
        };
        return categoryColors[categoryName] || '#f3f4f6';
    }

    /**
     * Format recent expenses for dashboard display.
     * @param {Array} expenses - Array of expense objects with populated categories.
     * @return {Array} - Array of formatted recent expenses for dashboard.
     */
    static formatRecentExpensesForDashboard(expenses) {
        return expenses.map(expense => ({
            _id: expense._id,
            title: expense.title,
            amount: expense.amount,
            date: expense.date,
            formattedDate: formatDate.formatDateForDisplay(expense.date),
            category: {
                _id: expense.category._id,
                name: expense.category.name,
                color: this.getCategoryColor(expense.category.name)
                // Don't send icon from backend, let frontend handle it
            },
            createdBy: expense.createdBy
        }));
    }

    /**
     * Get icon for category (for dashboard display).
     * @param {String} categoryName - Name of the category.
     * @return {String} - Icon identifier.
     */
    static getCategoryIcon(categoryName) {
        const categoryIcons = {
            'Food': '🍽️',
            'Travel': '✈️',
            'Bills': '📄',
            'Shopping': '🛍️',
            'Transport': '🚗',
            'Education': '📚',
            'Others': '📦'
        };
        return categoryIcons[categoryName] || '📦';
    }
}
