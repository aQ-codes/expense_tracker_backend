import Joi from 'joi';

class ExpenseRequest {
    /**
     * Validation schema for creating a new expense
     */
    static createExpenseSchema = Joi.object({
        title: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.base': 'Title must be a string',
                'string.empty': 'Title cannot be empty',
                'string.min': 'Title must be at least 2 characters long',
                'string.max': 'Title must be less than or equal to 100 characters',
                'any.required': 'Title is required'
            }),
        amount: Joi.number()
            .positive()
            .required()
            .messages({
                'number.base': 'Amount must be a number',
                'number.positive': 'Amount must be positive',
                'any.required': 'Amount is required'
            }),
        category: Joi.string()
            .required()
            .messages({
                'string.base': 'Category must be a string',
                'string.empty': 'Category cannot be empty',
                'any.required': 'Category is required'
            }),
        date: Joi.date()
            .iso()
            .required()
            .messages({
                'date.base': 'Date must be a valid date',
                'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
                'any.required': 'Date is required'
            })
    });

    /**
     * Validation schema for updating an expense
     */
    static updateExpenseSchema = Joi.object({
        title: Joi.string()
            .min(2)
            .max(100)
            .optional()
            .messages({
                'string.base': 'Title must be a string',
                'string.empty': 'Title cannot be empty',
                'string.min': 'Title must be at least 2 characters long',
                'string.max': 'Title must be less than or equal to 100 characters'
            }),
        amount: Joi.number()
            .positive()
            .optional()
            .messages({
                'number.base': 'Amount must be a number',
                'number.positive': 'Amount must be positive'
            }),
        category: Joi.string()
            .optional()
            .messages({
                'string.base': 'Category must be a string',
                'string.empty': 'Category cannot be empty'
            }),
        date: Joi.date()
            .iso()
            .optional()
            .messages({
                'date.base': 'Date must be a valid date',
                'date.format': 'Date must be in ISO format (YYYY-MM-DD)'
            })
    });

    /**
     * Validation schema for expense filters
     */
    static expenseFiltersSchema = Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .messages({
                'number.base': 'Page must be a number',
                'number.integer': 'Page must be an integer',
                'number.min': 'Page must be at least 1'
            }),
        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .messages({
                'number.base': 'Limit must be a number',
                'number.integer': 'Limit must be an integer',
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit cannot exceed 100'
            }),
        category: Joi.string()
            .optional()
            .messages({
                'string.base': 'Category must be a string'
            }),
        month: Joi.string()
            .pattern(/^(0[1-9]|1[0-2])$/)
            .optional()
            .messages({
                'string.pattern.base': 'Month must be in MM format (01-12)'
            }),
        startDate: Joi.date()
            .iso()
            .optional()
            .messages({
                'date.base': 'Start date must be a valid date',
                'date.format': 'Start date must be in ISO format (YYYY-MM-DD)'
            }),
        endDate: Joi.date()
            .iso()
            .min(Joi.ref('startDate'))
            .optional()
            .messages({
                'date.base': 'End date must be a valid date',
                'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
                'date.min': 'End date must be after start date'
            })
    });

    /**
     * Validation schema for date range
     */
    static dateRangeSchema = Joi.object({
        startDate: Joi.date()
            .iso()
            .optional()
            .messages({
                'date.base': 'Start date must be a valid date',
                'date.format': 'Start date must be in ISO format (YYYY-MM-DD)'
            }),
        endDate: Joi.date()
            .iso()
            .min(Joi.ref('startDate'))
            .optional()
            .messages({
                'date.base': 'End date must be a valid date',
                'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
                'date.min': 'End date must be after start date'
            })
    });

    /**
     * Validate expense creation data
     * @param {Object} expenseData - The expense data to validate
     * @returns {Object} Validation result
     */
    static validateCreateExpense(expenseData) {
        const { error, value } = this.createExpenseSchema.validate(expenseData, { abortEarly: false });
        
        if (error) {
            return {
                isValid: false,
                errors: error.details.map(detail => detail.message)
            };
        }
        
        return {
            isValid: true,
            data: value
        };
    }

    /**
     * Validate expense update data
     * @param {Object} expenseData - The expense data to validate
     * @returns {Object} Validation result
     */
    static validateUpdateExpense(expenseData) {
        const { error, value } = this.updateExpenseSchema.validate(expenseData, { abortEarly: false });
        
        if (error) {
            return {
                isValid: false,
                errors: error.details.map(detail => detail.message)
            };
        }
        
        return {
            isValid: true,
            data: value
        };
    }

    /**
     * Validate expense filters
     * @param {Object} filters - The filters to validate
     * @returns {Object} Validation result
     */
    static validateExpenseFilters(filters) {
        const { error, value } = this.expenseFiltersSchema.validate(filters, { abortEarly: false });
        
        if (error) {
            return {
                isValid: false,
                errors: error.details.map(detail => detail.message)
            };
        }
        
        return {
            isValid: true,
            data: value
        };
    }

    /**
     * Validation schema for dashboard requests
     */
    static dashboardRequestSchema = Joi.object({
        limit: Joi.number()
            .integer()
            .min(1)
            .max(20)
            .default(5)
            .messages({
                'number.base': 'Limit must be a number',
                'number.integer': 'Limit must be an integer',
                'number.min': 'Limit must be at least 1',
                'number.max': 'Limit cannot exceed 20'
            }),
        months: Joi.number()
            .integer()
            .min(1)
            .max(12)
            .default(6)
            .messages({
                'number.base': 'Months must be a number',
                'number.integer': 'Months must be an integer',
                'number.min': 'Months must be at least 1',
                'number.max': 'Months cannot exceed 12'
            })
    });

    /**
     * Validate date range
     * @param {Object} dateRange - The date range to validate
     * @returns {Object} Validation result
     */
    static validateDateRange(dateRange) {
        const { error, value } = this.dateRangeSchema.validate(dateRange, { abortEarly: false });
        
        if (error) {
            return {
                isValid: false,
                errors: error.details.map(detail => detail.message)
            };
        }
        
        return {
            isValid: true,
            data: value
        };
    }

    /**
     * Validate dashboard request
     * @param {Object} requestData - The request data to validate
     * @returns {Object} Validation result
     */
    static validateDashboardRequest(requestData) {
        const { error, value } = this.dashboardRequestSchema.validate(requestData, { abortEarly: false });
        
        if (error) {
            return {
                isValid: false,
                errors: error.details.map(detail => detail.message)
            };
        }
        
        return {
            isValid: true,
            data: value
        };
    }
}

export default ExpenseRequest;
