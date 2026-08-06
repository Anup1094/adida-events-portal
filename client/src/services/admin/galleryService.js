import API from "../api";

// ================= GET ALL GALLERY IMAGES =================

export const getGallery = async () => {
  const { data } = await API.get("/gallery");
  return data;
};

export const fetchGalleryImages = async () => {
  try {
    const { data } = await API.get("/gallery");
    return {
      success: true,
      images: data.images || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch gallery images.",
    };
  }
};

// ================= GET SINGLE IMAGE =================

export const getGalleryImage = async (id) => {
  const { data } = await API.get(`/gallery/${id}`);
  return data;
};

// ================= CREATE IMAGE =================

export const createGalleryImage = async (formData) => {
  const { data } = await API.post("/gallery", formData);

  return data;
};

export const uploadGalleryImage = async (formData) => {
  try {
    const { data } = await API.post("/gallery", formData);
    return {
      success: true,
      image: data.image,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to upload image.",
    };
  }
};

// ================= UPDATE IMAGE =================

export const updateGalleryImage = async (id, formData) => {
  const { data } = await API.put(`/gallery/${id}`, formData);

  return data;
};

// ================= DELETE IMAGE =================

export const deleteGalleryImage = async (id) => {
  try {
    const { data } = await API.delete(`/gallery/${id}`);
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete image.",
    };
  }
};
