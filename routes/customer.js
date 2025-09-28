import express from 'express';
import { authRequired, authorize } from '../middleware/auth.js';
import { cancelMyAppointment } from '../controllers/customerController.js';
import { submitFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

// Routes for logged-in customers
router.use(authRequired, authorize('Customer'));

// FR-EXT-C2: Customer Appointment Management
router.put('/appointments/:id/cancel', cancelMyAppointment);

// FR-EXT-C3: Customer Feedback
router.post('/feedback', submitFeedback);

export default router;