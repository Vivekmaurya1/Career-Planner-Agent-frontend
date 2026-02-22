import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Landing from "./pages/landing";
import Generate from "./pages/generate";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import RoadmapPage from "./pages/RoadmapPage";
import RoadmapView from "./pages/Roadmapview";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="bg-[#0f172a] text-white min-h-screen">
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/roadmap/view" element={<RoadmapView />} />

          {/* Protected Routes */}
          <Route
            path="/generate"
            element={
              <PrivateRoute>
                <Generate />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/roadmap/:id"
            element={
              <PrivateRoute>
                <RoadmapPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}