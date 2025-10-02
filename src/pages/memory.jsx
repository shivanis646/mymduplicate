import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/memory.css";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import { MemoryContext } from "../context/MemoryContext";
import { supabase } from "../utils/supabaseClient";

// Icons
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser, FaRegHeart } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";
import { PiMapPinFill } from "react-icons/pi";

const MemoryDetails = () => {
  const { id } = useParams();
  const { memories, toggleFavorite } = useContext(MemoryContext);

  const [memory, setMemory] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    document.title = "Map My Memoir - Memory Details";
    const mem = memories.find((m) => m.id === id);
    if (mem) {
      setMemory(mem);
    }
  }, [id, memories]);

  // 🔥 Fetch if this memory is in user's liked list
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

        const liked = profile?.liked || [];
        setIsFavorite(liked.includes(id));
      } catch (err) {
        console.error("Error fetching favorite status:", err.message);
      }
    };

    if (id) fetchFavoriteStatus();
  }, [id]);

  if (!memory) return <p>Loading memory...</p>;

  // --- Get image URL from Supabase public storage ---
  const getImageUrl = (path) => {
    if (!path || path.length === 0) return null;
    const fileName = Array.isArray(path) ? path[0] : path;
    return supabase.storage.from("memory-images").getPublicUrl(fileName).data.publicUrl;
  };

  const images = (memory.images || []).map((img) => getImageUrl(img));

  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleFavoriteToggle = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in!");
        return;
      }

      const userId = session.user.id;

      // Fetch current liked array
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("liked")
        .eq("id", userId)
        .single();

      if (fetchError) throw fetchError;

      let liked = profile?.liked || [];
      let newLiked;

      if (liked.includes(id)) {
        newLiked = liked.filter((memId) => memId !== id);
      } else {
        newLiked = [...liked, id];
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ liked: newLiked })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Optimistic UI update
      setIsFavorite(!isFavorite);

      // Update context/global state
      toggleFavorite(id);
    } catch (err) {
      console.error("Failed to update favorite:", err.message);
      alert("Failed to update favorite: " + err.message);
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="icon-sidebar">
        <div className="sidebar-top">
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <Link to="/" title="Home"><FaHome color="#5e412f" /></Link>
          <Link to="/mymap" title="My Map"><FaMapMarkedAlt color="#5e412f" /></Link>
          <Link to="/create" title="Create Memory"><FaPlus color="#5e412f" /></Link>
          <Link to="/explore" title="Explore"><FaCompass color="#5e412f" /></Link>
          <Link to="/vault" title="Vault"><GiSecretBook color="#5e412f" /></Link>
          <Link to="/favorites" title="Favorites"><FaHeart color="#5e412f" /></Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="navbar">
          <p>Map My Memoir</p>
          <Link className="prof" to="/profile" title="Profile">
            <FaUser size={27} color="#5e412f" />
          </Link>
        </header>

        {/* Memory Details */}
        <div className="memory-full-container">
          {/* Image Slider */}
          <div className="memory-slider">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Slide ${i + 1}`}
                className={i === slideIndex ? "slide-image active" : "slide-image"}
                style={{ display: i === slideIndex ? "block" : "none" }}
              />
            ))}
            <div className="slider-buttons">
              <button onClick={prevSlide}>⟨</button>
              <button onClick={nextSlide}>⟩</button>
            </div>
          </div>

          {/* Tags & Favorite */}
          <div className="tags-bar">
            {memory.geo_tag && (
              <a href={memory.maploc} target="_blank" rel="noopener noreferrer" className="tag1">
                <PiMapPinFill size={23} color="#5e412f" /> {memory.geo_tag}
              </a>
            )}
            <button
              className="tag"
              style={{
                backgroundColor: isFavorite ? "#f0dbc8ff" : "#f8b4b4",
                color: "#5e412f",
              }}
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? (
                <FaHeart size={23} color="#ec4e4eff" />
              ) : (
                <FaRegHeart size={23} color="#ec4e4eff" />
              )}
            </button>
          </div>

          {/* Memory Details */}
          <div className="memory-details">
            <h2>{memory.title}</h2>
            <p><strong>Tags:</strong> {memory.geo_tag
              ? memory.geo_tag.split(",").map((tag, i) => (
                  <span key={i}>#{tag.trim()} </span>
                ))
              : "#NoTags"}</p>
            <p><strong>Preview:</strong> {memory.memory_story}</p>
            <p><strong>Emotions:</strong> {memory.emotion}</p>
            <p><strong>Place Type:</strong> {memory.place_type}</p>
            <p><strong>Geo Tag:</strong> {memory.geo_tag}</p>
            <p><strong>Culture Tag:</strong> {memory.culture_tag}</p>
            <p><strong>Core Memory:</strong> {memory.core_memory}</p>
            <p><strong>Food Tag:</strong> {memory.food_tag}</p>
            <p><strong>Story of the Place:</strong> {memory.story_place}</p>
            <p><strong>Memory in the Place:</strong> {memory.memory_story}</p>
          </div>
        </div>

        <footer>
          <p>© 2025 Map My Memoir</p>
        </footer>
      </div>
    </div>
  );
};

export default MemoryDetails;
