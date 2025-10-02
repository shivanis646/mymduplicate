import { supabase } from "./supabaseClient.js";

// ✅ Check if user is logged in
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// ✅ Logout user
export const logoutUser = async () => {
  await supabase.auth.signOut();
};

// ✅ Get current user
export const getUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
};

// ✅ Get current access token
export const getToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};
