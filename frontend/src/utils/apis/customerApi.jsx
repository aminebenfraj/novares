import { apiRequest } from "./api";

// ✅ Create a new customer
export const createCustomer = (data) => {
  return apiRequest("POST", "api/customers", data);
};

// ✅ Get all customers
export const getAllCustomers = () => {
  return apiRequest("GET", "api/customers");
};

// ✅ Get a single customer by ID
export const getCustomerById = (id) => {
  return apiRequest("GET", `api/customers/${id}`);
};

// ✅ Update a customer
export const updateCustomer = (id, updatedData) => {
  return apiRequest("PUT", `api/customers/${id}`, updatedData);
};

// ✅ Delete a customer
export const deleteCustomer = (id) => {
  return apiRequest("DELETE", `api/customers/${id}`);
};
