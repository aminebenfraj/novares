import { apiRequest } from "./api";

const BASE_URL = "api/RunAtRateProduction";

// ✅ Get all RunAtRateProductions
export const getAllRunAtRateProduction = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single RunAtRateProduction by ID
export const getRunAtRateProductionById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new RunAtRateProduction
export const createRunAtRateProduction = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing RunAtRateProduction
export const updateRunAtRateProduction = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a RunAtRateProduction
export const deleteRunAtRateProduction = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
