import express from 'express';
import { createMechanic, getMechanics } from '../controllers/userController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes in this file are for Managers only
router.use(authRequired, authorize('Manager'));

// @desc    Create a new user with the 'Mechanic' role
// @route   POST /api/v1/users/mechanics
// @access  Private (Manager)
router.post('/mechanics', createMechanic);

// @desc    Get a list of all users with the 'Mechanic' role
// @route   GET /api/v1/users/mechanics
// @access  Private (Manager)
router.get('/mechanics', getMechanics);

export default router;

