import { apiRequest } from "./api";

const BASE_URL = "api/Suppliers";

// ✅ Get all Supplierss
export const getAllSuppliers = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single Suppliers by ID
export const getSuppliersById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new Suppliers
export const createSuppliers = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing Suppliers
export const updateSuppliers = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a Suppliers
export const deleteSuppliers = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
