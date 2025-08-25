import UserRepository from '../repositories/user-repository.js';
import JwtService from '../services/jwt-service.js';
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
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // false in development
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Return success response
            return res.status(201).json({
                status: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email
                    },
                    token
                }
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
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // false in development
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            // Return success response
            return res.status(200).json({
                status: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    },
                    token
                }
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
            console.log('Backend: Logout request received');
            console.log('Backend: Cookies before clearing:', req.cookies);
            
            // Clear the HTTP-only token cookie with exact same options as when it was set
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // false in development
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                path: '/',
                maxAge: 0
            });
            
            // Also try clearing without httpOnly (in case there are client-side cookies)
            res.clearCookie('token', {
                path: '/',
                maxAge: 0
            });
            
            // Set an expired cookie to override any existing ones
            res.cookie('token', '', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // false in development
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                path: '/',
                maxAge: 0,
                expires: new Date(0)
            });
            
            console.log('Backend: HTTP-only cookie cleared with multiple methods');
            
            return res.status(200).json({
                status: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Backend: Logout error:', error);
            // Even if there's an error, try to clear the cookie
            res.clearCookie('token', { path: '/', maxAge: 0 });
            return AuthController.handleError(res, 'Logout failed', 500);
        }
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
                return AuthController.handleError(res, 'User not found', 404);
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
            return AuthController.handleError(res, 'Failed to get profile', 500);
        }
    }
}
