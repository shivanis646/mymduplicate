import "../styles/project.css";
import "../styles/create.css";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import bgImage from "../assets/bg.png";
import { Link } from "react-router-dom";
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser, FaLock, FaGlobe } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";
import { useEffect } from "react";

function Create() {
  useEffect(() => {
    document.title = "Map My Memoir - Create new memory";
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
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content" style={{ backgroundImage: `url(${bgImage})` }}>
        <header className="navbar">
          <p>Map My Memoir</p>
          <Link className="prof" to="/profile" title="Profile"><FaUser size={27} color="#5e412f" /></Link>
        </header>

        <main className="form-container">
          <h2>Create a New Memory</h2>
          <form>
            <label>Memory Title:</label>
            <input type="text" placeholder="e.g., Sunset at Jaisalmer Fort" required />

            <label>Memory Story (max 300 words):</label>
            <textarea rows="6" maxLength="1500" placeholder="Describe your memory..."></textarea>

            <label>Geo Tag:</label>
            <input type="text" placeholder="e.g., Jaisalmer, Rajasthan" required />

            <label>Geo Link:</label>
            <input type="text" placeholder="e.g googlemaps" required />

            <label>Culture Tag:</label>
            <input type="text" placeholder="e.g., Rajasthani Folk Art" required />

            <label>Core Memory Tag:</label>
            <input type="text" placeholder="e.g., First solo trip" required />

            <label>Food Tag (Optional):</label>
            <input type="text" placeholder="e.g., Dal Baati Churma" />

            <label>Story of the Place (Optional):</label>
            <textarea rows="3" placeholder="e.g., Built by Rawal Jaisal in 1156 AD..." />

            <label>Emotion Tag:</label>
            <select>
              <option value="">Select one</option>
              <option>😊 Peaceful</option>
              <option>😮 Awe-struck</option>
              <option>🥹 Nostalgic</option>
              <option>🤍 Loved</option>
              <option>😢 Emotional</option>
            </select>

            <label>Photo:</label>
            <input type="file" accept="image/*" capture="environment" required />

            <label>Emotions:</label>
            <div className="radio-group">
              <label><input type="radio" name="emotion" value="peaceful" /> 😊 Peaceful</label>
              <label><input type="radio" name="emotion" value="awe" /> 😮 Awe-struck</label>
              <label><input type="radio" name="emotion" value="nostalgic" /> 🥹 Nostalgic</label>
              <label><input type="radio" name="emotion" value="loved" /> 🤍 Loved</label>
              <label><input type="radio" name="emotion" value="emotional" /> 😢 Emotional</label>
            </div>

            <label>Place Type:</label>
            <div className="radio-group">
              <label><input type="radio" name="place" value="beach" /> 🏖️ Beach</label>
              <label><input type="radio" name="place" value="mountain" /> 🏔️ Mountain</label>
              <label><input type="radio" name="place" value="city" /> 🏙️ City</label>
              <label><input type="radio" name="place" value="village" /> 🏡 Village</label>
              <label><input type="radio" name="place" value="forest" /> 🌲 Forest</label>
              <label><input type="radio" name="place" value="temple" /> 🛕 Temple</label>
            </div>

            <input type="hidden" id="visibilityValue" name="visibility" value="private" />

            <label>Visibility:</label>
            <div className="visibility-toggle">
              <span><FaLock size={23} color="#5e412f" /></span>
              <label className="switch">
                <input type="checkbox" id="visibilityToggle" name="visibility" />
                <span className="slider1"></span>
              </label>
              <span><FaGlobe size={23} color="#5e412f" /></span>
            </div>

            <button type="submit">Save Memory</button>
          </form>
        </main>

        <footer>
          <p>© 2025 Map My Memoir</p>
        </footer>
      </div>
    </div>
  );
}

export default Create;
