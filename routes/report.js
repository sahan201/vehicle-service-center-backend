import express from 'express';
import { authRequired, requireRole } from '../middleware/auth.js';
import { generateReport } from '../controllers/reportController.js';

const router = express.Router();

router.get('/generate', authRequired, requireRole(['manager','admin']), generateReport);

export default router;
