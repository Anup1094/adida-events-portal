import API from "../api";

export const fetchServices = async () => {
  try {
    const { data } = await API.get("/services");
    return { success: true, services: data.services || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch services.",
    };
  }
};

export const createService = async (formData) => {
  try {
    const { data } = await API.post("/services", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, service: data.service };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create service.",
    };
  }
};

export const updateService = async (id, formData) => {
  try {
    const { data } = await API.put(`/services/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, service: data.service };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update service.",
    };
  }
};

export const deleteService = async (id) => {
  try {
    const { data } = await API.delete(`/services/${id}`);
    return { success: true, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete service.",
    };
  }
};

