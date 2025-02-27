import { apiRequest } from "./api"

const BASE_URL = "api/p_p_tuning"

// Get all P_P_Tuning records
export const getAllP_P_Tuning = () => {
  return apiRequest("GET", BASE_URL)
}

// Get a single P_P_Tuning by ID
export const getP_P_TuningById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`)
}

// Create a new P_P_Tuning
export const createP_P_Tuning = (data) => {
  return apiRequest("POST", BASE_URL, data)
}

// Update an existing P_P_Tuning
export const updateP_P_Tuning = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data)
}

// Delete a P_P_Tuning
export const deleteP_P_Tuning = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`)
}

