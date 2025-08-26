import UserRepository from '../repositories/user-repository.js';

export default class UserController {

    /**
     * Handle validation errors
     * @param {Object} res - Response object
     * @param {String} message - Error message
     * @param {Number} status - HTTP status code
     * @returns {Object} Error response
     */
    static handleError(res, message, status = 400) {
        return res.status(status).json({
            status: false,
            message: message
        });
    }

    /**
     * Get current user profile
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async getProfile(req, res) {
        try {
            const userRepo = new UserRepository();
            const userProfile = await userRepo.getUserProfile(req.user._id);
            
            if (!userProfile) {
                return UserController.handleError(res, 'User not found', 404);
            }

            return res.status(200).json({
                status: true,
                message: 'Profile retrieved successfully',
                data: {
                    user: {
                        id: userProfile._id,
                        name: userProfile.name,
                        email: userProfile.email
                    }
                }
            });
        } catch (error) {
            console.error('Get profile error:', error);
            return UserController.handleError(res, 'Failed to get profile', 500);
        }
    }
}
