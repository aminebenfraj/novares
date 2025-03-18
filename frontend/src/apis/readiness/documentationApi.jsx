import { apiRequest } from "./api";

const BASE_URL = "api/Documentation";

// ✅ Get all Documentations
export const getAllDocumentation = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single Documentation by ID
export const getDocumentationById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new Documentation
export const createDocumentation = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing Documentation
export const updateDocumentation = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a Documentation
export const deleteDocumentation = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
