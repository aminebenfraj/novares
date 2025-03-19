import { apiRequest } from "../api";

const BASE_URL = "api/ProductProcesses";

// ✅ Get all ProductProcessess
export const getAllProductProcesses = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single ProductProcesses by ID
export const getProductProcessesById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new ProductProcesses
export const createProductProcesses = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing ProductProcesses
export const updateProductProcesses = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a ProductProcesses
export const deleteProductProcesses = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
