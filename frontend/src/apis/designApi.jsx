import { apiRequest } from "./api";

const BASE_URL = "api/design";

// ✅ Get all designs
export const getAllDesigns = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single design by ID
export const getDesignById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new design
export const createDesign = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing design
export const updateDesign = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a design
export const deleteDesign = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
