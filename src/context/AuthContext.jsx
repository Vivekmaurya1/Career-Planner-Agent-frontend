import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔁 Restore user on refresh */
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }

      try {
        const response = await axios.get("/api/auth/me");
        // Backend returns { id, username, email } — normalize to { name, email }
        setUser({ ...response.data, name: response.data.username });
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  /* 🔐 Login */
  const login = async (email, password) => {
    const response = await axios.post("/api/auth/login", { email, password });

    // ✅ Backend now returns { token: "..." }
    const token = response.data.token;
    localStorage.setItem("token", token);

    // ✅ Fetch and store the user immediately after login
    const meResponse = await axios.get("/api/auth/me");
    setUser({ ...meResponse.data, name: meResponse.data.username });
  };

  /* 📝 Register */
  const register = async (name, email, password) => {
    await axios.post("/api/auth/register", {
      username: name,
      email,
      password,
    });
    return { success: true };
  };

  /* 🚪 Logout */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);