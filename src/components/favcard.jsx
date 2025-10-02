import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import "../styles/MemoryCard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function MemoryCard({ memory, onLikeToggle }) {
  const [isFavorite, setIsFavorite] = useState(memory.isFavorite || false);

  const toggleFavorite = async () => {
    try {
      const user = supabase.auth.user();
      if (!user) {
        alert("You must be logged in!");
        return;
      }

      const { error } = await supabase
        .from("memories")
        .update({ isFavorite: !isFavorite })
        .eq("id", memory.id);

      if (error) throw error;

      setIsFavorite(!isFavorite);
      if (onLikeToggle) onLikeToggle(memory.id, !isFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite:", err.message);
      alert("Failed to update favorite.");
    }
  };

  return (
    <div className="memory-card2">
      <div className="memory-image2">
        {memory.images && memory.images.length > 0 ? (
          <img src={memory.images[0]} alt={memory.title} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      <div className="memory-info2">
        <h2>{memory.title}</h2>
        <p>{memory.tags || "N/A"}</p>
        <p>
          {memory.preview ? memory.preview.slice(0, 100) : "No preview"}
          <Link to={`/memory/${memory.id}`} className="read-more-btn">
            ...Read More
          </Link>
        </p>
      </div>

      <div className="memory-actions">
        {memory.isPublic !== undefined && (
          <div className={`status-tag ${memory.isPublic ? "public" : "private"}`}>
            {memory.isPublic ? "Public" : "Private"}
          </div>
        )}
        <div
          className={`status-tag ${isFavorite ? "liked" : "unliked"}`}
          onClick={toggleFavorite}
          style={{ cursor: "pointer" }}
        >
          {isFavorite ? <FaHeart size={25} color="#ec4e4eff" /> : <FaRegHeart size={25} color="#ec4e4eff" />}
        </div>
      </div>
    </div>
  );
}

export default MemoryCard;
