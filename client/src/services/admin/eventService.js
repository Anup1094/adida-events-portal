import API from "../api";

// ================= GET ALL EVENTS =================

export const getEvents = async () => {
  const { data } = await API.get("/events");
  return data;
};

// ================= GET SINGLE EVENT =================

export const getEvent = async (id) => {
  const { data } = await API.get(`/events/${id}`);
  return data;
};

// ================= CREATE EVENT =================

export const createEvent = async (formData) => {
  const { data } = await API.post("/events", formData);

  return data;
};

// ================= UPDATE EVENT =================

export const updateEvent = async (id, formData) => {
  const { data } = await API.put(`/events/${id}`, formData);

  return data;
};

// ================= DELETE EVENT =================

export const deleteEvent = async (id) => {
  const { data } = await API.delete(`/events/${id}`);
  return data;
};