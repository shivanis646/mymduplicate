import React, { useState,useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { user, updateUserProfile } from "../data/userdata";
import "../styles/editProfile.css";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";

function EditProfile() {
  useEffect(() => {
    document.title = "Map My Memoir - Edit Profile";
  }, []);
  const navigate = useNavigate();
  const [editedUser, setEditedUser] = useState({
    ...user,
    memories: user.stats.memories || 0,
    countries: user.stats.countries || 0,
    favorites: user.stats.favorites || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser((prevData) => ({
          ...prevData,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUserProfile(editedUser);
    navigate("/profile");
  };

  const handleCancel = () => {
    navigate("/profile");
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
          <Link to="/Favorites" title="Favorites"><FaHeart color="#5e412f" /></Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar */}
        <header className="navbar">
          <p>Map My Memoir</p>
          <Link className="prof" to="/profile" title="Profile"><FaUser size={27} color="#5e412f" /></Link>
        </header>

        {/* Edit Profile Section */}
        <div className="edit-profile-container">
          <div className="edit-profile-card">
            <div className="profile-image-section">
              <img
                src={editedUser.profilePic}
                alt="Profile"
                className="profile-img-edit"
              />
              <label htmlFor="file-upload" id="upload-label">+</label>
              <input
                id="file-upload"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            <div className="profile-details-section">
              <h2>Edit Profile</h2>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={editedUser.tagline}
                  onChange={handleChange}
                />
              </div>

              {/* Memories Counter */}
              <div className="form-group">
                <label>Number of Memories</label>
                <div className="counter">
                  <button
                    className="p"
                    type="button"
                    onClick={() =>
                      setEditedUser((prev) => ({
                        ...prev,
                        memories: Math.max(0, prev.memories - 1),
                      }))
                    }
                  >
                    −
                  </button>
                  <span>{editedUser.memories}</span>
                  <button
                    className="p"
                    type="button"
                    onClick={() =>
                      setEditedUser((prev) => ({
                        ...prev,
                        memories: prev.memories + 1,
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Countries Counter */}
              <div className="form-group">
                <label>Countries Visited</label>
                <div className="counter">
                  <button
                    className="p"
                    type="button"
                    onClick={() =>
                      setEditedUser((prev) => ({
                        ...prev,
                        countries: Math.max(0, prev.countries - 1),
                      }))
                    }
                  >
                    −
                  </button>
                  <span>{editedUser.countries}</span>
                  <button
                    className="p"
                    type="button"
                    onClick={() =>
                      setEditedUser((prev) => ({
                        ...prev,
                        countries: prev.countries + 1,
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Favorites */}
              <div className="form-group">
                <label>Favorites</label>
                <div className="counter1">
                  <span>{editedUser.favorites}</span>
                </div>
              </div>

              <div className="edit-buttons">
                <button className="btn save-btn" onClick={handleSave}>
                  Save
                </button>
                <button className="btn cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <p>© 2025 Map My Memoir. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default EditProfile;
