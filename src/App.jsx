import { BrowserRouter, Routes, Route } from "react-router-dom";
import Project from "./pages/project";
import Profile from "./pages/profile";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Create from "./pages/create";
import ProtectedRoute from "./components/ProtectedRoute";
import MapView from "./pages/mymap";
import Explore from "./pages/explore";
import MemoryDetails from "./pages/memory";
import Vault from "./pages/vault";
import EditProfile from "./pages/editprofile";
import MemoryDetails1 from "./pages/vaultmemory";
import Favorites from "./pages/favorites";
import MemoryDetails3 from "./pages/favmemory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Project />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/memory/:id" element={<MemoryDetails />} /> {/* ✅ Memory route */}
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/vaultmemory/:id" element={<MemoryDetails1 />} />
        <Route path="/favmemory/:id" element={<MemoryDetails3 />} />
        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mymap"
          element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          }
        />

        {/* Optional fallback/test routes – delete if not needed */}
        <Route
          path="/vault"
          element={
            <ProtectedRoute>
              <Vault />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
