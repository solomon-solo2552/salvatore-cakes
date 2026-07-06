"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import api, { setTokens, clearTokens } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    const token = Cookies.get("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/accounts/me/");
      setUser(res.data);
    } catch (err) {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (username, password) => {
    const res = await api.post("/accounts/login/", { username, password });
    setTokens(res.data.access, res.data.refresh);
    await fetchMe();
  };

  const register = async (payload) => {
    const res = await api.post("/accounts/register/", payload);
    setTokens(res.data.access, res.data.refresh);
    setUser(res.data.user);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
