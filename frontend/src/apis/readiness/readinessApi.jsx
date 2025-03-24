import { apiRequest } from "../api"

// Get all readiness entries with error handling for population issues
export const getAllReadiness = async () => {
  try {
    console.log("Calling getAllReadiness API")
    // First try with the normal populate approach
    const response = await apiRequest("GET", "api/readiness")
    console.log("getAllReadiness response:", response)
    return response
  } catch (error) {
    console.error("Error in getAllReadiness:", error)
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
    console.log(`Fetching readiness with ID: ${id}`)
    // First try with the normal populate approach
    const response = await apiRequest("GET", `api/readiness/${id}`)
    console.log("getReadinessById response:", response)

    // Check for empty or invalid response
    if (!response) {
      throw new Error("Empty response received from server")
    }

    // Check if we have the expected data structure
    const data = response.data || response
    if (!data.id || !data.project_name) {
      console.warn("Response missing expected fields:", data)
    }

    // Log the structure of the Supp field specifically
    if (data && data.Supp) {
      console.log("Supp field structure:", data.Supp)
    } else {
      console.warn("Supp field is missing or empty")
    }

    return response
  } catch (error) {
    console.error("Error in getReadinessById:", error)

    // Provide detailed error information
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    }

    // If we get a population error, try again with strictPopulate set to false
    if (error.response?.status === 500 && error.response?.data?.error?.includes("strictPopulate")) {
      console.warn("Using fallback method for fetching readiness entry")
      return await apiRequest("GET", `api/readiness/${id}?strictPopulate=false`)
    }

    // If it's another error, rethrow it with more context
    throw new Error(`Failed to fetch readiness entry: ${error.message}`)
  }
}

// Create a new readiness entry
export const createReadiness = async (data) => {
  try {
    console.log("Creating readiness entry with data:", data)
    return await apiRequest("POST", "api/readiness", data)
  } catch (error) {
    console.error("Error creating readiness entry:", error)
    throw new Error(`Failed to create readiness entry: ${error.message}`)
  }
}

// Update a readiness entry
export const updateReadiness = async (id, data) => {
  try {
    console.log(`Updating readiness entry ${id} with data:`, data)
    return await apiRequest("PUT", `api/readiness/${id}`, data)
  } catch (error) {
    console.error("Error updating readiness entry:", error)
    throw new Error(`Failed to update readiness entry: ${error.message}`)
  }
}

// Delete a readiness entry
export const deleteReadiness = async (id) => {
  try {
    console.log(`Deleting readiness entry ${id}`)
    return await apiRequest("DELETE", `api/readiness/${id}`)
  } catch (error) {
    console.error("Error deleting readiness entry:", error)
    throw new Error(`Failed to delete readiness entry: ${error.message}`)
  }
}

