import axios from "axios";
import Favorite from "../models/Favorite.js";

// 🎵 Search songs across platforms
export const searchSongs = async (req, res) => {
  try {
    const { query, platform } = req.query;

    if (!query || !platform) {
      return res.status(400).json({ message: "Query and platform are required" });
    }

    let results = [];

    // YouTube API
    if (platform === "youtube") {
      const ytRes = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            key: process.env.YOUTUBE_API_KEY
          }
        }
      );

      results = ytRes.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url,
        channel: item.snippet.channelTitle
      }));
    }

    // Spotify API (mock/demo since needs OAuth)
    if (platform === "spotify") {
      results = [
        { id: "spotify1", title: "Mock Spotify Song", artist: "Artist A" },
        { id: "spotify2", title: "Another Song", artist: "Artist B" }
      ];
    }

    // JioSaavn API (unofficial, use third-party wrapper or mock)
    if (platform === "jiosaavn") {
      results = [
        { id: "jio1", title: "Mock JioSaavn Song", artist: "Singer X" },
        { id: "jio2", title: "Another JioSaavn Track", artist: "Singer Y" }
      ];
    }

    res.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Error fetching songs" });
  }
};

// ⭐ Get Favorites
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites" });
  }
};

// ➕ Add Favorite
export const addFavorite = async (req, res) => {
  try {
    const fav = new Favorite(req.body);
    await fav.save();
    res.json(fav);
  } catch (error) {
    res.status(500).json({ message: "Error saving favorite" });
  }
};
