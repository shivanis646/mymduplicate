import "../styles/project.css";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import sampleImg from "../assets/img.jpg";
import { Link } from "react-router-dom";
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";
import { useEffect } from "react";

function Project() {
  useEffect(() => {
      document.title = "Map My Memoir - Home";
    }, []);
  return (
    <div className="layout">
      {/* Left Icon Sidebar */}
      <aside className="icon-sidebar">
        <div className="sidebar-top">
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
        <nav className="sidebar-nav">
          <Link className="g" to="/" title="Home"><FaHome color="#5e412f"/></Link>
          <Link className="g" to="/mymap" title="My Map"><FaMapMarkedAlt color="#5e412f"/></Link>
          <Link className="g" to="/create" title="Create Memory"><FaPlus color="#5e412f"/></Link>
          <Link className="g" to="/explore" title="Explore"><FaCompass color="#5e412f"/></Link>
          <Link className="g" to="/vault" title="Vault"><GiSecretBook color="#5e412f"/></Link>
          <Link className="g" to="/Favorites" title="Favorites"><FaHeart color="#5e412f"/></Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="navbar">
          <p>Map My Memoir</p>
          <Link className="prof" to="/profile" title="Profile"><FaUser size={27}color="#5e412f"/></Link>
        </header>

        <main className="hero-section">
          <div className="hero-text">
            <h2>Your Memories Deserve a Map.</h2>
            <p>
              Preserve the soul of your journeys with geo-tagged, emotion-rich entries —
              private by default, magical when shared.
            </p>
            <Link className="btn" to="/create">Start Your Journey →</Link>
          </div>
          <div className="hero-image">
            <img src={sampleImg} alt="Memory Map Sample" />
          </div>
        </main>

        <section className="features">
          <h3>✨ Why Map Your Memoirs?</h3>
          <div className="feature-list">
            <div className="feature-card">📍 Capture Places, Not Just Moments</div>
            <div className="feature-card">📷 Pure Moments, Purely Yours</div>
            <div className="feature-card">🔒 Your Safe Space, <br />Always</div>
            <div className="feature-card">📶 Never Lose a Memory Again</div>
            <div className="feature-card">🗺️ Walk Down Memory Lane</div>
          </div>
        </section>

        <footer>
          <p>© 2025 Map My Memoir. Built with heart.</p>
        </footer>
      </div>
    </div>
  );
}

export default Project;
