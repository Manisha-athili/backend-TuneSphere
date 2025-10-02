import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  platform: String, // YouTube / Spotify / JioSaavn
  songId: String,
  title: String,
  artist: String,
}, { timestamps: true });

export default mongoose.model("Favorite", favoriteSchema);
