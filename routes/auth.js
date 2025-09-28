import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
router.post('/register', register);

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', login);

export default router;