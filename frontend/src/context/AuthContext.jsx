import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/profile")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", email);
      const res = await api.post("/auth/login", { email, password });
      console.log("Login response:", res.data);
      
      localStorage.setItem("token", res.data.token);

      // 🔑 FETCH USER AFTER LOGIN
      const profileRes = await api.get("/auth/profile");
      console.log("Profile response:", profileRes.data);
      
      setUser(profileRes.data.user);

      return profileRes.data.user;
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      console.error("Error config:", error.config);
      
      // Clear token if login failed
      localStorage.removeItem("token");
      setUser(null);
      
      // Throw a more descriptive error
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.code === "ECONNREFUSED") {
        throw new Error("Cannot connect to server. Please check if the backend is running.");
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Login failed. Please try again.");
      }
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    try {
      console.log("Attempting registration with:", { name, email });
      const res = await api.post("/auth/register", { name, email, password });
      console.log("Registration response:", res.data);
      
      // Note: Backend doesn't return token on register, user needs to login separately
      // For now, just return the user data without auto-login
      return res.data.user;
    } catch (error) {
      console.error("Register error:", error);
      console.error("Error response:", error.response);
      console.error("Error config:", error.config);
      
      // Throw a more descriptive error
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.code === "ECONNREFUSED") {
        throw new Error("Cannot connect to server. Please check if the backend is running.");
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isModerator: user?.role === "MODERATOR",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
