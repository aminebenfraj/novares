import { apiRequest } from "./api";

// ✅ Ensure correct export name
export const createPD = (data) => {
  return apiRequest("POST", "api/pd", data);
};


// 🔹 Get all productDesignation Designations
export const getAllpd = () => {
  return apiRequest("GET", "api/pd");
};

// 🔹 Get a single productDesignation Designation by ID
export const getPDById = (id) => {
  return apiRequest("GET", `api/pd/${id}`);
};

// 🔹 Update a productDesignation Designation
export const updatePD = (id, updatedData) => {
  return apiRequest("PUT", `api/pd/${id}`, updatedData);
};

// 🔹 Delete a productDesignation Designation
export const deletePD = (id) => {
  return apiRequest("DELETE", `api/pd/${id}`);
};
