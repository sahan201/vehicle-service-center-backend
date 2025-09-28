import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get the current system settings
// @access  Private/Manager
router.route('/')
    .get(authRequired, authorize('Manager'), getSettings);

// @route   PUT /api/settings
// @desc    Update the system settings
// @access  Private/Manager
router.route('/')
    .put(authRequired, authorize('Manager'), updateSettings);

export default router;
