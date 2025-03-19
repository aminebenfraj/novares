import { apiRequest } from "../api";

const BASE_URL = "api/Training";

// ✅ Get all Trainings
export const getAllTraining = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single Training by ID
export const getTrainingById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new Training
export const createTraining = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing Training
export const updateTraining = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a Training
export const deleteTraining = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
