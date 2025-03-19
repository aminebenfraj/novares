import { apiRequest } from "../api";

const BASE_URL = "api/Validation";

// ✅ Get all Validations
export const getAllValidation = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single Validation by ID
export const getValidationById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new Validation
export const createValidation = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing Validation
export const updateValidation = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a Validation
export const deleteValidation = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
