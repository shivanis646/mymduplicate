import { useState,useEffect } from 'react';
import "../styles/vault.css";
import dummyMemories from '../data/memories';
import MemoryCard2 from '../components/MemoryCard2';
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import { Link } from 'react-router-dom';
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";

function Vault() {
  useEffect(() => {
      document.title = "Map My Memoir -Vault";
    }, []);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMemories = dummyMemories.filter(memory =>
    (memory.title + memory.tags + memory.preview)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
            <p>Your Journeys</p>
          </div>

          <div className="memory-feed2" id="memoryFeed2">
            {filteredMemories.length > 0 ? (
              filteredMemories.map(memory => (
                <MemoryCard2 key={memory.id} memory={memory}>
                  <div
                    className={`status-tag ${memory.isPublic ? 'public' : 'private'}`}
                  >
                    {memory.isPublic ? 'Public' : 'Private'}
                  </div>
                </MemoryCard2>
              ))
            ) : (
              <p>No memories found.</p>
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

export default Vault;
