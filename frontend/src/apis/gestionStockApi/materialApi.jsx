import { apiRequest } from "../api"

const BASE_URL = "api/materials"

// Get all materials
export const getAllMaterials = () => {
  return apiRequest("GET", BASE_URL)
}

// Get a single material by ID
export const getMaterialById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`)
}

// Create a new material
export const createMaterial = (data) => {
  return apiRequest("POST", BASE_URL, data)
}

// Update an existing material
export const updateMaterial = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data)
}

// Delete a material
export const deleteMaterial = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`)
}

