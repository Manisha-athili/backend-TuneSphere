// routes/userRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavorites,
  getRecentlyPlayed
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);
router.get("/favorites", verifyToken, getFavorites);
router.post("/favorites", verifyToken, addFavorite);
router.delete("/favorites/:songId", verifyToken, removeFavorite);
router.put("/favorites", verifyToken, updateFavorites); // Keep for bulk update
router.get("/recently-played", verifyToken, getRecentlyPlayed);

export default router;