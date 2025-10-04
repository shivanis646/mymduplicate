import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import "../styles/MemoryCard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function FavCard({ memory, onLikeToggle }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // ✅ Fetch public URL for the first image
  useEffect(() => {
    if (memory.images && memory.images.length > 0) {
      const { data } = supabase.storage
        .from("memory-images")
        .getPublicUrl(memory.images[0]); // take first filename
      setImageUrl(data.publicUrl);
    }
  }, [memory.images]);

  // ✅ Check favorite status
  useEffect(() => {
    const checkFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("liked")
        .eq("id", user.id)
        .single();

      if (profile?.liked?.includes(memory.id)) {
        setIsFavorite(true);
      }
    };

    checkFavorite();
  }, [memory.id]);

  const toggleFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in!");
        return;
      }

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("liked")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      let updatedLiked = profile.liked || [];

      if (isFavorite) {
        updatedLiked = updatedLiked.filter((id) => id !== memory.id);
      } else {
        updatedLiked = [...updatedLiked, memory.id];
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ liked: updatedLiked })
        .eq("id", user.id);

      if (updateError) throw updateError;

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
        {imageUrl ? (
          <img src={imageUrl} alt={memory.title} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      <div className="memory-info2">
        <h2>{memory.title}</h2>
        <p className="tags">
          {memory.geo_tag
            ? memory.geo_tag.split(",").map((tag, i) => (
                <span key={i}>#{tag.trim()} </span>
              ))
            : "#NoTags"}
        </p>

        {/* ✅ Use memory_story as preview */}
        <p>
          {memory.memory_story
            ? memory.memory_story.slice(0, 100)
            : "No preview"}
          <Link to={`/memory/${memory.id}`} className="read-more-btn">
            ...Read More
          </Link>
        </p>
      </div>

      <div className="memory-actions">
        <div
          className={`status-tag ${isFavorite ? "liked" : "unliked"}`}
          onClick={toggleFavorite}
          style={{ cursor: "pointer" }}
        >
          {isFavorite ? (
            <FaHeart size={25} color="#ec4e4eff" />
          ) : (
            <FaRegHeart size={25} color="#ec4e4eff" />
          )}
        </div>
      </div>
    </div>
  );
}

export default FavCard;
