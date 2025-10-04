import mongoose from "mongoose";

// models/Playlist.js
const playlistSchema = new mongoose.Schema({
  name: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  songs: [{
    songId: String,
    title: String,
    artist: String,
    platform: String,
    thumbnail: String,
    url: String,
    duration: String,
  }],
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Playlist", playlistSchema);
