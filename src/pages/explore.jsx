import { useState,useEffect } from 'react';
import "../styles/project.css";
import MemoryCard from '../components/MemoryCard';
import dummyMemories from '../data/memories';
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import { Link } from 'react-router-dom';
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser, FaFolderOpen } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";

function Explore() {
  useEffect(() => {
    document.title = "Map My Memoir - Explore";
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredMemories = dummyMemories.filter(memory =>
    (memory.title + memory.tags + memory.preview).toLowerCase().includes(searchQuery.toLowerCase())
  );
  

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
          <Link to="/folders" title="Folders"><FaFolderOpen color="#5e412f" /></Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <header className="navbar">
          <p>Map My Memoir</p>
          <Link className="prof" to="/profile" title="Profile">
            <FaUser size={27} color="#5e412f" />
          </Link>
        </header>

        <main style={{flex:1}}>
          {/* Search bar */}
          <div className="search-container">
            <input
              type="text"
              id="searchInput"
              placeholder="Search for places, emotions, food..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button>Search</button>
          </div>

          {/* Memory feed */}
          <div className="memory-feed" id="memoryFeed">
            {filteredMemories.length > 0 ? (
              filteredMemories.map(memory => (
                <MemoryCard key={memory.id} memory={memory} />
              ))
            ) : (
              <p>No memories found.</p>
            )}
          </div>
        </main>

        <footer className="foo">
          <p>© 2025 Map My Memoir. Built with heart.</p>
        </footer>
      </div>
    </div>
  );
}

export default Explore;
