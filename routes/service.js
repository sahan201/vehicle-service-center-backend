import express from "express";
import { authRequired, authorize } from "../middleware/auth.js";
import { startService, finishService } from "../controllers/serviceController.js";

const router = express.Router();
router.put("/:id/start", authRequired, authorize("Mechanic", "Manager"), startService);
router.put("/:id/finish", authRequired, authorize("Mechanic", "Manager"), finishService);
export default router;