import express from 'express';
import {
  assignJobToMechanic,
  getUnassignedJobs,
  getMechanics,
  orderInventoryItem,
  receiveInventoryStock,
} from '../controllers/managerController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes in this file are for Managers only
router.use(authRequired, authorize('Manager'));

// @desc    Get all unassigned jobs
// @route   GET /api/v1/manager/jobs/unassigned
// @access  Private (Manager)
router.get('/jobs/unassigned', getUnassignedJobs);

// @desc    Assign a job to a mechanic
// @route   PUT /api/v1/manager/jobs/assign/:id
// @access  Private (Manager)
router.put('/jobs/assign/:id', assignJobToMechanic);

// @desc    Get a list of all mechanics
// @route   GET /api/v1/manager/mechanics
// @access  Private (Manager)
router.get('/mechanics', getMechanics);

// @desc    Send an order email for a low-stock item
// @route   POST /api/v1/manager/inventory/order/:id
// @access  Private (Manager)
router.post('/inventory/order/:id', orderInventoryItem);

// @desc    Receive new stock for an inventory item
// @route   PUT /api/v1/manager/inventory/receive/:id
// @access  Private (Manager)
router.put('/inventory/receive/:id', receiveInventoryStock);

export default router;

