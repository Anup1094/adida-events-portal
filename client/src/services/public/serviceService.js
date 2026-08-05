import API, { resolveAssetUrl } from "../api";

export { resolveAssetUrl };

export const getPublicServices = async () => {
  const { data } = await API.get("/services");
  return data?.services || [];
};
