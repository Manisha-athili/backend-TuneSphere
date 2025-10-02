import express from "express";
import {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getFeaturedPlaylists
} from "../controllers/playlistController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllPlaylists);
router.get("/featured", verifyToken, getFeaturedPlaylists);
router.get("/:id", verifyToken, getPlaylistById);
router.post("/", verifyToken, createPlaylist);
router.put("/:id", verifyToken, updatePlaylist);
router.delete("/:id", verifyToken, deletePlaylist);
router.put("/:id/add", verifyToken, addSongToPlaylist);
router.put("/:id/remove", verifyToken, removeSongFromPlaylist);

export default router;
