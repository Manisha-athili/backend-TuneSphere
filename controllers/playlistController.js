import Playlist from "../models/Playlist.js";

/**
 * @desc   Get all playlists
 * @route  GET /api/playlists
 * @access Private
 */
export const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: "Error fetching playlists", error: err });
  }
};

/**
 * @desc   Get single playlist
 * @route  GET /api/playlists/:id
 * @access Private
 */
export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: "Error fetching playlist", error: err });
  }
};

/**
 * @desc   Create new playlist
 * @route  POST /api/playlists
 * @access Private
 */
export const createPlaylist = async (req, res) => {
  try {
    const { name, platform, songs, isFeatured } = req.body;
    const playlist = new Playlist({ name, platform, songs, isFeatured: isFeatured || false });
    await playlist.save();
    res.status(201).json({ message: "Playlist created", playlist });
  } catch (err) {
    res.status(500).json({ message: "Error creating playlist", error: err });
  }
};

/**
 * @desc   Update playlist
 * @route  PUT /api/playlists/:id
 * @access Private
 */
export const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    const { name, songs, isFeatured } = req.body;
    if (name) playlist.name = name;
    if (songs) playlist.songs = songs;
    if (isFeatured !== undefined) playlist.isFeatured = isFeatured;

    await playlist.save();
    res.json({ message: "Playlist updated", playlist });
  } catch (err) {
    res.status(500).json({ message: "Error updating playlist", error: err });
  }
};

/**
 * @desc   Delete playlist
 * @route  DELETE /api/playlists/:id
 * @access Private
 */
export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    res.json({ message: "Playlist deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting playlist", error: err });
  }
};

/**
 * @desc   Add song to playlist
 * @route  PUT /api/playlists/:id/add
 * @access Private
 */
export const addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.songs.push(songId);
    await playlist.save();
    res.json({ message: "Song added", playlist });
  } catch (err) {
    res.status(500).json({ message: "Error adding song", error: err });
  }
};

/**
 * @desc   Remove song from playlist
 * @route  PUT /api/playlists/:id/remove
 * @access Private
 */
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.songs = playlist.songs.filter(id => id !== songId);
    await playlist.save();
    res.json({ message: "Song removed", playlist });
  } catch (err) {
    res.status(500).json({ message: "Error removing song", error: err });
  }
};

/**
 * @desc   Get featured playlists
 * @route  GET /api/playlists/featured
 * @access Private
 */
export const getFeaturedPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isFeatured: true });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: "Error fetching featured playlists", error: err });
  }
};
