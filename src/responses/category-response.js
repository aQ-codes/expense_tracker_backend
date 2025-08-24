
export default class CategoryResponse {
    /**
     * Transform a single category into a formatted response object.
     * @param {Object} category - The category object from database.
     * @return {Object} - Formatted category response.
     */
    static formatCategory(category) {
        return {
            id: category._id,
            name: category.name,
            isDefault: category.isDefault,
            createdBy: category.createdBy,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        };
    }

    /**
     * Transform multiple categories into formatted response objects.
     * @param {Array} categories - Array of category objects from database.
     * @return {Array} - Array of formatted category responses.
     */
    static formatCategorySet(categories) {
        return categories.map(category => this.formatCategory(category));
    }
}