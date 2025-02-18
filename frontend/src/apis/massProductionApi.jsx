import { apiRequest } from "./api";

const BASE_URL = "api/massProduction"; // ✅ FIX: Capitalized "P" to match backend route

// ✅ Get all mass productions
export const getAllMassProductions = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single mass production by ID
export const getMassProductionById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new mass production
export const createMassProduction = (data) => {
  return apiRequest("POST", `${BASE_URL}/create`, data); // ✅ FIX: Added `/create`
};

// ✅ Update a mass production
export const updateMassProduction = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a mass production
export const deleteMassProduction = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
