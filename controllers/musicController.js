import Song from "../models/Music.js";
import { getYouTubeSongs } from "../services/YouTubeService.js";
import { getSpotifySongs } from "../services/SpotifyService.js";
import { getJioSaavnSongs } from "../services/JioSaavnService.js";

/**
 * @desc   Search songs across all platforms
 * @route  GET /api/songs/search?q=keyword
 * @access Private
 */
export const searchSongs = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const [ytResults, spotifyResults, saavnResults] = await Promise.all([
      getYouTubeSongs(query),
      getSpotifySongs(query),
      getJioSaavnSongs(query)
    ]);

    // Optionally save results to DB for caching
    // await Song.insertMany([...ytResults, ...spotifyResults, ...saavnResults]);

    res.json([...ytResults, ...spotifyResults, ...saavnResults]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching songs", error: err });
  }
};

/**
 * @desc   Get trending songs (stubbed)
 * @route  GET /api/songs/trending
 * @access Private
 */
export const getTrendingSongs = async (req, res) => {
  try {
    // Stub: return top songs from DB or external APIs
    const songs = await Song.find().sort({ createdAt: -1 }).limit(20);
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching trending songs", error: err });
  }
};

/**
 * @desc   Get song by ID
 * @route  GET /api/songs/:id
 * @access Private
 */
// musicController.js - Either remove getSongById or make it useful
// OPTION 1: Remove it entirely (recommended)
// OPTION 2: Make it search by external ID
export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find in database first
    const song = await Song.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
        { url: { $regex: id } }
      ]
    });
    
    if (song) {
      return res.json(song);
    }
    
    // If not found in DB, return 404
    res.status(404).json({ message: "Song not found in database" });
  } catch (err) {
    res.status(500).json({ message: "Error fetching song", error: err.message });
  }
};

/**
 * @desc   Get songs by platform
 * @route  GET /api/songs/platform/:platform
 * @access Private
 */
export const getSongsByPlatform = async (req, res) => {
  const platform = req.params.platform;
  try {
    const songs = await Song.find({ platform });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching songs by platform", error: err });
  }
};
  