import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export const MemoryContext = createContext();

export const MemoryProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);
  const [liked, setLiked] = useState([]); // keep liked IDs
  const [loading, setLoading] = useState(true);

  // Fetch all memories + user liked list
  const fetchMemories = async () => {
    try {
      setLoading(true);

      // fetch all memories (both public + private)
      const { data: memoriesData, error } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      let likedIds = [];
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("liked")
          .eq("id", user.id)
          .single();

        likedIds = profile?.liked || [];
      }

      // Sync memories with liked state
      const updated = memoriesData.map((m) => ({
        ...m,
        isFavorite: likedIds.includes(m.id),
      }));

      setMemories(updated);
      setLiked(likedIds);
    } catch (err) {
      console.error("Error fetching memories:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (memoryId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in!");
        return;
      }

      let newLiked;
      if (liked.includes(memoryId)) {
        newLiked = liked.filter((id) => id !== memoryId);
      } else {
        newLiked = [...liked, memoryId];
      }

      const { error } = await supabase
        .from("profiles")
        .update({ liked: newLiked })
        .eq("id", user.id);

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

  // Toggle public/private
  const toggleVisibility = async (memoryId, currentStatus) => {
    try {
      const { error } = await supabase
        .from("memories")
        .update({ isPublic: !currentStatus })
        .eq("id", memoryId);

      if (error) throw error;

      // Update local state immediately
      setMemories((prev) =>
        prev.map((m) =>
          m.id === memoryId ? { ...m, isPublic: !currentStatus } : m
        )
      );
    } catch (err) {
      console.error("Failed to toggle visibility:", err.message);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  return (
    <MemoryContext.Provider
      value={{
        memories,
        liked,
        toggleFavorite,
        toggleVisibility,
        fetchMemories,
        loading,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
};
