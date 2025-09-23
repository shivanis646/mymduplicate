import { useState, useEffect } from 'react';
import "../styles/vault.css"; // reuse Vault CSS
import FavCard from '../components/favcard';
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import { Link } from 'react-router-dom';
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser,FaRegHeart, FaFolderOpen } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);
  useEffect(() => {
      document.title = "Map My Memoir - Favorites";
    }, []);

  return (
    <div className="layout">
      {/* Left Icon Sidebar */}
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
          <Link to="/folders" title="Folders"><FaFolderOpen color="#5e412f" /></Link>
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

        <main style={{ flex: 1 }}>
          <div className="urs">
            <p>Your Favorites</p>
          </div>

          <div className="memory-feed2" id="memoryFeed2">
            {favorites.length > 0 ? (
              favorites.map(memory => (
                <FavCard key={memory.id} memory={memory}>
                  <div
                    className={`status-tag ${memory.isFavorite ? 'liked' : 'unliked'}`}
                  >
                    {memory.isFavorite ? <FaHeart size={25} color='#ec4e4eff'/> : <FaRegHeart size={25} color='#ec4e4eff'/>}
                  </div>
                </FavCard>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#8b5e3c" }}>
                No favorites yet.
              </p>
            )}
          </div>
        </main>

        <footer className='foo1'>
          <p>© 2025 Map My Memoir</p>
        </footer>
      </div>
    </div>
  );
}

export default Favorites;

