import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const token = localStorage.getItem("weather_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("weather_token");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUser(); }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("weather_token", data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("weather_token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("weather_token");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}