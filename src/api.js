// src/api.js
import axios from "axios";

const api = axios.create({
  // In development we use src/setupProxy.js (calls the external API).
  // In production on Vercel we default to the same-origin proxy at /api
  baseURL: process.env.REACT_APP_API_URL || '/api',
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// Helpful for debugging which base URL is used at runtime
console.log('API baseURL:', process.env.REACT_APP_API_URL || '/api');

// 🔁 Injecte automatiquement le token dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
