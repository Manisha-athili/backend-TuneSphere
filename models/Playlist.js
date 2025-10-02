import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: String,
  platform: String,
  songs: [{ type: String }], // song IDs
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Playlist", playlistSchema);
