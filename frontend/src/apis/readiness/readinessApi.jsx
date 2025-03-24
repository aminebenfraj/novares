import { apiRequest } from "../api"

// Get all readiness entries with error handling for population issues
export const getAllReadiness = async () => {
  try {
    // First try with the normal populate approach
    return await apiRequest("GET", "api/readiness")
  } catch (error) {
    // If we get a population error, try again with strictPopulate set to false
    if (error.response?.status === 500 && error.response?.data?.error?.includes("strictPopulate")) {
      console.warn("Using fallback method for fetching readiness entries")
      return await apiRequest("GET", "api/readiness?strictPopulate=false")
    }
    // If it's another error, rethrow it
    throw error
  }
}

// Get a single readiness entry by ID with error handling
export const getReadinessById = async (id) => {
  try {
    // First try with the normal populate approach
    return await apiRequest("GET", `api/readiness/${id}`)
  } catch (error) {
    // If we get a population error, try again with strictPopulate set to false
    if (error.response?.status === 500 && error.response?.data?.error?.includes("strictPopulate")) {
      console.warn("Using fallback method for fetching readiness entry")
      return await apiRequest("GET", `api/readiness/${id}?strictPopulate=false`)
    }
    // If it's another error, rethrow it
    throw error
  }
}

// Create a new readiness entry
export const createReadiness = async (data) => {
  return await apiRequest("POST", "/api/readiness", data)
}

// Update a readiness entry
export const updateReadiness = async (id, data) => {
  return await apiRequest("PUT", `/api/readiness/${id}`, data)
}

// Delete a readiness entry
export const deleteReadiness = async (id) => {
  return await apiRequest("DELETE", `/api/readiness/${id}`)
}

