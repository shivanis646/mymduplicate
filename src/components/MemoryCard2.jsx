import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryCard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { supabase } from "../utils/supabaseClient";

function MemoryCard2({ memory, onLikeToggle, onVisibilityToggle }) {
  const [isFavorite, setIsFavorite] = useState(memory.isFavorite || false);
  const [isPublic, setIsPublic] = useState(memory.isPublic || false);

  // 🔥 Sync local state with props whenever context updates
  useEffect(() => {
    setIsFavorite(memory.isFavorite || false);
    setIsPublic(memory.isPublic || false);
  }, [memory.isFavorite, memory.isPublic]);

  // ✅ Toggle Favorite
  const toggleFavorite = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in!");
        return;
      }

      const userId = session.user.id;

      // Fetch current liked array from profile
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("liked")
        .eq("id", userId)
        .single();

      if (fetchError) throw fetchError;

      let liked = profile?.liked || [];
      let newLiked;

      if (liked.includes(memory.id)) {
        newLiked = liked.filter((id) => id !== memory.id);
      } else {
        newLiked = [...liked, memory.id];
      }

      // Update Supabase profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ liked: newLiked })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Optimistic UI update
      setIsFavorite(!isFavorite);

      if (onLikeToggle) onLikeToggle(memory.id, !isFavorite);
    } catch (err) {
      console.error("Failed to update favorite:", err.message);
      alert("Failed to update favorite: " + err.message);
    }
  };

  // ✅ Toggle Public/Private
  const toggleVisibility = async () => {
    try {
      const { error } = await supabase
        .from("memories")
        .update({ isPublic: !isPublic })
        .eq("id", memory.id);

      if (error) throw error;

      // Optimistic UI update
      setIsPublic(!isPublic);

      if (onVisibilityToggle) onVisibilityToggle(memory.id, !isPublic);
    } catch (err) {
      console.error("Failed to update visibility:", err.message);
      alert("Failed to update visibility: " + err.message);
    }
  };

  return (
    <div className="memory-card2">
      <div className="memory-image2">
        <img src={memory.images[0]} alt={memory.title} />
      </div>

      <div className="memory-info2">
        <div>
          <h2>{memory.title}</h2>
          <p className="tags">
            {memory.geo_tag
              ? memory.geo_tag.split(",").map((tag, i) => (
                  <span key={i}>#{tag.trim()} </span>
                ))
              : "#NoTags"}
          </p>
          <p>
            {memory.memory_story
              ? memory.memory_story.slice(0, 100)
              : "No preview"}
            <Link to={`/vaultmemory/${memory.id}`} className="read-more-btn">
              ...Read More
            </Link>
          </p>
        </div>

        <div className="memory-actions2">
          <button className="status-tag"
            className={`status-tag ${isPublic ? "public" : "private"}`}
            onClick={toggleVisibility}
          >
            {isPublic ? "Public" : "Private"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemoryCard2;
