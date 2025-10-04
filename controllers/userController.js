import User from "../models/User.js";
import bcrypt from "bcryptjs";

/**
 * @desc   Get logged-in user profile
 * @route  GET /api/users/profile
 * @access Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Error fetching user profile", error: err.message });
  }
};

/**
 * @desc   Update user profile
 * @route  PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ 
      message: "Profile updated", 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        favorites: user.favorites 
      } 
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

/**
 * @desc   Get user's favorite songs
 * @route  GET /api/users/favorites
 * @access Private
 */
export const getFavorites = async (req, res) => {
  try {
    console.log("📥 Getting favorites for user:", req.userId);
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize favorites array if it doesn't exist
    if (!user.favorites) {
      user.favorites = [];
      await user.save();
    }

    console.log("✅ Favorites retrieved:", user.favorites.length);
    
    res.json({ 
      success: true,
      favorites: user.favorites || [] 
    });
  } catch (err) {
    console.error("❌ Get favorites error:", err.message);
    res.status(500).json({ 
      success: false,
      message: "Error fetching favorites", 
      error: err.message 
    });
  }
};

/**
 * @desc   Update user's favorite songs
 * @route  PUT /api/users/favorites
 * @access Private
 */


/**
 * @desc   Get user's recently played songs
 * @route  GET /api/users/recently-played
 * @access Private
 */
export const getRecentlyPlayed = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const recentlyPlayed = user.recentlyPlayed || [];
    res.json({ 
      success: true,
      recentlyPlayed 
    });
  } catch (err) {
    console.error("Get recently played error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error fetching recently played songs", 
      error: err.message 
    });
  }
};

// userController.js - Replace updateFavorites with these two methods

/**
 * @desc   Add song to favorites
 * @route  POST /api/users/favorites
 * @access Private
 */
export const addFavorite = async (req, res) => {
  try {
    const { songId, title, artist, platform, thumbnail, url, duration } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already favorited
    const exists = user.favorites.some(fav => fav.songId === songId);
    if (exists) {
      return res.status(400).json({ 
        success: false,
        message: "Already in favorites" 
      });
    }

    // Add to favorites
    user.favorites.push({
      songId,
      title,
      artist,
      platform,
      thumbnail,
      url,
      duration
    });

    await user.save();

    res.json({ 
      success: true,
      message: "Added to favorites",
      favorites: user.favorites 
    });
  } catch (err) {
    console.error("Add favorite error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error adding favorite", 
      error: err.message 
    });
  }
};

/**
 * @desc   Remove song from favorites
 * @route  DELETE /api/users/favorites/:songId
 * @access Private
 */
export const removeFavorite = async (req, res) => {
  try {
    const { songId } = req.params;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = user.favorites.filter(fav => fav.songId !== songId);
    await user.save();

    res.json({ 
      success: true,
      message: "Removed from favorites",
      favorites: user.favorites 
    });
  } catch (err) {
    console.error("Remove favorite error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error removing favorite", 
      error: err.message 
    });
  }
};

// Keep updateFavorites for backward compatibility but update it
export const updateFavorites = async (req, res) => {
  try {
    const { favorites } = req.body;

    if (!Array.isArray(favorites)) {
      return res.status(400).json({ 
        success: false,
        message: "Favorites must be an array" 
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    user.favorites = favorites; // Now expects full objects, not just IDs
    await user.save();

    res.json({ 
      success: true,
      message: "Favorites updated", 
      favorites: user.favorites 
    });
  } catch (err) {
    console.error("Update favorites error:", err);
    res.status(500).json({ 
      success: false,
      message: "Error updating favorites", 
      error: err.message 
    });
  }
};