import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/editprofile.css";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";
import { supabase } from "../utils/supabaseClient";

function EditProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    tagline: "",
    profilepic: "",
    memories: 0,
    countries: 0,
    favorites: 0,
  });

  // Fetch user data
  useEffect(() => {
    document.title = "Map My Memoir - Edit Profile";

    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate("/login");

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("profiles")
        .select("name, tagline, profilepic, memories, countries, favorites")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Failed to fetch user:", error.message);
        navigate("/login");
        return;
      }

      setUserData({
        name: data.name || "",
        tagline: data.tagline || "",
        profilepic: data.profilepic || "",
        memories: data.memories || 0,
        countries: data.countries || 0,
        favorites: data.favorites || 0,
      });
    };

    fetchUser();
  }, [navigate]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  // Handle image upload
const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    alert('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    alert("Not logged in!");
    return;
  }

  const userId = session.user.id;
  const fileExt = file.name.split(".").pop();
  const fileName = `profile.${fileExt}`;
  const filePath = `${userId}/${fileName}`; // Organize in user folders

  try {
    // Delete old profile picture first (optional)
    if (userData.profilepic) {
      const oldPath = userData.profilepic.split('/profile-pics/')[1];
      if (oldPath) {
        await supabase.storage
          .from("profile-pics")
          .remove([oldPath]);
      }
    }

    // Upload new file
    const { data, error: uploadError } = await supabase.storage
      .from("profile-pics")
      .upload(filePath, file, { 
        cacheControl: '3600',
        upsert: true 
      });

    if (uploadError) {
      console.error("Upload Error:", uploadError.message);
      alert(`Failed to upload image: ${uploadError.message}`);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("profile-pics")
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      alert("Failed to get image URL");
      return;
    }

    // Update profile in database
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profilepic: urlData.publicUrl })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to update profilepic:", updateError.message);
      alert(`Failed to update profile picture: ${updateError.message}`);
      return;
    }

    // Update local state
    setUserData((prev) => ({ ...prev, profilepic: urlData.publicUrl }));
    alert("Profile picture updated successfully!");

  } catch (error) {
    console.error("Unexpected error:", error);
    alert("An unexpected error occurred");
  }
};

  // Save profile
  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session.user.id;

    const { error } = await supabase
      .from("profiles")
      .update({
        name: userData.name,
        tagline: userData.tagline,
        memories: userData.memories,
        countries: userData.countries
      })
      .eq("id", userId);

    if (error) {
      console.error("Failed to update profile:", error.message);
      alert("Failed to update profile!");
      return;
    }

    alert("Profile updated successfully!");
    navigate("/profile");
  };

  const handleCancel = () => navigate("/profile");

  return (
    <div className="layout">
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

      <div className="main-content">
        <header className="navbar">
          <p>Map My Memoir</p>
          <Link className="prof" to="/profile" title="Profile"><FaUser size={27} color="#5e412f" /></Link>
        </header>

        <div className="edit-profile-container">
          <div className="edit-profile-card">
            <div className="profile-image-section">
              <img
                src={userData.profilepic || "/default-profile.png"}
                alt="Profile"
                className="profile-img-edit"
              />
              <label htmlFor="file-upload" id="upload-label">+</label>
              <input id="file-upload" type="file" onChange={handleImageChange} style={{ display: "none" }} />
            </div>

            <div className="profile-details-section">
              <h2>Edit Profile</h2>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={userData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Tagline</label>
                <input type="text" name="tagline" value={userData.tagline} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Number of Memories</label>
                <div className="counter">
                  <button type="button" onClick={() => setUserData(prev => ({ ...prev, memories: Math.max(0, prev.memories - 1) }))}>−</button>
                  <span>{userData.memories}</span>
                  <button type="button" onClick={() => setUserData(prev => ({ ...prev, memories: prev.memories + 1 }))}>+</button>
                </div>
              </div>

              <div className="form-group">
                <label>Countries Visited</label>
                <div className="counter">
                  <button type="button" onClick={() => setUserData(prev => ({ ...prev, countries: Math.max(0, prev.countries - 1) }))}>−</button>
                  <span>{userData.countries}</span>
                  <button type="button" onClick={() => setUserData(prev => ({ ...prev, countries: prev.countries + 1 }))}>+</button>
                </div>
              </div>

              <div className="form-group">
                <label>Favorites</label>
                <div className="counter1">
                  <span>{userData.favorites}</span>
                </div>
              </div>

              <div className="edit-buttons">
                <button className="btn save-btn" onClick={handleSave}>Save</button>
                <button className="btn cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <p>© 2025 Map My Memoir. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default EditProfile;
