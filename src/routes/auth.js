import express from 'express';
import AuthController from '../controllers/auth-controller.js';
import { authenticateUser } from '../middlewares/authenticate-user.js';

const router = express.Router();

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 */
router.post('/signup', AuthController.signup);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', AuthController.login);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Public (no auth required since we're logging out)
 */
router.post('/logout', AuthController.logout);



export default router;
