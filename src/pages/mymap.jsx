import { useEffect } from "react";
import L from "leaflet";
import "../styles/mymap.css";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import { Link } from "react-router-dom";
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser, FaFolderOpen } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";

function MapView() {
  useEffect(() => {
      document.title = "Map My Memoir - My Map";
    }, []);
  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (mapContainer && mapContainer._leaflet_id != null) {
      mapContainer._leaflet_id = null;
    }
    
    const map = L.map("map").setView([20.5937, 78.9629], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const emotionMemoryData = [
      { location: [25.3176, 82.9739], title: "Varanasi - Calm Moment", tag: "Calm", color: "#00D09C" },
      { location: [28.7041, 77.1025], title: "Delhi - Nostalgic Train Ride", tag: "Nostalgic", color: "#A462F3" },
    ];

    const placeTagMemoryData = [
      { location: [19.076, 72.8777], title: "Mumbai - Local Restaurant", tag: "Restaurant", color: "#FF6B81" },
      { location: [11.1271, 78.6569], title: "Tamil Nadu - Temple Visit", tag: "Travel", color: "#38E4DA" },
    ];

    let markers = [];

    function clearMapPins() {
      markers.forEach((marker) => map.removeLayer(marker));
      markers = [];
    }

    function addMapPin(coords, color, title) {
      const icon = L.divIcon({
        className: "",
        html: `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='${color}' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z'/><circle cx='12' cy='10' r='3'/></svg>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const marker = L.marker(coords, { icon }).addTo(map).bindPopup(title);
      markers.push(marker);
    }

    function updateMapPins(mode) {
      clearMapPins();
      const data = mode === "emotion" ? emotionMemoryData : placeTagMemoryData;
      data.forEach((memory) => addMapPin(memory.location, memory.color, memory.title));

      document.getElementById("placeFilters").style.display = mode === "place" ? "flex" : "none";
      document.getElementById("emotionFilters").style.display = mode === "emotion" ? "flex" : "none";
    }

    const modeToggle = document.getElementById("modeToggle");
    let currentMode = "place";
    updateMapPins(currentMode);

    if (modeToggle) {
      modeToggle.addEventListener("change", () => {
        currentMode = modeToggle.checked ? "emotion" : "place";
        updateMapPins(currentMode);
      });
    }

    return () => {
      map.remove();
    };
  }, []);

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

      {/* Main Content */}
      <div className="main-content">
        <header className="navbar">
          <p>Map My Memoir</p>
          <Link className="prof" to="/profile" title="Profile">
            <FaUser size={27} color="#5e412f" />
          </Link>
        </header>

        <div className="map-section">
          <div className="toggle-section">
            <span>Place Tags</span>
            <label className="switch">
              <input type="checkbox" id="modeToggle" />
              <span className="slider3"></span>
            </label>
            <span>Emotion Tags</span>
          </div>

          <div className="tag-filters" id="placeFilters">
            <label style={{ backgroundColor: "#90d7d8ff" }}>
              <input type="checkbox" name="place" value="beach" /> 🌊 Beach
            </label>
            <label style={{ backgroundColor: "#aeebaeff" }}>
              <input type="checkbox" name="place" value="mountain" /> ⛰️ Mountain
            </label>
            <label style={{ backgroundColor: "#fc9f9fff" }}>
              <input type="checkbox" name="place" value="city" /> 🏙️ City
            </label>
            <label style={{ backgroundColor: "#c38d75ff" }}>
              <input type="checkbox" name="place" value="village" /> 🏡 Village
            </label>
            <label style={{ backgroundColor: "#9fc69fff" }}>
              <input type="checkbox" name="place" value="forest" /> 🌲 Forest
            </label>
            <label style={{ backgroundColor: "#dab454ff" }}>
              <input type="checkbox" name="place" value="temple" /> 🛕 Temple
            </label>
          </div>

          <div className="tag-filters" id="emotionFilters">
            <label style={{ backgroundColor: "#FFD1DC" }}>
              <input type="checkbox" name="emotion" value="calm" /> 🧘 Calm
            </label>
            <label style={{ backgroundColor: "#CBAACB" }}>
              <input type="checkbox" name="emotion" value="nostalgic" /> 📻 Nostalgic
            </label>
            <label style={{ backgroundColor: "#B5EAD7" }}>
              <input type="checkbox" name="emotion" value="happy" /> 😄 Happy
            </label>
            <label style={{ backgroundColor: "#AEC6CF" }}>
              <input type="checkbox" name="emotion" value="sad" /> 😢 Sad
            </label>
            <label style={{ backgroundColor: "#ffff80" }}>
              <input type="checkbox" name="emotion" value="excited" /> 🤩 Excited
            </label>
          </div>

          <div className="map-container">
            <div id="map"></div>
          </div>
        </div>

        <footer>
          <p>© 2025 Map My Memoir. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default MapView;
