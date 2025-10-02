import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";

function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Styles
  const navStyle = {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#f0dbc8ff",
    gap: "15px",
    fontFamily: "Arial, sans-serif",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#5e412f",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 10px",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
  };

  const linkHoverStyle = {
    backgroundColor: "#e4c7ab",
  };

  const logoutStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#f8b4b4",
    color: "#5e412f",
    transition: "background-color 0.2s ease",
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = linkHoverStyle.backgroundColor;
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent";
  };

  const handleLogoutHover = (e) => {
    e.target.style.backgroundColor = "#f3a3a3";
  };

  const handleLogoutLeave = (e) => {
    e.target.style.backgroundColor = logoutStyle.backgroundColor;
  };

  return (
    <nav style={navStyle}>
      <Link
        to="/"
        style={linkStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Home
      </Link>

      {loggedIn ? (
        <>
          <Link
            to="/create"
            style={linkStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Create Memory
          </Link>
          <Link
            to="/profile"
            style={linkStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Profile
          </Link>
          <button
            style={logoutStyle}
            onClick={handleLogout}
            onMouseEnter={handleLogoutHover}
            onMouseLeave={handleLogoutLeave}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/signup"
            style={linkStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            style={linkStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Login
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
