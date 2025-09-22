import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/memory.css";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import dummyMemories from "../data/memories";

// Icons
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser, FaRegHeart } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";
import { PiMapPinFill } from "react-icons/pi";

const MemoryDetails = () => {
  const { id } = useParams();
  const memory = dummyMemories.find((m) => m.id === parseInt(id));

  const [isFavorite, setIsFavorite] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  // ✅ Check if memory is already a favorite on load
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = favorites.find((fav) => fav.id === memory?.id);
    setIsFavorite(!!exists);
  }, [memory?.id]);
  useEffect(() => {
      document.title = "Map My Memoir - Explore";
    }, []);

  // ✅ Add or remove from favorites
  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      favorites = favorites.filter((fav) => fav.id !== memory.id);
    } else {
      favorites.push(memory);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite((prev) => !prev);
  };

  if (!memory) {
    return <p>Memory not found!</p>;
  }

  const images = memory.images;

  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + images.length) % images.length);

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
        {/* Top Navbar */}
        <header className="navbar">
          <p>Map My Memoir</p>
          <Link className="prof" to="/profile" title="Profile">
            <FaUser size={27} color="#5e412f" />
          </Link>
        </header>

        {/* Memory Details Section */}
        <div className="memory-full-container">
          {/* Image Slider */}
          <div className="memory-slider">
            <div className="slider">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Slide ${i + 1}`}
                  className={i === slideIndex ? "slide-image active" : "slide-image"}
                  style={{ display: i === slideIndex ? "block" : "none" }}
                />
              ))}
            </div>
            <div className="slider-buttons">
              <button onClick={prevSlide}>⟨</button>
              <button onClick={nextSlide}>⟩</button>
            </div>
          </div>

          {/* Tags Bar */}
          <div className="tags-bar">
            <a
              href={memory.maploc}
              target="_blank"
              rel="noopener noreferrer"
              className="tag1"
            >
              <PiMapPinFill size={23} color="#5e412f" /> {memory.geoTag}
            </a>

            <button
              className="tag"
              style={{
                backgroundColor: isFavorite ? "#f0dbc8ff" : "#f8b4b4",
                color: "#5e412f"
              }}
              onClick={toggleFavorite}
            >
              {isFavorite ? (
                <FaHeart size={23} color="#ec4e4eff" />
              ) : (
                <FaRegHeart size={23} color="#ec4e4eff" />
              )}
            </button>
          </div>

          {/* Text Details */}
          <div className="memory-details">
            <h2>{memory.title}</h2>
            <p><strong>Tags:</strong> {memory.tags}</p>
            <p><strong>Preview:</strong> {memory.preview}</p>
            <p><strong>Emotions:</strong> {memory.emotion}</p>
            <p><strong>Place Type:</strong> {memory.placeType}</p>
            <p><strong>Geo Tag:</strong> {memory.geoTag}</p>
            <p><strong>Culture Tag:</strong> {memory.cultureTag}</p>
            <p><strong>Core Memory:</strong> {memory.coreMemory}</p>
            <p><strong>Food Tag:</strong> {memory.foodTag}</p>
            <p><strong>Story of the Place:</strong> {memory.storyPlace}</p>
            <p><strong>Memory in the Place:</strong> {memory.memoryStory}</p>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <p>© 2025 Map My Memoir</p>
        </footer>
      </div>
    </div>
  );
};

export default MemoryDetails;

