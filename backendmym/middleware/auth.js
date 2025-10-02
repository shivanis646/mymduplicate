import express from "express";
import { supabase } from "../utils/supabaseClient.js";

const router = express.Router();

// -------------------------
// Signup
// -------------------------
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const { data: existing, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) return res.status(400).json({ msg: "User already exists" });

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error) return res.status(400).json({ msg: error.message });

    res.json({
      token: data?.id,
      user: { id: data.id, name, email, profilePic: "" },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------
// Login
// -------------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "signup", // or password reset
      email,
    });
    // Instead, for normal login we recommend frontend supabase auth
    // But for backend mimic, you can use supabase.auth.api.signInWithEmail
    res.json({ msg: "Use frontend Supabase login for session" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------
// Get profile
// -------------------------
router.get("/profile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return res.status(404).json({ msg: "User not found" });
    res.json({ user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------
// Update profile
// -------------------------
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ msg: error.message });
    res.json({ user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
