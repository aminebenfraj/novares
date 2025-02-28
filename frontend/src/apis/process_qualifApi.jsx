import { apiRequest } from "./api";

const BASE_URL = "api/process_qualif";

// ✅ Get all process qualifications
export const getAllProcessQualifications = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single process qualification by ID
export const getProcessQualificationById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new process qualification
export const createQualificationProcess = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing process qualification
export const updateProcessQualification = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a process qualification
export const deleteProcessQualification = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
