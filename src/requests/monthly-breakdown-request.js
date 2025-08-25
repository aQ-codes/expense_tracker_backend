/**
 * Request validation for monthly breakdown endpoints
 */

export default class MonthlyBreakdownRequest {
    /**
     * Validate monthly breakdown request parameters
     * @param {Object} data - Request data
     * @returns {Object} Validation result
     */
    static validateMonthlyBreakdown(data) {
        const errors = [];
        const validatedData = {};

        // Validate month
        if (!data.month) {
            errors.push('Month is required');
        } else {
            const month = parseInt(data.month);
            if (isNaN(month) || month < 1 || month > 12) {
                errors.push('Month must be a number between 1 and 12');
            } else {
                validatedData.month = month;
            }
        }

        // Validate year
        if (!data.year) {
            errors.push('Year is required');
        } else {
            const year = parseInt(data.year);
            if (isNaN(year) || year < 1900 || year > 2100) {
                errors.push('Year must be a valid year between 1900 and 2100');
            } else {
                validatedData.year = year;
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            data: validatedData
        };
    }

    /**
     * Validate monthly breakdown with pagination
     * @param {Object} data - Request data
     * @returns {Object} Validation result
     */
    static validateMonthlyBreakdownWithPagination(data) {
        const baseValidation = this.validateMonthlyBreakdown(data);
        
        if (!baseValidation.isValid) {
            return baseValidation;
        }

        const errors = [...baseValidation.errors];
        const validatedData = { ...baseValidation.data };

        // Validate page
        if (data.page !== undefined) {
            const page = parseInt(data.page);
            if (isNaN(page) || page < 1) {
                errors.push('Page must be a positive number');
            } else {
                validatedData.page = page;
            }
        } else {
            validatedData.page = 1;
        }

        // Validate limit
        if (data.limit !== undefined) {
            const limit = parseInt(data.limit);
            if (isNaN(limit) || limit < 1 || limit > 100) {
                errors.push('Limit must be a number between 1 and 100');
            } else {
                validatedData.limit = limit;
            }
        } else {
            validatedData.limit = 10;
        }

        return {
            isValid: errors.length === 0,
            errors,
            data: validatedData
        };
    }

    /**
     * Validate date range for monthly breakdown
     * @param {Object} data - Request data
     * @returns {Object} Validation result
     */
    static validateDateRange(data) {
        const errors = [];
        const validatedData = {};

        // Validate startDate
        if (data.startDate) {
            const startDate = new Date(data.startDate);
            if (isNaN(startDate.getTime())) {
                errors.push('Start date must be a valid date');
            } else {
                validatedData.startDate = startDate;
            }
        }

        // Validate endDate
        if (data.endDate) {
            const endDate = new Date(data.endDate);
            if (isNaN(endDate.getTime())) {
                errors.push('End date must be a valid date');
            } else {
                validatedData.endDate = endDate;
            }
        }

        // Validate date range logic
        if (validatedData.startDate && validatedData.endDate) {
            if (validatedData.startDate > validatedData.endDate) {
                errors.push('Start date cannot be after end date');
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            data: validatedData
        };
    }
}
