import API, { resolveAssetUrl } from "../api";

export { resolveAssetUrl };

export const getPublicGallery = async () => {
  const { data } = await API.get("/gallery");
  return data?.images || [];
};
