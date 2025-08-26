import express from 'express';
import UserController from '../controllers/user-controller.js';
import { authenticateUser } from '../middlewares/authenticate-user.js';

const router = express.Router();

/**
 * @route GET /api/user/test
 * @desc Test route to verify user router is working
 * @access Public
 */
router.get('/test', (req, res) => {
  console.log('🧪 User router test route hit!');
  res.json({ 
    status: true, 
    message: 'User router is working!',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route GET /api/user/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authenticateUser, UserController.getProfile);

export default router;
