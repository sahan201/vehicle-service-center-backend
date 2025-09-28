import express from "express";
import {
  generateReport,
  getBookingStats,
} from "../controllers/reportController.js";
import { authRequired, authorize } from "../middleware/auth.js";

const router = express.Router();

// @desc    Generate a PDF performance report for a given date range
// @route   GET /api/reports/generate
// @access  Private/Manager
router.get("/generate", authRequired, authorize("Manager"), generateReport);

// @desc    Get booking statistics aggregated by day of the week
// @route   GET /api/reports/booking-stats
// @access  Private/Manager
router.get(
  "/booking-stats",
  authRequired,
  authorize("Manager"),
  getBookingStats
);

export default router;

/*import express from "express";
import { authRequired, authorize } from "../middleware/auth.js";
import { generateReport } from "../controllers/reportController.js";

const router = express.Router();
router.get("/generate", authRequired, authorize("Manager"), generateReport);
export default router;*/
