import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryCard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { supabase } from "../utils/supabaseClient";

function MemoryCard2({ memory, onLikeToggle }) {
  const [isFavorite, setIsFavorite] = useState(memory.isFavorite || false);

  // 🔥 Sync local state with prop whenever context updates
  useEffect(() => {
    setIsFavorite(memory.isFavorite || false);
  }, [memory.isFavorite]);

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
        // remove from favorites
        newLiked = liked.filter((id) => id !== memory.id);
      } else {
        // add to favorites
        newLiked = [...liked, memory.id];
      }

      // Update profile with new liked array
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ liked: newLiked })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Optimistically update UI
      setIsFavorite(!isFavorite);

      // Notify parent (so global state updates too)
      if (onLikeToggle) onLikeToggle(memory.id, !isFavorite);
    } catch (err) {
      console.error("Failed to update favorite:", err.message);
      alert("Failed to update favorite: " + err.message);
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
          <div
            className={`status-tag ${memory.isPublic ? "public" : "private"}`}
          >
            {memory.isPublic ? "Public" : "Private"}
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default MemoryCard2;
