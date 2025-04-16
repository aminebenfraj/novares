import { apiRequest } from "../apis/api";

const API_URL = "api/okforlunch"

export const getOkForLunch = async () => {
  return apiRequest("GET", API_URL)
}

export const getOkForLunchById = async (id) => {
  return apiRequest("GET", `${API_URL}/${id}`)
}
// Add this function to your okForLunch.js API file

export const createOkForLunch = async (formData) => {
  try {
    // If checkin is a JSON string in the FormData, the backend will handle it
    const response = await apiRequest("post",API_URL, formData, true)
    return response
  } catch (error) {
    console.error("API Request Error:", error)
    throw error
  }
}


export const deleteOkForLunch = async (id) => {
  return apiRequest("DELETE", `${API_URL}/${id}`)
}

// ✅ Update OkForLunch and Checkin
export const updateOkForLunch = async (id, data) => {
  // Log the data being sent to the API for debugging
  console.log("Sending update request with data:", JSON.stringify(data, null, 2))
  
  // Ensure checkin data is properly structured for update
  if (data.checkin) {
    // Make sure checkin is passed as an object, not an array or other type
    console.log("Checkin data being sent for update:", JSON.stringify(data.checkin, null, 2))
  }
  
  const response = await apiRequest("PUT", `${API_URL}/${id}`, data, true)
  console.log("Response from server:", JSON.stringify(response, null, 2))
  return response
}
