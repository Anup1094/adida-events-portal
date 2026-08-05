import API from "../api";

export const fetchTestimonials = async () => {
  try {
    const { data } = await API.get("/testimonials");
    return { success: true, testimonials: data.testimonials || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch testimonials.",
    };
  }
};

export const createTestimonial = async (formData) => {
  try {
    const { data } = await API.post("/testimonials", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, testimonial: data.testimonial };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create testimonial.",
    };
  }
};

export const updateTestimonial = async (id, formData) => {
  try {
    const { data } = await API.put(`/testimonials/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, testimonial: data.testimonial };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update testimonial.",
    };
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const { data } = await API.delete(`/testimonials/${id}`);
    return { success: true, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete testimonial.",
    };
  }
};

