import axios from "axios";

const API_BASE_URL = "https://profound-serenity-production-c5d8.up.railway.app";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Shared helper for resolving uploaded-file paths (e.g. "/uploads/x.jpg")
// returned by the backend into full URLs against the same origin the API
// client is configured for, without hardcoding that origin in every file.
export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const resolveAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSET_BASE_URL}${path}`;
};

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;