import "../styles/profile.css";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import profilePic from "../assets/profile.png";
import { logoutUser } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { user } from "../data/userdata";
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser, FaFolderOpen } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";
import React from "react";
import { useEffect } from "react";

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  useEffect(() => {
      document.title = "Map My Memoir - Profile";
    }, []);

  const handleEditClick = () => {
    navigate("/edit-profile");
  };

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

        {/* Profile Section */}
        <section className="profile-section">
          <div className="profile-card">
            <img src={profilePic} alt="Profile" className="profile-img" />
            <h2>{user.name}</h2>
            <p className="tagline">"{user.tagline}"</p>

            <div className="profile-stats">
              <div>
                <h3>{user.stats.memories}</h3>
                <p>Memories</p>
              </div>
              <div>
                <h3>{user.stats.countries}</h3>
                <p>Countries</p>
              </div>
              <div>
                <h3>{user.stats.favorites}</h3>
                <p>Favorites</p>
              </div>
            </div>

            <div className="d">
              <button className="btn" onClick={handleEditClick}>Edit Profile</button>
              <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </section>

        {/* Memory Preview */}
        <section className="memory-preview">
          <h3>Your Latest Memories</h3>
          <div className="memory-list">
            {user.latestMemories.map((memory, index) => (
              <div className="memory-card1" key={index}>
                <h4>{memory.title}</h4>
                <p>{memory.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer>
          <p>© 2025 Map My Memoir. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default Profile;
