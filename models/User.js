import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
 favorites: [{
    songId: String,      // External platform ID
    title: String,
    artist: String,
    platform: String,    // youtube/spotify/jiosaavn
    thumbnail: String,
    url: String,
    duration: String,
  }],
    recentlyPlayed: [{
    songId: String,
    title: String,
    artist: String,
    platform: String,
    thumbnail: String,
    url: String,
    duration: String,
    playedAt: { type: Date, default: Date.now }
  }],
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);