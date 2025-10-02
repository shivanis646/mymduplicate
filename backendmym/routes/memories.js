import express from "express";
import fetch from "node-fetch";
import Memory from "../models/Memory.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ➕ Add new memory
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      memoryStory,
      geoTag,
      maploc,
      cultureTag,
      coreMemory,
      foodTag,
      storyPlace,
      emotion,
      placeType,
      isPublic,
      images
    } = req.body;

    // Resolve maploc to lat/lng if provided
    let lat = null, lng = null;
    if (maploc) {
      const response = await fetch(
        `http://localhost:5000/api/geo/resolve?url=${encodeURIComponent(maploc)}`
      );
      const data = await response.json();
      if (data.lat && data.lng) {
        lat = data.lat;
        lng = data.lng;
      }
    }

    const newMemory = new Memory({
      userId: req.user.id,
      title,
      memoryStory,
      geoTag,
      maploc,
      cultureTag,
      coreMemory,
      foodTag,
      storyPlace,
      emotion,
      placeType,
      isPublic: !!isPublic,
      images: images || [],
      lat,
      lng
    });

    await newMemory.save();
    res.json(newMemory);
  } catch (err) {
    console.error("Error creating memory:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🗂 Vault: Get all memories of logged-in user
router.get("/vault", authMiddleware, async (req, res) => {
  try {
    const memories = await Memory.find({ userId: req.user.id });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🌍 Explore: All public memories from others
router.get("/explore", authMiddleware, async (req, res) => {
  try {
    const memories = await Memory.find({ isPublic: true, userId: { $ne: req.user.id } })
      .populate("userId", "name profilePic");
    res.json(memories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
