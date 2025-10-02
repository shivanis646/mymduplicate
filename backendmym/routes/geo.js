import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// GET /geo/resolve?url=<google-maps-link>
router.get("/resolve", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  try {
    const response = await fetch(url, { redirect: "follow" });
    const finalURL = response.url;

    let lat, lng;

    // 1. Try @lat,lng
    let match = finalURL.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      lat = parseFloat(match[1]);
      lng = parseFloat(match[2]);
    }

    // 2. Try !3dLAT!4dLNG if not found
    if (!lat || !lng) {
      match = finalURL.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (match) {
        lat = parseFloat(match[1]);
        lng = parseFloat(match[2]);
      }
    }

    if (!lat || !lng) {
      return res.status(400).json({ error: "Could not extract coordinates" });
    }

    res.json({
      lat,
      lng,
      resolvedUrl: finalURL, // keep for debugging
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
