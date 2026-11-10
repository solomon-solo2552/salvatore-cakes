"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api, { setTokens, clearTokens } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    // Read from tab-isolated sessionStorage
    const token = typeof window !== "undefined" ? sessionStorage.getItem("access_token") : null;
    
    if (!token) {
      setUser(null);
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

  const login = async (email, password) => {
    const res = await api.post("/accounts/login/", { 
      username: email, 
      password: password 
    });
    
    const accessToken = res.data.access;
    
    // Save tokens into this specific tab's sessionStorage
    setTokens(accessToken, res.data.refresh);
    
    // Fetch fresh profile immediately using explicit Bearer token header
    try {
      const meRes = await api.get("/accounts/me/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(meRes.data);
      return meRes.data; // 👈 Returns full user object directly
    } catch (err) {
      const fallbackUser = res.data.user || null;
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const register = async (formData) => {
    const res = await api.post("/accounts/register/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.access) {
      setTokens(res.data.access, res.data.refresh);
    }
    setUser(res.data.user || res.data);
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