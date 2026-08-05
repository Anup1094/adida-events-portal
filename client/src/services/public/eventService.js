import API, { resolveAssetUrl as resolveImageUrl } from "../api";

export { resolveImageUrl };

export const getPublicEvents = async () => {
  const { data } = await API.get("/events");
  return data?.events || [];
};
