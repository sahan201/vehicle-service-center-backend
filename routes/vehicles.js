import express from 'express';
import {
  addVehicle,
  getMyVehicles,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes in this file are for Customers only
router.use(authRequired, authorize('Customer'));

// @desc    Add a new vehicle to the logged-in user's profile
// @route   POST /api/v1/vehicles
// @access  Private (Customer)
router.post('/', addVehicle);

// @desc    Get all vehicles for the logged-in user
// @route   GET /api/v1/vehicles
// @access  Private (Customer)
router.get('/', getMyVehicles);

// @desc    Update a specific vehicle
// @route   PUT /api/v1/vehicles/:id
// @access  Private (Customer)
router.put('/:id', updateVehicle);

// @desc    Delete a specific vehicle
// @route   DELETE /api/v1/vehicles/:id
// @access  Private (Customer)
router.delete('/:id', deleteVehicle);

export default router;




/*import express from 'express';
import { authRequired, authorize } from '../middleware/auth.js';
import { getMyVehicles, getVehicleServiceHistory } from '../controllers/customerController.js';

const router = express.Router();

router.use(authRequired, authorize('Customer'));

// FR-EXT-B2: Vehicle and Service History
router.get('/', getMyVehicles);
router.get('/:vehicleId/history', getVehicleServiceHistory);

export default router; */