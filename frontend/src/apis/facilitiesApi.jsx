import { apiRequest } from "./api";

const BASE_URL = "api/facilities";

// ✅ Get all designs
export const getAllfacilities = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single design by ID
export const getfacilitiesById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new design
export const createfacilities = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing design
export const updatefacilities = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a design
export const deletefacilities = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
