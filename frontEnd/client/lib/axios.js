import axios from "axios";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const baseURL = apiBase.endsWith("/api")
  ? apiBase
  : apiBase.replace(/\/$/, "") + "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach Authorization header if token exists in localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("agrovision_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch { /* ignore */ }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default api;
