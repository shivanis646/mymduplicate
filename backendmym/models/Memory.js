import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // owner of the memory
  title: { type: String, required: true }, // memory title
  preview: String,        // optional preview text
  geoTag: String,         // any geotag label
  maploc: String,         // optional textual location
  lat: { type: Number },  // latitude for map markers
  lng: { type: Number },  // longitude for map markers
  tagType: { type: String, enum: ["place", "emotion"] }, // for filtering in frontend
  cultureTag: String,
  coreMemory: String,
  foodTag: String,
  storyPlace: String,
  memoryStory: String,
  emotion: String,
  placeType: String,      // beach, mountain, city, etc.
  isPublic: { type: Boolean, default: true },
  images: [String],       // array of image URLs
  likes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Memory", memorySchema);
