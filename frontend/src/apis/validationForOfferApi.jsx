import { apiRequest } from "../apis/api"

const API_URL = "api/validationforoffer" // ✅ Ensure correct API endpoint

// ✅ Get all ValidationForOffer entries
export const getValidationForOffers = async () => {
  return apiRequest("GET", API_URL)
}

// ✅ Get a single ValidationForOffer entry by ID
export const getValidationForOfferById = async (id) => {
  return apiRequest("GET", `${API_URL}/${id}`)
}

// ✅ Create a new ValidationForOffer entry

export const createValidationForOffer = async (formData) => {
  try {
    // If checkin is a JSON string in the FormData, the backend will handle it
    const response = await apiRequest("post", API_URL, formData, true)
    return response
  } catch (error) {
    console.error("API Request Error:", error)
    throw error
  }
}


// ✅ Update ValidationForOffer entry
export const updateValidationForOffer = async (id, data) => {
  console.log("Sending update request with data:", JSON.stringify(data, null, 2))
  const response = await apiRequest("PUT", `${API_URL}/${id}`, data, true)
  console.log("Response from server:", JSON.stringify(response, null, 2))
  return response
}

// ✅ Delete a ValidationForOffer entry
export const deleteValidationForOffer = async (id) => {
  return apiRequest("DELETE", `${API_URL}/${id}`)
}

