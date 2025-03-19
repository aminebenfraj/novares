// readinessApi.js
import { apiRequest } from "../api";

const BASE_URL = "api/Readiness";

export const getAllReadiness = (params) => {
  return apiRequest("GET", BASE_URL, null, params);
};

export const getReadinessById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

export const createReadiness = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

export const updateReadiness = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

export const deleteReadiness = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};