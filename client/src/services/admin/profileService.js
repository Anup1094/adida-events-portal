import API from "../api";

export const fetchProfile = async () => {
  try {
    const { data } = await API.get("/auth/me");
    return { success: true, user: data.user };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to load profile.",
    };
  }
};

export const updateProfile = async (payload) => {
  try {
    const { data } = await API.put("/auth/me", payload);
    return { success: true, message: data.message, user: data.user };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update profile.",
    };
  }
};