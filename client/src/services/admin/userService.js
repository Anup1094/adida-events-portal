import API from "../api";

export const fetchCustomers = async () => {
  try {
    const { data } = await API.get("/users");
    return { success: true, customers: data.customers || [] };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch customers.",
    };
  }
};

export const deleteCustomer = async (id) => {
  try {
    const { data } = await API.delete(`/users/${id}`);
    return { success: true, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to delete customer.",
    };
  }
};
