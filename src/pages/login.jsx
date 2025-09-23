import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { loginUser } from "../utils/auth";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import "../styles/login.css";

// Icons
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser, FaFolderOpen } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(); // sets localStorage key "loggedIn" to true
    navigate("/"); // redirects to homepage
  };
  useEffect(() => {
      document.title = "Map My Memoir - Login";
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
        {/* Top Navbar */}
        <header className="navbar">
          <p>Map My Memoir</p>
          <Link className="prof" to="/profile" title="Profile">
            <FaUser size={27} color="#5e412f" />
          </Link>
        </header>

        {/* Login Section */}
        <section className="login-section">
          <div className="login-card">
            <h2>Welcome Back</h2>
            <p className="subtitle">Log in to continue your journey</p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                required
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
              />

              <button type="submit" className="btn">Login</button>

              <p className="signup-link">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </form>
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

export default Login;
