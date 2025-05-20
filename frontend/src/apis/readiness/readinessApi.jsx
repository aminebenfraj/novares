import { apiRequest } from "../api"

// Get all readiness entries with filtering, pagination, and search
export const getAllReadiness = async (params = {}) => {
  try {
    // Build query string with all parameters
    const queryParams = new URLSearchParams()

    // Add all parameters to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString())
      }
    })

    const queryString = queryParams.toString()
    const url = queryString ? `api/readiness?${queryString}` : "api/readiness"

    const response = await apiRequest("GET", url)
    return response
  } catch (error) {
    console.error("Error in getAllReadiness:", error)
    throw error
  }
}

// Get filter options for dropdown menus
export const getFilterOptions = async (field) => {
  try {
    return await apiRequest("GET", `api/readiness/filters/${field}`)
  } catch (error) {
    console.error(`Error fetching ${field} options:`, error)
    throw error
  }
}

// Get a single readiness entry by ID
export const getReadinessById = async (id) => {
  try {
    const response = await apiRequest("GET", `api/readiness/${id}`)
    return response
  } catch (error) {
    console.error("Error in getReadinessById:", error)
    throw error
  }
}

// Create a new readiness entry
export const createReadiness = async (data) => {
  try {
    return await apiRequest("POST", "api/readiness", data)
  } catch (error) {
    console.error("Error creating readiness entry:", error)
    throw error
  }
}

// Update a readiness entry
export const updateReadiness = async (id, data) => {
  try {
    return await apiRequest("PUT", `api/readiness/${id}`, data)
  } catch (error) {
    console.error("Error updating readiness entry:", error)
    throw error
  }
}

// Delete a readiness entry
export const deleteReadiness = async (id) => {
  try {
    return await apiRequest("DELETE", `api/readiness/${id}`)
  } catch (error) {
    console.error("Error deleting readiness entry:", error)
    throw error
  }
}
