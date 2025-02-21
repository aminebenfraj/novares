import { apiRequest } from "./api";

const BASE_URL = "api/tasks";

// ✅ Get all tasks
export const getAllTasks = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single task by ID
export const getTaskById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new task
export const createTask = (data) => {
  return apiRequest("POST", BASE_URL, data, true); // ✅ FormData support
};

// ✅ Update a task
export const updateTask = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data, true);
};

// ✅ Delete a task
export const deleteTask = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
