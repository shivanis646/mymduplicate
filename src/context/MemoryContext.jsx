import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export const MemoryContext = createContext();

export const MemoryProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);  // all public memories
  const [liked, setLiked] = useState([]);        // current user's liked memories
  const [loading, setLoading] = useState(true);

  const fetchMemories = async () => {
    try {
      setLoading(true);

      // ✅ Fetch all public memories
      const { data: memoriesData, error } = await supabase
        .from("memories")
        .select("*")
        .eq("isPublic", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // ✅ Fetch current user's liked memories
      let likedIds = [];
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userId = session.user.id;
        const { data: profile } = await supabase
          .from("profiles")
          .select("liked")
          .eq("id", userId)
          .single();

        likedIds = profile?.liked || [];
      }

      // Map isFavorite for current user
      const updatedMemories = memoriesData.map((m) => ({
        ...m,
        isFavorite: likedIds.includes(m.id),
      }));

      setMemories(updatedMemories);
      setLiked(likedIds);
    } catch (err) {
      console.error("Error fetching memories:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (memoryId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return alert("You must be logged in!");

      const userId = session.user.id;

      let newLiked;
      if (liked.includes(memoryId)) {
        newLiked = liked.filter((id) => id !== memoryId);
      } else {
        newLiked = [...liked, memoryId];
      }

      // Update profile liked array
      const { error } = await supabase
        .from("profiles")
        .update({ liked: newLiked })
        .eq("id", userId);

      if (error) throw error;

      // Update context state
      setLiked(newLiked);
      setMemories((prev) =>
        prev.map((m) =>
          m.id === memoryId ? { ...m, isFavorite: newLiked.includes(memoryId) } : m
        )
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err.message);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  return (
    <MemoryContext.Provider
      value={{ memories, liked, toggleFavorite, fetchMemories, loading }}
    >
      {children}
    </MemoryContext.Provider>
  );
};
