import User from "../models/User.js";

/**
 * @desc   Get logged-in user profile
 * @route  GET /api/users/profile
 * @access Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user profile", error: err });
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
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // remember to hash if updating

    await user.save();

    res.json({ message: "Profile updated", user: { id: user._id, name: user.name, email: user.email, favorites: user.favorites } });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err });
  }
};

/**
 * @desc   Get user's favorite songs
 * @route  GET /api/users/favorites
 * @access Private
 */
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Error fetching favorites", error: err });
  }
};

/**
 * @desc   Update user's favorite songs
 * @route  PUT /api/users/favorites
 * @access Private
 */
export const updateFavorites = async (req, res) => {
  try {
    const { favorites } = req.body; // array of song IDs
    const user = await User.findByIdAndUpdate(req.userId, { favorites }, { new: true }).select('-password');

    res.json({ message: "Favorites updated", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Error updating favorites", error: err });
  }
};

/**
 * @desc   Get user's recently played songs
 * @route  GET /api/users/recently-played
 * @access Private
 */
export const getRecentlyPlayed = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const recentlyPlayed = user.recentlyPlayed || [];
    res.json({ recentlyPlayed });
  } catch (err) {
    res.status(500).json({ message: "Error fetching recently played songs", error: err });
  }
};
