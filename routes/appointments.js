import express from 'express';
import {
  createAppointment,
  getAllAppointments,
} from '../controllers/appointmentController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create a new appointment
// @route   POST /api/v1/appointments
// @access  Private (Customer)
router.post('/', authRequired, createAppointment);

// @desc    Get all appointments
// @route   GET /api/v1/appointments
// @access  Private (Manager, Mechanic)
router.get(
  '/',
  authRequired,
  authorize('Manager', 'Mechanic'),
  getAllAppointments
);

export default router;

