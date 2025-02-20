import { apiRequest } from "../apis/api";

const API_URL = "api/okforlunch"

export const getOkForLunch = async () => {
  return apiRequest("GET", API_URL)
}

export const getOkForLunchById = async (id) => {
  return apiRequest("GET", `${API_URL}/${id}`)
}

export const createOkForLunch = async (data) => {
  return apiRequest("POST", API_URL, data, true)
}

export const deleteOkForLunch = async (id) => {
  return apiRequest("DELETE", `${API_URL}/${id}`)
}

// ✅ Update OkForLunch and Checkin
export const updateOkForLunch = async (id, data) => {
    console.log("Sending update request with data:", JSON.stringify(data, null, 2))
    const response = await apiRequest("PUT", `${API_URL}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    })
    console.log("Response from server:", JSON.stringify(response, null, 2))
    return response
  }
  
  

