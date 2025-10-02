import { useContext, useEffect, useState } from "react";
import "../styles/vault.css";
import MemoryCard2 from "../components/MemoryCard2";
import logo from "../assets/Map_My_Memoir__1_-removebg-preview.png";
import { Link } from "react-router-dom";
import { FaHome, FaMapMarkedAlt, FaPlus, FaCompass, FaHeart, FaUser } from "react-icons/fa";
import { GiSecretBook } from "react-icons/gi";
import { supabase } from "../utils/supabaseClient";
import { MemoryContext } from "../context/MemoryContext";

function Vault() {
  const { memories: contextMemories, setMemories: setContextMemories } = useContext(MemoryContext);
  const [memories, setMemories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Map My Memoir - Vault";

    const fetchMemories = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) throw new Error("You must be logged in!");

        const userId = session.user.id;

        // Fetch all memories of this user (public + private)
        const { data, error } = await supabase
          .from("memories")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Map images to public URLs
        const memoriesWithImages = (data || []).map((memory) => {
          const images = (memory.images || []).map((img) => {
            return supabase.storage.from("memory-images").getPublicUrl(img).data.publicUrl;
          });
          return { ...memory, images };
        });

        setMemories(memoriesWithImages);
        if (setContextMemories) setContextMemories(memoriesWithImages);
      } catch (err) {
        console.error("Vault fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, [setContextMemories]);

  // Search filter using correct column names
  const filteredMemories = (memories || []).filter((memory) =>
    (memory.title + memory.geo_tag + memory.memory_story)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
          <Link className="prof" to="/profile" title="Profile">
            <FaUser size={27} color="#5e412f" />
          </Link>
        </header>

        <main style={{ flex: 1 }}>
          <div className="urs">
            <p>Your Journeys</p>
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "10px" }}
            />
          </div>

          {loading ? (
            <p>Loading memories...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <div className="memory-feed2" id="memoryFeed2">
              {filteredMemories.length > 0 ? (
                filteredMemories.map((memory) => (
                  <MemoryCard2 key={memory.id || memory._id} memory={memory} />
                ))
              ) : (
                <p>No memories found.</p>
              )}
            </div>
          )}
        </main>

        <footer className="foo1">
          <p>© 2025 Map My Memoir</p>
        </footer>
      </div>
    </div>
  );
}

export default Vault;
