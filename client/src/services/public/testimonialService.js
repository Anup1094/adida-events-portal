import API, { resolveAssetUrl } from "../api";

export { resolveAssetUrl };

export const getPublicTestimonials = async () => {
  const { data } = await API.get("/testimonials");
  const all = data?.testimonials || [];
  // The backend returns every testimonial (including admin-authored Drafts);
  // only Published ones belong on the public site.
  return all.filter((t) => t.status !== "Draft");
};
