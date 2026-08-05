import API from "../api";

export const fetchSettings = async () => {
  try {
    const { data } = await API.get("/settings");
    return { success: true, settings: data.settings };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch settings.",
    };
  }
};

export const saveSettings = async (payload) => {
  try {
    const { data } = await API.put("/settings", payload);
    return { success: true, settings: data.settings, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to save settings.",
    };
  }
};
