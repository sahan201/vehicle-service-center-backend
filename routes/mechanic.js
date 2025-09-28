import express from 'express';
import {
  getMyAssignedJobs,
  startService,
  finishService,
  addPartToJob,
  addLaborToJob,
} from '../controllers/mechanicController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes in this file are for Mechanics only
router.use(authRequired, authorize('Mechanic'));

// @desc    Get the job queue for the logged-in mechanic
// @route   GET /api/v1/mechanic/jobs
// @access  Private (Mechanic)
router.get('/jobs', getMyAssignedJobs);

// @desc    Start a service (sets status to In Progress)
// @route   PUT /api/v1/mechanic/jobs/start/:id
// @access  Private (Mechanic)
router.put('/jobs/start/:id', startService);

// @desc    Finish a service (sets status to Completed and calculates final cost)
// @route   PUT /api/v1/mechanic/jobs/finish/:id
// @access  Private (Mechanic)
router.put('/jobs/finish/:id', finishService);

// @desc    Add a part from inventory to a job's itemized list
// @route   POST /api/v1/mechanic/jobs/:id/parts
// @access  Private (Mechanic)
router.post('/jobs/:id/parts', addPartToJob);

// @desc    Add a labor charge to a job's itemized list
// @route   POST /api/v1/mechanic/jobs/:id/labor
// @access  Private (Mechanic)
router.post('/jobs/:id/labor', addLaborToJob);

export default router;

