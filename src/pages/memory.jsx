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
  const { memories, liked, toggleFavorite } = useContext(MemoryContext);

  const [memory, setMemory] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ Fetch memory details & likes from DB
  useEffect(() => {
    const fetchMemory = async () => {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching memory:", error.message);
        return;
      }

      setMemory(data);
      setLikeCount(data.likes_count || 0);

      // check if user has liked this memory
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userId = session.user.id;
        const { data: profile } = await supabase
          .from("profiles")
          .select("liked")
          .eq("id", userId)
          .single();

        if (profile?.liked?.includes(id)) {
          setIsFavorite(true);
        }
      }
    };

    fetchMemory();
  }, [id]);

  if (!memory) return <p>Loading memory...</p>;

  // ✅ Build image URLs
  const images = (memory.images || []).map(
    (img) =>
      supabase.storage.from("memory-images").getPublicUrl(img)?.data?.publicUrl ||
      ""
  );

  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + images.length) % images.length);

  // ✅ Toggle like/favorite and update DB properly
  const handleFavoriteToggle = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in!");
        return;
      }

      const userId = session.user.id;

      // Fetch current profile liked array
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("liked")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      const likedArray = profile?.liked || [];
      const alreadyLiked = likedArray.includes(id);

      let newLikesCount = likeCount;

      if (alreadyLiked) {
        // Unlike -> only decrement if > 0
        newLikesCount = likeCount > 0 ? likeCount - 1 : 0;

        await supabase
          .from("profiles")
          .update({ liked: likedArray.filter((memId) => memId !== id) })
          .eq("id", userId);
      } else {
        // Like -> increment
        newLikesCount = likeCount + 1;

        await supabase
          .from("profiles")
          .update({ liked: [...likedArray, id] })
          .eq("id", userId);
      }

      // ✅ Update memory likes_count in DB
      const { error: updateError } = await supabase
        .from("memories")
        .update({ likes_count: newLikesCount })
        .eq("id", id);

      if (updateError) throw updateError;

      // Optimistic UI update
      setIsFavorite(!alreadyLiked);
      setLikeCount(newLikesCount);

      // update context too
      if (toggleFavorite) toggleFavorite(id);

    } catch (err) {
      console.error("Failed to toggle favorite:", err.message);
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
                alt={`Memory image ${i + 1}`}
                className={i === slideIndex ? "slide-image active" : "slide-image"}
                style={{ display: i === slideIndex ? "block" : "none" }}
              />
            ))}
            {images.length > 1 && (
              <div className="slider-buttons">
                <button onClick={prevSlide}>⟨</button>
                <button onClick={nextSlide}>⟩</button>
              </div>
            )}
          </div>

          {/* Tags & Favorite */}
          <div className="tags-bar">
            {memory.geo_tag && (
              <a href={memory.maploc} target="_blank" rel="noopener noreferrer" className="tag1">
                <PiMapPinFill size={23} color="#5e412f" /> {memory.geo_tag}
              </a>
            )}
            <button
              className="tag3"
              style={{
                backgroundColor: isFavorite ? "#f0dbc8ff" : "#f8b4b4",
                color: "#5e412f",
              }}
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? (
                <FaHeart size={25} color="#ec4e4eff" /> // ✅ bigger heart
              ) : (
                <FaRegHeart size={25} color="#ec4e4eff" />
              )}
              <span style={{ marginLeft: "8px", fontSize: "18px" }}>{likeCount}</span>
            </button>
          </div>

          {/* Memory Details */}
          <div className="memory-details">
            <h2>{memory.title}</h2>
            <p><strong>Tags:</strong> {memory.geo_tag
              ? memory.geo_tag.split(",").map((tag, i) => <span key={i}>#{tag.trim()} </span>)
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
