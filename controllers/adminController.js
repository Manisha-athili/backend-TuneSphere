import User from "../models/User.js";
import Music from "../models/Music.js";
import Playlist from "../models/Playlist.js";

/**
 * @desc   Get admin dashboard statistics
 * @route  GET /api/admin/dashboard
 * @access Private/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const totalSongs = await Music.countDocuments();
    const totalPlaylists = await Playlist.countDocuments();

    // Recent activity - last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo },
      isAdmin: false 
    });

    const recentSongs = await Music.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    // Top searched songs (based on play count or views)
    const topSongs = await Music.find()
      .sort({ playCount: -1 })
      .limit(10)
      .select("title artist playCount platform");

    res.json({
      stats: {
        totalUsers,
        totalAdmins,
        totalSongs,
        totalPlaylists,
        recentUsers,
        recentSongs
      },
      topSongs
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Error fetching dashboard stats", error: err.message });
  }
};

/**
 * @desc   Get all users with pagination
 * @route  GET /api/admin/users
 * @access Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find({ isAdmin: false })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ isAdmin: false });

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasMore: skip + users.length < total
      }
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

/**
 * @desc   Get single user details
 * @route  GET /api/admin/users/:id
 * @access Private/Admin
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("favorites", "title artist platform");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

/**
 * @desc   Delete user
 * @route  DELETE /api/admin/users/:id
 * @access Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

/**
 * @desc   Get recent activity
 * @route  GET /api/admin/activity
 * @access Private/Admin
 */
export const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Get recent users
    const recentUsers = await User.find({ isAdmin: false })
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recently added songs
    const recentSongs = await Music.find()
      .select("title artist platform createdAt")
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recently created playlists
    const recentPlaylists = await Playlist.find()
      .select("name userId createdAt")
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      recentUsers,
      recentSongs,
      recentPlaylists
    });
  } catch (err) {
    console.error("Get activity error:", err);
    res.status(500).json({ message: "Error fetching recent activity", error: err.message });
  }
};

/**
 * @desc   Get top searched songs
 * @route  GET /api/admin/top-songs
 * @access Private/Admin
 */
export const getTopSearchedSongs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const platform = req.query.platform; // youtube, spotify, jiosaavn, or all

    let query = {};
    if (platform && platform !== "all") {
      query.platform = platform;
    }

    const topSongs = await Music.find(query)
      .sort({ playCount: -1, searchCount: -1 })
      .limit(limit)
      .select("title artist platform playCount searchCount thumbnail");

    res.json({ topSongs });
  } catch (err) {
    console.error("Get top songs error:", err);
    res.status(500).json({ message: "Error fetching top songs", error: err.message });
  }
};

/**
 * @desc   Manage featured playlists
 * @route  POST /api/admin/featured-playlists
 * @access Private/Admin
 */
export const addFeaturedPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.isFeatured = true;
    await playlist.save();

    res.json({ message: "Playlist added to featured", playlist });
  } catch (err) {
    console.error("Add featured playlist error:", err);
    res.status(500).json({ message: "Error adding featured playlist", error: err.message });
  }
};

/**
 * @desc   Remove featured playlist
 * @route  DELETE /api/admin/featured-playlists/:id
 * @access Private/Admin
 */
export const removeFeaturedPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.isFeatured = false;
    await playlist.save();

    res.json({ message: "Playlist removed from featured" });
  } catch (err) {
    console.error("Remove featured playlist error:", err);
    res.status(500).json({ message: "Error removing featured playlist", error: err.message });
  }
};

/**
 * @desc   Get all featured playlists
 * @route  GET /api/admin/featured-playlists
 * @access Private/Admin
 */
export const getFeaturedPlaylists = async (req, res) => {
  try {
    const featuredPlaylists = await Playlist.find({ isFeatured: true })
      .populate("userId", "name email")
      .populate("songs", "title artist platform")
      .sort({ updatedAt: -1 });

    res.json({ featuredPlaylists });
  } catch (err) {
    console.error("Get featured playlists error:", err);
    res.status(500).json({ message: "Error fetching featured playlists", error: err.message });
  }
};

/**
 * @desc   Manage banners
 * @route  POST /api/admin/banners
 * @access Private/Admin
 */
export const createBanner = async (req, res) => {
  try {
    const { title, imageUrl, link, isActive } = req.body;

    // You'll need to create a Banner model for this
    // For now, returning a simple response
    res.json({ 
      message: "Banner created successfully",
      banner: { title, imageUrl, link, isActive: isActive || true }
    });
  } catch (err) {
    console.error("Create banner error:", err);
    res.status(500).json({ message: "Error creating banner", error: err.message });
  }
};

/**
 * @desc   Search users
 * @route  GET /api/admin/users/search
 * @access Private/Admin
 */
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      isAdmin: false,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    })
    .select("-password")
    .limit(20);

    res.json({ users });
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({ message: "Error searching users", error: err.message });
  }
};