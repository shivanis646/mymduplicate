import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/memory.css";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import { MemoryContext } from "../context/MemoryContext";
import { supabase } from "../utils/supabaseClient";

// Icons
import {
  FaHome,
  FaMapMarkedAlt,
  FaPlus,
  FaCompass,
  FaHeart,
  FaUser,
  FaRegHeart,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";
import { PiMapPinFill } from "react-icons/pi";

const MemoryDetails3 = () => {
  const { id } = useParams();
  const { toggleFavorite: toggleFavoriteContext } = useContext(MemoryContext);

  const [memory, setMemory] = useState(null);
  const [images, setImages] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch memory details
  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const { data, error } = await supabase
          .from("memories")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;

        setMemory(data);
        setLikeCount(data.likes_count || 0);

        // build image URLs
        const imgs = (data.images || []).map(
          (img) =>
            supabase.storage.from("memory-images").getPublicUrl(img).data
              .publicUrl
        );
        setImages(imgs);

        // check if user has liked this memory
        const {
          data: { session },
        } = await supabase.auth.getSession();
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
      } catch (err) {
        console.error("Error fetching memory:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [id]);

  // ✅ Slider controls
  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setSlideIndex((prev) => (prev - 1 + images.length) % images.length);

  // ✅ Handle like toggle
  const handleFavoriteToggle = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in!");
        return;
      }

      const userId = session.user.id;

      // get profile liked array
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
        newLikesCount = likeCount > 0 ? likeCount - 1 : 0;
        await supabase
          .from("profiles")
          .update({ liked: likedArray.filter((memId) => memId !== id) })
          .eq("id", userId);
      } else {
        newLikesCount = likeCount + 1;
        await supabase
          .from("profiles")
          .update({ liked: [...likedArray, id] })
          .eq("id", userId);
      }

      // update likes_count in memories table
      const { error: updateError } = await supabase
        .from("memories")
        .update({ likes_count: newLikesCount })
        .eq("id", id);
      if (updateError) throw updateError;

      setIsFavorite(!alreadyLiked);
      setLikeCount(newLikesCount);

      if (toggleFavoriteContext) toggleFavoriteContext(id);
    } catch (err) {
      console.error("Failed to toggle favorite:", err.message);
      alert("Failed to update favorite: " + err.message);
    }
  };

  // ✅ Handle public/private toggle
  const handlePrivacyToggle = async () => {
    try {
      const newStatus = !memory.isPublic;

      // optimistic UI
      setMemory({ ...memory, isPublic: newStatus });

      const { error } = await supabase
        .from("memories")
        .update({ isPublic: newStatus })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to toggle privacy:", err.message);
      alert("Failed to update privacy: " + err.message);
    }
  };

  if (loading) return <p>Loading memory...</p>;
  if (!memory) return <p>Memory not found!</p>;

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="icon-sidebar">
        <div className="sidebar-top">
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <Link to="/" title="Home">
            <FaHome color="#5e412f" />
          </Link>
          <Link to="/mymap" title="My Map">
            <FaMapMarkedAlt color="#5e412f" />
          </Link>
          <Link to="/create" title="Create Memory">
            <FaPlus color="#5e412f" />
          </Link>
          <Link to="/explore" title="Explore">
            <FaCompass color="#5e412f" />
          </Link>
          <Link to="/vault" title="Vault">
            <GiSecretBook color="#5e412f" />
          </Link>
          <Link to="/favorites" title="Favorites">
            <FaHeart color="#5e412f" />
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="navbar">
          <p>Map My Memoir</p>
          <Link className="prof" to="/profile" title="Profile">
            <FaUser size={27} color="#5e412f" />
          </Link>
        </header>

        <div className="memory-full-container">
          {/* Image Slider */}
          {images.length > 0 && (
            <div className="memory-slider">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Slide ${i + 1}`}
                  style={{
                    display: i === slideIndex ? "block" : "none",
                    width: "100%",
                    maxHeight: "400px",
                    borderRadius: "10px",
                  }}
                />
              ))}
              {images.length > 1 && (
                <div className="slider-buttons">
                  <button onClick={prevSlide}>⟨</button>
                  <button onClick={nextSlide}>⟩</button>
                </div>
              )}
            </div>
          )}

          {/* Tags & Actions */}
          <div className="tags-bar">
            {memory.geo_tag && (
              <a
                href={memory.maploc}
                target="_blank"
                rel="noopener noreferrer"
                className="tag1"
              >
                <PiMapPinFill size={23} color="#5e412f" /> {memory.geo_tag}
              </a>
            )}
            <button className="tag3" onClick={handleFavoriteToggle}>
              {isFavorite ? (
                <FaHeart size={25} color="#ec4e4eff" />
              ) : (
                <FaRegHeart size={25} color="#ec4e4eff" />
              )}
              <span style={{ marginLeft: "8px", fontSize: "18px" }}>
                {likeCount}
              </span>
            </button>
            <button className="tag" onClick={handlePrivacyToggle}>
              {memory.isPublic ? (
                <FaUnlock size={23} color="green" />
              ) : (
                <FaLock size={23} color="red" />
              )}
            </button>
          </div>

          {/* Memory Details */}
          <div className="memory-details">
            <h2>{memory.title}</h2>
            <p>
              <strong>Tags:</strong>{" "}
              {memory.geo_tag
                ? memory.geo_tag.split(",").map((tag, i) => (
                    <span key={i}>#{tag.trim()} </span>
                  ))
                : "#NoTags"}
            </p>
            <p>
              <strong>Preview:</strong> {memory.memory_story}
            </p>
            <p>
              <strong>Emotions:</strong> {memory.emotion}
            </p>
            <p>
              <strong>Place Type:</strong> {memory.place_type}
            </p>
            <p>
              <strong>Geo Tag:</strong> {memory.geo_tag}
            </p>
            <p>
              <strong>Culture Tag:</strong> {memory.culture_tag}
            </p>
            <p>
              <strong>Core Memory:</strong> {memory.core_memory}
            </p>
            <p>
              <strong>Food Tag:</strong> {memory.food_tag}
            </p>
            <p>
              <strong>Story of the Place:</strong> {memory.story_place}
            </p>
            <p>
              <strong>Memory in the Place:</strong> {memory.memory_story}
            </p>
          </div>
        </div>

        <footer>
          <p>© 2025 Map My Memoir</p>
        </footer>
      </div>
    </div>
  );
};

export default MemoryDetails3;
