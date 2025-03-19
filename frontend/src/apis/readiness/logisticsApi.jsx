import { apiRequest } from "../api";

const BASE_URL = "api/Logistics";

// ✅ Get all Logisticss
export const getAllLogistics = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single Logistics by ID
export const getLogisticsById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new Logistics
export const createLogistics = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing Logistics
export const updateLogistics = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a Logistics
export const deleteLogistics = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
