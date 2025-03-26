import axios from "axios"

const API_URL = "http://localhost:5000/api/call"

// Get all calls with optional filtering
export const getCalls = async (filters = {}) => {
  try {
    console.log("Fetching calls with filters:", filters)
    const response = await axios.get(API_URL, { params: filters })
    console.log("Calls API response:", response)

    let callsData = []

    if (response && response.data && Array.isArray(response.data)) {
      callsData = response.data
    } else if (Array.isArray(response)) {
      callsData = response
    }

    // Process calls to ensure they have remainingTime
    return callsData.map((call) => {
      if (call.status === "Pendiente" && !call.remainingTime) {
        // Calculate remaining time (90 minutes from call time)
        const callTime = new Date(call.callTime).getTime()
        const currentTime = new Date().getTime()
        const elapsedSeconds = Math.floor((currentTime - callTime) / 1000)
        const totalSeconds = 90 * 60 // 90 minutes in seconds
        const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)

        return {
          ...call,
          remainingTime: remainingSeconds,
        }
      }
      return call
    })
  } catch (error) {
    console.error("Error in getCalls:", error)
    return []
  }
}

// Create a new call
export const createCall = async (data) => {
  try {
    console.log("Creating call with data:", data)

    // Ensure the call has a remainingTime property set to 90 minutes
    const callData = {
      ...data,
      remainingTime: 90 * 60, // 90 minutes in seconds
    }

    const response = await axios.post(API_URL, callData)
    console.log("Create call response:", response)
    return response
  } catch (error) {
    console.error("Error in createCall:", error)
    throw error
  }
}

// Mark a call as completed
export const completeCall = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/complete`, {
      status: "Realizada",
      completionTime: new Date(),
    })
    return response
  } catch (error) {
    console.error("Error in completeCall:", error)
    throw error
  }
}

// Mark a call as failed (when timer reaches zero)
export const failCall = async (id) => {
  try {
    console.log("Marking call as failed:", id)
    const response = await axios.put(`${API_URL}/${id}`, {
      status: "Failed",
      remainingTime: 0,
    })
    return response
  } catch (error) {
    console.error("Error in failCall:", error)
    throw error
  }
}

// Export calls to CSV
export const exportCalls = async (filters = {}) => {
  try {
    const queryString = new URLSearchParams(filters).toString()
    window.open(`${API_URL}/export?${queryString}`, "_blank")
  } catch (error) {
    console.error("Error in exportCalls:", error)
    throw error
  }
}

// Format time for display
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
}

