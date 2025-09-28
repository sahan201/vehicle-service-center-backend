import express from 'express';
import {
  createFeedback,
  getAllFeedback,
} from '../controllers/feedbackController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Submit new feedback for a completed appointment
// @route   POST /api/v1/feedback
// @access  Private (Customer)
router.post('/', authRequired, createFeedback);

// @desc    Get all feedback submissions
// @route   GET /api/v1/feedback
// @access  Private (Manager)
router.get('/', authRequired, authorize('Manager'), getAllFeedback);

export default router;

