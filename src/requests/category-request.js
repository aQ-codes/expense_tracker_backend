import Joi from 'joi';
import CategoryRepository from '../repositories/category-repository.js';

const categoryRepo = new CategoryRepository();

class CategoryRequest {
    /**
     * Validation schema for creating a new category
     */
    static createCategorySchema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.base': 'Category name must be a string',
                'string.empty': 'Category name cannot be empty',
                'string.min': 'Category name must be at least 2 characters long',
                'string.max': 'Category name must be less than or equal to 50 characters',
                'any.required': 'Category name is required'
            })
    });

    /**
     * Validation schema for updating a category
     */
    static updateCategorySchema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.base': 'Category name must be a string',
                'string.empty': 'Category name cannot be empty',
                'string.min': 'Category name must be at least 2 characters long',
                'string.max': 'Category name must be less than or equal to 50 characters',
                'any.required': 'Category name is required'
            })
    });

    /**
     * Validate category creation data
     * @param {Object} categoryData - The category data to validate
     * @returns {Object} Validation result
     */
    static validateCreateCategory(categoryData) {
        const { error, value } = this.createCategorySchema.validate(categoryData, { abortEarly: false });
        
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
     * Validate category update data
     * @param {Object} categoryData - The category data to validate
     * @returns {Object} Validation result
     */
    static validateUpdateCategory(categoryData) {
        const { error, value } = this.updateCategorySchema.validate(categoryData, { abortEarly: false });
        
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
     * Check if category name already exists for user
     * @param {String} name - Category name
     * @param {String} userId - User ID
     * @returns {Promise<Boolean>} True if exists
     */
    static async checkCategoryNameExists(name, userId) {
        try {
            const exists = await categoryRepo.categoryNameExists(name.trim(), userId);
            return exists;
        } catch (error) {
            console.error('Error checking category name existence:', error);
            return false;
        }
    }
}

export default CategoryRequest;
