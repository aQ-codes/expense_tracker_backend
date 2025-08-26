import express from 'express';
import UserController from '../controllers/user-controller.js';
import { authenticateUser } from '../middlewares/authenticate-user.js';

const router = express.Router();

/**
 * @route GET /api/user/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authenticateUser, UserController.getProfile);

export default router;
