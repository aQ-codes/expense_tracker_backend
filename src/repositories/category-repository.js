import Category from "../models/category.js";

export default class CategoryRepository {
    /**
     * Create a new category
     * @param {Object} categoryData - Category data with name and userId
     * @returns {Object} Created category
     */
    async createCategory(categoryData) {
        try {
            const newCategory = await Category.create(categoryData);
            return { status: true, data: newCategory };
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Get all categories for a user (default + user-specific)
     * @param {String} userId - User ID
     * @returns {Array} Categories available to the user
     */
    async getCategoriesForUser(userId) {
        try {
            const categories = await Category.find({
                $or: [
                    { isDefault: true }, // Default categories available to all users
                    { createdBy: userId } // User's own categories
                ]
            }).sort({ isDefault: -1, name: 1 }); // Default categories first, then alphabetically
            
            return categories;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Get all categories (admin function)
     * @returns {Array} All categories
     */
    async getAllCategories() {
        try {
            const categories = await Category.find().sort({ isDefault: -1, name: 1 });
            return categories;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Update a category
     * @param {String} categoryId - Category ID
     * @param {Object} updateFields - Fields to update
     * @returns {Object} Updated category
     */
    async updateCategory(categoryId, updateFields) {
        try {
            const updatedCategory = await Category.findByIdAndUpdate(
                categoryId,
                { $set: updateFields },
                { new: true }
            );
            return { status: true, data: updatedCategory };
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Get category by ID
     * @param {String} categoryId - Category ID
     * @returns {Object} Category
     */
    async getCategoryById(categoryId) {
        try {
            const category = await Category.findById(categoryId);
            return category;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Delete a category (only user-created categories can be deleted)
     * @param {String} categoryId - Category ID
     * @param {String} userId - User ID (to verify ownership)
     * @returns {Object} Deletion result
     */
    async deleteCategory(categoryId, userId) {
        try {
            const category = await Category.findById(categoryId);
            
            if (!category) {
                return { status: false, message: 'Category not found' };
            }

            // Only allow deletion of user-created categories
            if (category.isDefault) {
                return { status: false, message: 'Cannot delete default categories' };
            }

            if (category.createdBy.toString() !== userId) {
                return { status: false, message: 'Not authorized to delete this category' };
            }

            await Category.findByIdAndDelete(categoryId);
            return { status: true, message: 'Category deleted successfully' };
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Check if category name exists for user
     * @param {String} name - Category name
     * @param {String} userId - User ID
     * @returns {Boolean} True if exists
     */
    async categoryNameExists(name, userId) {
        try {
            const category = await Category.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') }, // Case-insensitive
                $or: [
                    { isDefault: true },
                    { createdBy: userId }
                ]
            });
            return !!category;
        } catch (error) {
            throw new Error(error);
        }
    }
}