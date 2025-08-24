import express from 'express';
import { authenticateUser } from '../middlewares/authenticate-user.js';
import CategoryController from '../controllers/category-controller.js';

const router = express.Router();
const categoryController = new CategoryController();

// All category routes require authentication
router.use(authenticateUser);

/**
 * @route GET /api/categories
 * @desc Get all categories for the authenticated user (default + user-specific)
 * @access Private
 */
router.get('/', categoryController.getCategories.bind(categoryController));

/**
 * @route POST /api/categories
 * @desc Create a new category for the authenticated user
 * @access Private
 */
router.post('/', categoryController.createCategory.bind(categoryController));

/**
 * @route PUT /api/categories/:id
 * @desc Update a category (only user-created categories)
 * @access Private
 */
router.put('/:id', categoryController.updateCategory.bind(categoryController));

/**
 * @route DELETE /api/categories/:id
 * @desc Delete a category (only user-created categories)
 * @access Private
 */
router.delete('/:id', categoryController.deleteCategory.bind(categoryController));

export default router;
