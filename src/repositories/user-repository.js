import User from '../models/user.js'

export default class UserRepository {

    /**
     * Get user by email
     * @param {String} email - User's email
     * @return {Promise<User>} User object
     */
    async getUserByEmail(email) {
        return await User.findOne({ email: email });
    }

    /**
     * Get user by id
     * @param {String} userId - User's ID
     * @return {Promise<User>} User object
     */
    async getUserById(userId) {
        return await User.findOne({ _id: userId });
    }

    /**
     * Create new user
     * @param {Object} userData - User data
     * @return {Promise<User>} Created user object
     */
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    /**
     * Update user profile
     * @param {String} userId - User's ID
     * @param {Object} updateData - Data to update
     * @return {Promise<User>} Updated user object
     */
    async updateUserProfile(userId, updateData) {
        return await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );
    }

    /**
     * Check if email exists (for validation)
     * @param {String} email - Email to check
     * @param {String} excludeUserId - User ID to exclude from check
     * @return {Promise<User>} User object if exists
     */
    async checkEmailExists(email, excludeUserId = null) {
        const query = { email: email };
        if (excludeUserId) {
            query._id = { $ne: excludeUserId };
        }
        return await User.findOne(query);
    }
}
