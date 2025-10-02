// backendmym/utils/authMiddleware.js
import { supabase } from "./supabaseClient.js";

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "No token" });

  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(401).json({ msg: "Unauthorized" });

  req.user = user; // req.user contains supabase user info
  next();
}
