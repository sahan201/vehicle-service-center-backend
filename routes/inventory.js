import express from 'express';
import {
  createInventoryItem,
  getAllInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';
import { authRequired, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all inventory items
// @route   GET /api/v1/inventory
// @access  Private (Manager, Mechanic)
router.get(
  '/',
  authRequired,
  authorize('Manager', 'Mechanic'),
  getAllInventoryItems
);

// @desc    Create a new inventory item
// @route   POST /api/v1/inventory
// @access  Private (Manager)
router.post('/', authRequired, authorize('Manager'), createInventoryItem);

// @desc    Update an inventory item
// @route   PUT /api/v1/inventory/:id
// @access  Private (Manager)
router.put('/:id', authRequired, authorize('Manager'), updateInventoryItem);

// @desc    Delete an inventory item
// @route   DELETE /api/v1/inventory/:id
// @access  Private (Manager)
router.delete('/:id', authRequired, authorize('Manager'), deleteInventoryItem);

export default router;

