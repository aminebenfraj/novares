import { apiRequest } from "./api";

const BASE_URL = "api/kickoff";

// ✅ Get all kick-offs
export const getAllKickOffs = () => {
  return apiRequest("GET", BASE_URL);
};

// ✅ Get a single kick-off by ID
export const getKickOffById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// ✅ Create a new kick-off
export const createKickOff = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// ✅ Update an existing kick-off
export const updateKickOff = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// ✅ Delete a kick-off
export const deleteKickOff = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};
