import { apiRequest } from "./api";

const BASE_URL = "api/ToolingStatus";

// ✅ Get all ToolingStatuss
export const getAllToolingStatus = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single ToolingStatus by ID
export const getToolingStatusById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new ToolingStatus
export const createToolingStatus = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing ToolingStatus
export const updateToolingStatus = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a ToolingStatus
export const deleteToolingStatus = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
