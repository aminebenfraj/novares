import { apiRequest } from "../api";

const BASE_URL = "api/ProcessStatusIndustrials";

// ✅ Get all ProcessStatusIndustrialss
export const getAllProcessStatusIndustrials = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single ProcessStatusIndustrials by ID
export const getProcessStatusIndustrialsById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new ProcessStatusIndustrials
export const createProcessStatusIndustrials = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing ProcessStatusIndustrials
export const updateProcessStatusIndustrials = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a ProcessStatusIndustrials
export const deleteProcessStatusIndustrials = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
