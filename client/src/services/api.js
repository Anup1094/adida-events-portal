import axios from "axios";

const API_BASE_URL = "https://profound-serenity-production-c5d8.up.railway.app/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Shared helper for resolving uploaded-file paths
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