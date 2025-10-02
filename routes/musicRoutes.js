import express from "express";
import { searchSongs, getFavorites, addFavorite } from "../controllers/musicController.js";

const router = express.Router();

router.get("/search", searchSongs);
router.get("/favorites/:userId", getFavorites);
router.post("/favorites", addFavorite);

export default router;
