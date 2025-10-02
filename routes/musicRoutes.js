// import express from "express";
// import { searchSongs, getFavorites, addFavorite } from "../controllers/musicController.js";

// const router = express.Router();

// router.get("/search", searchSongs);
// router.get("/favorites/:userId", getFavorites);
// router.post("/favorites", addFavorite);

// export default router;


import express from "express";
import { searchSongs, getTrendingSongs, getSongById, getSongsByPlatform } from "../controllers/musicController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", verifyToken, searchSongs);
router.get("/trending", verifyToken, getTrendingSongs);
router.get("/:id", verifyToken, getSongById);
router.get("/platform/:platform", verifyToken, getSongsByPlatform);

export default router;
