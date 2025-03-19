import { apiRequest } from "../api";

const BASE_URL = "api/Safety";

// ✅ Get all Safetys
export const getAllSafety = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single Safety by ID
export const getSafetyById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new Safety
export const createSafety = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing Safety
export const updateSafety = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a Safety
export const deleteSafety = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
