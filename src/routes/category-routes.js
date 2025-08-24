import express from 'express';
import { authenticateUser } from '../middlewares/authenticate-user.js';
import CategoryController from '../controllers/category-controller.js';

const router = express.Router();
const categoryController = new CategoryController();

// All category routes require authentication
router.use(authenticateUser);

/**
 * @route POST /api/categories
 * @desc Get all categories for the authenticated user (default + user-specific)
 * @access Private
 */
router.post('/', categoryController.getCategories.bind(categoryController));

/**
 * @route POST /api/categories/create
 * @desc Create a new category for the authenticated user
 * @access Private
 */
router.post('/create', categoryController.createCategory.bind(categoryController));

/**
 * @route POST /api/categories/update/:id
 * @desc Update a category (only user-created categories)
 * @access Private
 */
router.post('/update/:id', categoryController.updateCategory.bind(categoryController));

/**
 * @route POST /api/categories/delete/:id
 * @desc Delete a category (only user-created categories)
 * @access Private
 */
router.post('/delete/:id', categoryController.deleteCategory.bind(categoryController));

export default router;
