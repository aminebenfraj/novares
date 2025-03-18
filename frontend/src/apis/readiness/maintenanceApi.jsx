import { apiRequest } from "./api";

const BASE_URL = "api/Maintenance";

// ✅ Get all Maintenances
export const getAllMaintenance = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single Maintenance by ID
export const getMaintenanceById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new Maintenance
export const createMaintenance = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing Maintenance
export const updateMaintenance = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a Maintenance
export const deleteMaintenance = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
