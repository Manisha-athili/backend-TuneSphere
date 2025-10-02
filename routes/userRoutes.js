import express from "express";
import { getUserProfile, updateUserProfile, getFavorites, updateFavorites, getRecentlyPlayed } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);
router.get("/favorites", verifyToken, getFavorites);
router.put("/favorites", verifyToken, updateFavorites);
router.get("/recently-played", verifyToken, getRecentlyPlayed);

export default router;
