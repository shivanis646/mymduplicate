import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import "../styles/MemoryCard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const MemoryCard = ({ memory }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Get image URL from Supabase storage
  const getImageUrl = (path) => {
    if (!path || path.length === 0) return null;
    const fileName = Array.isArray(path) ? path[0] : path; // first image
    return supabase.storage.from("memory-images").getPublicUrl(fileName).data.publicUrl;
  };

  // Load favorite status for this memory from profile.liked
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const userId = session.user.id;
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("liked")
          .eq("id", userId)
          .single();

        if (error) throw error;

        setIsFavorite(profile?.liked?.includes(memory.id) || false);
      } catch (err) {
        console.error("Error fetching favorite status:", err.message);
      }
    };

    fetchFavoriteStatus();
  }, [memory.id]);

  // Toggle favorite → update profiles.liked
  const toggleFavorite = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in!");
        return;
      }

      const userId = session.user.id;

      // Get current liked array
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("liked")
        .eq("id", userId)
        .single();

      if (error) throw error;

      const liked = profile?.liked || [];
      const newLiked = liked.includes(memory.id)
        ? liked.filter((memId) => memId !== memory.id)
        : [...liked, memory.id];

      // Update in DB
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ liked: newLiked })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Update state
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Failed to toggle favorite:", err.message);
      alert("Failed to update favorite.");
    }
  };

  if (!memory) return null;

  const imageUrl = getImageUrl(memory.images);

  return (
    <div className="memory-card">
      {/* Display image */}
      {imageUrl ? (
        <img src={imageUrl} alt={memory.title} className="memory-card-img" />
      ) : (
        <div className="no-image">No Image</div>
      )}

      <div className="mem">
        <h2>{memory.title}</h2>
        <p className="tags">
          {memory.geo_tag
            ? memory.geo_tag.split(",").map((tag, i) => (
                <span key={i}>#{tag.trim()} </span>
              ))
            : "#NoTags"}
        </p>
        <p>
          {memory.memory_story ? memory.memory_story.slice(0, 100) : "No preview"}
          <Link to={`/memory/${memory.id}`} className="read-more-btn">
            ...Read More
          </Link>
        </p>

        
        
      </div>
    </div>
  );
};

export default MemoryCard;
