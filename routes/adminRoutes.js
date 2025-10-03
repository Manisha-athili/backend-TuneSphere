
import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  deleteUser,
  getRecentActivity,
  getTopSearchedSongs,
  addFeaturedPlaylist,
  removeFeaturedPlaylist,
  getFeaturedPlaylists,
  createBanner,
  searchUsers
} from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(verifyToken);
router.use(verifyAdmin);

/**
 * Dashboard & Analytics
 */
// GET /api/admin/dashboard - Get dashboard statistics
router.get("/dashboard", getDashboardStats);

// GET /api/admin/activity - Get recent activity
router.get("/activity", getRecentActivity);

// GET /api/admin/top-songs - Get top searched songs
router.get("/top-songs", getTopSearchedSongs);

/**
 * User Management
 */
// GET /api/admin/users - Get all users with pagination
router.get("/users", getAllUsers);

// GET /api/admin/users/search - Search users
router.get("/users/search", searchUsers);

// GET /api/admin/users/:id - Get single user details
router.get("/users/:id", getUserById);

// DELETE /api/admin/users/:id - Delete a user
router.delete("/users/:id", deleteUser);

/**
 * Featured Playlists Management
 */
// GET /api/admin/featured-playlists - Get all featured playlists
router.get("/featured-playlists", getFeaturedPlaylists);

// POST /api/admin/featured-playlists - Add playlist to featured
router.post("/featured-playlists", addFeaturedPlaylist);

// DELETE /api/admin/featured-playlists/:id - Remove from featured
router.delete("/featured-playlists/:id", removeFeaturedPlaylist);

/**
 * Banner Management
 */
// POST /api/admin/banners - Create a new banner
router.post("/banners", createBanner);

export default router;