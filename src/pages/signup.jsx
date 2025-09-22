import "../styles/signup.css";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import { Link } from "react-router-dom";

// Icons
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";
import { useEffect } from "react";

function Signup() {
  useEffect(() => {
      document.title = "Map My Memoir - Sign Up";
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

        {/* Sign-Up Form Section */}
        <section className="signup-section">
          <div className="signup-card">
            <h2>Create an Account</h2>
            <p className="subtitle">Start preserving your memories today</p>

            <form>
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                required
              />

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
                placeholder="Create a password"
                required
              />

              <label htmlFor="confirm-password">Confirm Password:</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Re-enter your password"
                required
              />

              <button type="submit" className="btn">Sign Up</button>

              <p className="login-link">
                Already have an account? <Link to="/login">Login</Link>
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

export default Signup;
