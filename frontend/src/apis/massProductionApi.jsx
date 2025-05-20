import { apiRequest } from "./api"

const BASE_URL = "api/massproduction"

// Get all mass productions with filtering and pagination
export const getAllMassProductions = async (params = {}) => {
  // Build query string with all parameters
  const queryParams = new URLSearchParams()

  // Add all parameters to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString())
    }
  })

  const queryString = queryParams.toString()
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL

  try {
    return await apiRequest("GET", url)
  } catch (error) {
    console.error("Error fetching mass productions:", error)
    throw error
  }
}

// Get filter options for dropdown menus
export const getFilterOptions = async (field) => {
  try {
    return await apiRequest("GET", `${BASE_URL}/filters/${field}`)
  } catch (error) {
    console.error(`Error fetching ${field} options:`, error)
    throw error
  }
}

// Get a single mass production by ID
export const getMassProductionById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`)
}

// Create a new mass production
export const createMassProduction = (data) => {
  return apiRequest("POST", `${BASE_URL}/create`, data)
}

// Update a mass production
export const updateMassProduction = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data)
}

// Delete a mass production
export const deleteMassProduction = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`)
}
