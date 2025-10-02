import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import "../styles/MemoryCard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MemoryContext } from "../context/MemoryContext";

const MemoryCard = ({ memory }) => {
  const { updateMemory } = useContext(MemoryContext);
  const [isFavorite, setIsFavorite] = useState(memory.isFavorite || false);

  // Get image URL from public Supabase storage
  const getImageUrl = (path) => {
    if (!path || path.length === 0) return null;
    const fileName = Array.isArray(path) ? path[0] : path; // take first file if array
    return supabase.storage.from("memory-images").getPublicUrl(fileName).data.publicUrl;
  };

  const toggleFavorite = async () => {
    try {
      const user = supabase.auth.user();
      if (!user) return alert("You must be logged in!");

      const { error } = await supabase
        .from("memories")
        .update({ isFavorite: !isFavorite })
        .eq("id", memory.id);

      if (error) throw error;

      setIsFavorite(!isFavorite);
      updateMemory(memory.id, { isFavorite: !isFavorite });
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
        {/* Hashtags instead of Tags: */}
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
