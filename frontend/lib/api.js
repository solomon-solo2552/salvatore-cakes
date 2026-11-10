import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  // 🔑 TAB ISOLATION: Read token strictly from the current tab's sessionStorage
  let token = null;
  if (typeof window !== "undefined") {
    token = sessionStorage.getItem("access_token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setTokens = (access, refresh) => {
  // Save exclusively to sessionStorage so each tab maintains a separate session
  if (typeof window !== "undefined") {
    sessionStorage.setItem("access_token", access);
    if (refresh) sessionStorage.setItem("refresh_token", refresh);
  }
};

export const clearTokens = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
  }
};

export default api;