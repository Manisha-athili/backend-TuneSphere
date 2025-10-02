import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  platform: String, // YouTube | Spotify | JioSaavn
  url: String,
  thumbnail: String,
  duration: Number,
  searchKeywords: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Song", songSchema);
