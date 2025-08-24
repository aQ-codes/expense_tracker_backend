import CategoryRepository from "../repositories/category-repository.js";
import CategoryResponse from "../responses/category-response.js";
import CategoryRequest from "../requests/category-request.js";
import { CustomValidationError } from "../exceptions/custom-validation-error.js";

const categoryRepo = new CategoryRepository();

export default class CategoryController {
    /**
     * Get all categories for the authenticated user
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async getCategories(req, res) {
        try {
            const userId = req.user._id;
            console.log('Getting categories for user:', userId);
            
            const categories = await categoryRepo.getCategoriesForUser(userId);
            console.log('Raw categories from repository:', categories);
            
            const formattedData = CategoryResponse.formatCategorySet(categories);
            console.log('Formatted categories:', formattedData);
            
            return res.status(200).json({
                status: true,
                message: "Categories retrieved successfully",
                data: formattedData
            });
        } catch (error) {
            console.error('Get categories error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to retrieve categories",
                data: []
            });
        }
    }

    /**
     * Create a new category for the authenticated user
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async createCategory(req, res) {
        try {
            const { name } = req.body;
            const userId = req.user._id;

            // Validate input
            const validation = CategoryRequest.validateCreateCategory({ name });
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }

            // Check if category name already exists for this user
            const nameExists = await CategoryRequest.checkCategoryNameExists(validation.data.name, userId);
            if (nameExists) {
                throw new CustomValidationError(['Category name already exists']);
            }

            // Create category
            const categoryData = {
                name: validation.data.name.trim(),
                isDefault: false,
                createdBy: userId
            };

            const result = await categoryRepo.createCategory(categoryData);
            
            if (result.status) {
                const formattedData = CategoryResponse.formatCategory(result.data);
                return res.status(201).json({
                    status: true,
                    message: "Category created successfully",
                    data: formattedData
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Failed to create category",
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
            
            console.error('Create category error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to create category",
                data: []
            });
        }
    }

    /**
     * Update a category (only user-created categories can be updated)
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const userId = req.user._id;

            // Validate input
            const validation = CategoryRequest.validateUpdateCategory({ name });
            if (!validation.isValid) {
                throw new CustomValidationError(validation.errors);
            }

            // Check if category exists and user owns it
            const category = await categoryRepo.getCategoryById(id);
            if (!category) {
                return res.status(404).json({
                    status: false,
                    message: "Category not found",
                    data: []
                });
            }

            if (category.isDefault) {
                return res.status(403).json({
                    status: false,
                    message: "Cannot update default categories",
                    data: []
                });
            }

            if (category.createdBy.toString() !== userId.toString()) {
                return res.status(403).json({
                    status: false,
                    message: "Not authorized to update this category",
                    data: []
                });
            }

            // Check if new name already exists
            const nameExists = await CategoryRequest.checkCategoryNameExists(validation.data.name, userId);
            if (nameExists && category.name.toLowerCase() !== validation.data.name.trim().toLowerCase()) {
                throw new CustomValidationError(['Category name already exists']);
            }

            // Update category
            const result = await categoryRepo.updateCategory(id, { name: validation.data.name.trim() });
            
            if (result.status) {
                const formattedData = CategoryResponse.formatCategory(result.data);
                return res.status(200).json({
                    status: true,
                    message: "Category updated successfully",
                    data: formattedData
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Failed to update category",
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
            
            console.error('Update category error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to update category",
                data: []
            });
        }
    }

    /**
     * Delete a category (only user-created categories can be deleted)
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id;

            const result = await categoryRepo.deleteCategory(id, userId);
            
            if (result.status) {
                return res.status(200).json({
                    status: true,
                    message: result.message,
                    data: []
                });
            } else {
                return res.status(400).json({
                    status: false,
                    message: result.message,
                    data: []
                });
            }
        } catch (error) {
            console.error('Delete category error:', error);
            return res.status(500).json({
                status: false,
                message: "Failed to delete category",
                data: []
            });
        }
    }
}
