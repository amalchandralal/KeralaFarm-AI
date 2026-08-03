import api from "../lib/axios";

// Auth Services
export const registerUser = async (data) => {
  const res = await api.post("/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/login", data);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/logout");
  return res.data;
};

// AI Services
export const detectDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  const res = await api.post("/detect-disease", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const askVoiceAssistant = async (question) => {
  const res = await api.post("/voice-assistant", { question });
  return res.data;
};

// Places Services
export const getPlaces = async (params = {}) => {
  const res = await api.get("/places", { params });
  return res.data;
};

export const searchPlaces = async (query) => {
  if (typeof query === 'string') {
    if (query.includes(',')) {
      const [lat, lon] = query.split(',').map(s => s.trim());
      const res = await api.get("/places", { params: { lat, lon } });
      return res.data?.places || res.data;
    }
    const res = await api.get("/places", { params: { city: query } });
    return res.data?.places || res.data;
  }
  const res = await api.get("/places", { params: query });
  return res.data?.places || res.data;
};

// Booking Services
export const createBooking = async (data) => {
  const res = await api.post("/bookings", data);
  return res.data;
};

export const getBookings = async () => {
  const res = await api.get("/bookings");
  return res.data;
};

// Dashboard / Weather Services
export const getDashboard = async (lat, lon) => {
  const params = lat && lon ? `?lat=${lat}&lon=${lon}` : "";
  const res = await api.get(`/dashboard${params}`);
  return res.data;
};

export const getAQI = async (lat, lon) => {
  const params = lat && lon ? `?lat=${lat}&lon=${lon}` : "";
  const res = await api.get(`/aqi${params}`);
  return res.data;
};

export const getHourlyForecast = async (lat, lon) => {
  const params = lat && lon ? `?lat=${lat}&lon=${lon}` : "";
  const res = await api.get(`/forecast/hourly${params}`);
  return res.data;
};

export const getNotifications = async (lat, lon) => {
  const params = lat && lon ? `?lat=${lat}&lon=${lon}` : "";
  const res = await api.get(`/notifications${params}`);
  return res.data;
};

// Resource Tracker Services
export const getInputEntries = async () => {
  const res = await api.get("/input-entries");
  return res.data;
};

export const createInputEntry = async (data) => {
  const res = await api.post("/input-entries", data);
  return res.data;
};

export const deleteInputEntry = async (id) => {
  const res = await api.delete(`/input-entries/${id}`);
  return res.data;
};

export const getMarketPrices = async (state = "Keralam") => {
  const res = await api.get(`/market-prices?state=${encodeURIComponent(state)}`);
  return res.data;
};
