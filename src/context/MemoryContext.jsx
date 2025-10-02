import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export const MemoryContext = createContext();

export const MemoryProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch public memories
  const fetchMemories = async () => {
    try {
      setLoading(true);

      // Fetch public memories
      const { data: memoriesData, error: memError } = await supabase
        .from("memories")
        .select("*")
        .eq("isPublic", true)
        .order("created_at", { ascending: false });

      if (memError) throw memError;

      let userLiked = [];
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("liked")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        userLiked = profile?.liked || [];
      }

      // Add isFavorite flag based on liked array
      const enriched = memoriesData.map((m) => ({
        ...m,
        isFavorite: userLiked.includes(m.id),
      }));

      setMemories(enriched);
    } catch (err) {
      console.error("Error fetching memories:", err.message);
      alert("Failed to fetch memories");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMemories();
  }, []);

  // Toggle favorite
  // Toggle favorite
  const toggleFavorite = async (memoryId) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        alert("You must be logged in!");
        return;
      }

      const userId = session.user.id;

      // Get current liked array from profile
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("liked")
        .eq("id", userId)
        .single();

      if (fetchError) throw fetchError;

      let liked = profile?.liked || [];

      // Toggle logic
      let newLiked;
      if (liked.includes(memoryId)) {
        newLiked = liked.filter((id) => id !== memoryId);
      } else {
        newLiked = [...liked, memoryId];
      }

      // Update in Supabase
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ liked: newLiked })
        .eq("id", userId);

      if (updateError) throw updateError;

      // ✅ Update local state properly
      setMemories((prev) =>
        prev.map((m) =>
          m.id === memoryId
            ? { ...m, isFavorite: newLiked.includes(memoryId) }
            : m
        )
      );
    } catch (err) {
      console.error("toggleFavorite failed:", err.message);
      alert("Failed to update favorite: " + err.message);
    }
  };



  return (
    <MemoryContext.Provider value={{ memories, loading, toggleFavorite, fetchMemories, setMemories }}>
      {children}
    </MemoryContext.Provider>

  );
};
