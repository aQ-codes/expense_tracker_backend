import UserRepository from '../repositories/user-repository.js';
import JwtService from '../services/jwt-service.js';
import CookieService from '../services/cookie-service.js';
import { CustomValidationError } from '../exceptions/custom-validation-error.js';

export default class AuthController {

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
     * Validate signup data
     * @param {Object} data - Signup data
     * @returns {Array} Validation errors
     */
    static validateSignupData(data) {
        const errors = {};
        
        if (!data.name || data.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters long';
        }
        
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Please provide a valid email address';
        }
        
        if (!data.password || data.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        }
        
        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        return Object.keys(errors).length > 0 ? errors : null;
    }

    /**
     * User signup
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async signup(req, res) {
        try {
            const { name, email, password, confirmPassword } = req.body;
            
            // Validate input data
            const validationErrors = AuthController.validateSignupData(req.body);
            if (validationErrors) {
                throw new CustomValidationError(validationErrors);
            }

            const userRepo = new UserRepository();
            
            // Check if user already exists
            const existingUser = await userRepo.getUserByEmail(email);
            if (existingUser) {
                return AuthController.handleError(res, 'User with this email already exists', 400);
            }

            // Create new user
            const userData = {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: password
            };

            const newUser = await userRepo.createUser(userData);
            

            // Generate JWT token
            const token = JwtService.createToken({
                userId: newUser._id,
                email: newUser.email
            });

            // Set cookie
            CookieService.setAuthCookie(res, token);

            // Return success response
            return res.status(201).json({
                status: true,
                message: 'User registered successfully'
            });

        } catch (error) {
            if (error instanceof CustomValidationError) {
                return res.status(422).json({
                    status: false,
                    message: 'Validation failed',
                    errors: error.errors
                });
            }
            
            console.error('Signup error:', error);
            return AuthController.handleError(res, 'Registration failed', 500);
        }
    }

    /**
     * User login
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Validate input
            if (!email || !password) {
                return AuthController.handleError(res, 'Email and password are required', 400);
            }

            const userRepo = new UserRepository();
            
            // Find user by email
            const user = await userRepo.getUserByEmail(email.toLowerCase().trim());
            if (!user) {
                return AuthController.handleError(res, 'Invalid email or password', 401);
            }

            // Check password
            const isPasswordValid = await user.matchPassword(password);
            if (!isPasswordValid) {
                return AuthController.handleError(res, 'Invalid email or password', 401);
            }

            // Generate JWT token
            const token = JwtService.createToken({
                userId: user._id,
                email: user.email
            });

            // Set cookie
            CookieService.setAuthCookie(res, token);

            // Return success response
            return res.status(200).json({
                status: true,
                message: 'Login successful'
            });

        } catch (error) {
            console.error('Login error:', error);
            return AuthController.handleError(res, 'Login failed', 500);
        }
    }

    /**
     * User logout
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    static async logout(req, res) {
        try {
            // Clear the authentication cookie
            CookieService.clearAuthCookie(res);
            
            return res.status(200).json({
                status: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Logout error:', error);
            return AuthController.handleError(res, 'Logout failed', 500);
        }
    }


}
