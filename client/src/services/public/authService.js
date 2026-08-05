import API from "../api";

export const registerCustomer = async ({ name, email, password, phone }) => {
  const { data } = await API.post("/auth/register", {
    name,
    email,
    password,
    phone,
  });
  return data;
};

export const loginCustomer = async ({ email, password }) => {
  const { data } = await API.post("/auth/login", { email, password });
  return data;
};

export const saveSession = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!raw || !token) return null;
    const user = JSON.parse(raw);
    return user?.role === "customer" ? user : null;
  } catch {
    return null;
  }
};

export const logoutCustomer = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
