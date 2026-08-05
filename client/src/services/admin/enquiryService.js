import API from "../api";

export const fetchEnquiries = async () => {
  try {
    const { data } = await API.get("/contact");
    return { success: true, enquiries: data.enquiries || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch enquiries.",
    };
  }
};

export const deleteEnquiry = async (id) => {
  try {
    const { data } = await API.delete(`/contact/${id}`);
    return { success: true, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete enquiry.",
    };
  }
};

export const updateEnquiryStatus = async (id, status) => {
  try {
    const { data } = await API.patch(`/contact/${id}/status`, { status });
    return { success: true, enquiry: data.enquiry, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update status.",
    };
  }
};

