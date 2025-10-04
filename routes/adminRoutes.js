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

// Dashboard & Analytics
router.get("/dashboard", getDashboardStats);
router.get("/activity", getRecentActivity);
router.get("/top-songs", getTopSearchedSongs);

// User Management
router.get("/users", getAllUsers);
router.get("/users/search", searchUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);

// Featured Playlists Management
router.get("/featured-playlists", getFeaturedPlaylists);
router.post("/featured-playlists", addFeaturedPlaylist);
router.delete("/featured-playlists/:id", removeFeaturedPlaylist);

// Banner Management
router.post("/banners", createBanner);

export default router;