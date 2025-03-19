import { apiRequest } from "../api";

const BASE_URL = "api/Packaging";

// ✅ Get all Packagings
export const getAllPackaging = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single Packaging by ID
export const getPackagingById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new Packaging
export const createPackaging = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing Packaging
export const updatePackaging = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a Packaging
export const deletePackaging = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
