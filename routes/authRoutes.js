import express from "express";
import { register, login, adminLogin } from "../controllers/authController.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    User login
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login
 * @access  Public (Admin credentials required)
 */
router.post("/admin/login", adminLogin);

export default router;