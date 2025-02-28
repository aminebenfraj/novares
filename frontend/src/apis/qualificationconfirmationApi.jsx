import { apiRequest } from "./api"

const BASE_URL = "api/qualification_confirmation"

// Get all Qualification Confirmations
export const getAllQualificationConfirmations = () => {
  return apiRequest("GET", BASE_URL)
}

// Get a single Qualification Confirmation by ID
export const getQualificationConfirmationById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`)
}

// Create a new Qualification Confirmation
export const createQualificationConfirmation = (data) => {
  return apiRequest("POST", BASE_URL, data)
}

// Update an existing Qualification Confirmation
export const updateQualificationConfirmation = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data)
}

// Delete a Qualification Confirmation
export const deleteQualificationConfirmation = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`)
}

