import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" },
  tagline: { type: String, default: "" }, // Add this field
  memories: { type: Number, default: 0 },
  countries: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  likedMemories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Memory" }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);