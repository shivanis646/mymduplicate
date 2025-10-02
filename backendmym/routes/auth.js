import express from "express";
import { supabase } from "../utils/supabaseClient.js";

const router = express.Router();

// ➕ Add new memory
router.post("/", async (req, res) => {
  try {
    const memory = req.body;

    const { data, error } = await supabase
      .from("memories")
      .insert([memory])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗂 Vault: Get all memories of logged-in user
router.get("/vault/:userId", async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 🌍 Explore: All public memories from others
router.get("/explore/:userId", async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from("memories")
    .select("*, profiles(name, profilePic)")
    .eq("is_public", true)
    .neq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
