import axios from "axios";

const API_URL = "http://localhost:5000/api/services";

export const getPublicServices = async () => {
  const { data } = await axios.get(API_URL);
  return data.services;
};

export const resolveAssetUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  return `http://localhost:5000${path}`;
};