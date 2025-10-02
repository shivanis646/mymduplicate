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

const MemoryDetails3 = () => {
  const { id } = useParams();
  const { memories, toggleFavorite: toggleFavoriteContext } = useContext(MemoryContext);

  const [memory, setMemory] = useState(null);
  const [images, setImages] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch memory (from context or Supabase)
  useEffect(() => {
    if (!id) {
      setError("Memory ID is missing");
      setLoading(false);
      return;
    }

    const fetchMemory = async () => {
      try {
        let mem = memories.find((m) => String(m.id) === String(id));

        if (!mem) {
          const { data, error } = await supabase
            .from("memories")
            .select("*")
            .eq("id", id)
            .single();
          if (error) throw error;
          mem = data;
        }

        setMemory(mem);

        // Build image URLs after memory is fetched
        const imgs = (mem.images || []).map((img) =>
          supabase.storage.from("memory-images").getPublicUrl(img).data.publicUrl
        );
        setImages(imgs);
      } catch (err) {
        console.error(err);
        setError("Failed to load memory: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
  }, [id, memories]);

  // Reset slide index when images change
  useEffect(() => {
    setSlideIndex(0);
  }, [images]);

  // Fetch favorite status
  useEffect(() => {
    if (!id) return;

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
        setIsFavorite(profile?.liked?.includes(id) || false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavoriteStatus();
  }, [id]);

  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + images.length) % images.length);

  const handleFavoriteToggle = async () => {
    if (!id) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in!");
        return;
      }

      const userId = session.user.id;
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("liked")
        .eq("id", userId)
        .single();
      if (error) throw error;

      const liked = profile?.liked || [];
      const newLiked = liked.includes(id)
        ? liked.filter((memId) => memId !== id)
        : [...liked, id];

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ liked: newLiked })
        .eq("id", userId);
      if (updateError) throw updateError;

      setIsFavorite(!isFavorite);
      if (toggleFavoriteContext) toggleFavoriteContext(id);
    } catch (err) {
      console.error(err);
      alert("Failed to toggle favorite: " + err.message);
    }
  };

  if (loading) return <p>Loading memory...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!memory) return <p>Memory not found!</p>;

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
          {images.length > 0 ? (
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
              <div className="slider-buttons">
                <button onClick={prevSlide}>⟨</button>
                <button onClick={nextSlide}>⟩</button>
              </div>
            </div>
          ) : (
            <p>Loading images...</p>
          )}

          {/* Tags & Favorite */}
          <div className="tags-bar">
            {memory.geo_tag && (
              <a href={memory.maploc} target="_blank" rel="noopener noreferrer" className="tag1">
                <PiMapPinFill size={23} color="#5e412f" /> {memory.geo_tag}
              </a>
            )}
            <button className="tag" onClick={handleFavoriteToggle}>
              {isFavorite ? <FaHeart size={23} color="#ec4e4eff" /> : <FaRegHeart size={23} color="#ec4e4eff" />}
            </button>
          </div>

          {/* Memory Details */}
          <div className="memory-details">
            <h2>{memory.title}</h2>
            <p><strong>Tags:</strong> {memory.geo_tag ? memory.geo_tag.split(",").map((tag,i)=><span key={i}>#{tag.trim()} </span>) : "#NoTags"}</p>
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

export default MemoryDetails3;
