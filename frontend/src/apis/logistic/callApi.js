import { apiRequest } from "../api"

const BASE_URL = "api/call"

// Get all calls with optional filtering
export const getCalls = async (filters = {}) => {
  try {
    console.log("Fetching calls with filters:", filters)
    const calls = await apiRequest("GET", BASE_URL, null, false, filters)

    // Process calls to ensure they have remainingTime
    if (Array.isArray(calls)) {
      return calls.map((call) => {
        // Always recalculate remaining time for pending calls
        if (call.status === "Pendiente") {
          try {
            // Ensure callTime is a valid date
            const callTime = new Date(call.callTime).getTime()

            // Check if callTime is valid
            if (isNaN(callTime)) {
              console.error("Invalid callTime for call:", call)
              return {
                ...call,
                remainingTime: 0,
              }
            }

            const currentTime = new Date().getTime()
            const elapsedSeconds = Math.floor((currentTime - callTime) / 1000)
            const totalSeconds = 90 * 60 // 90 minutes in seconds
            const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)

            return {
              ...call,
              remainingTime: remainingSeconds,
            }
          } catch (error) {
            console.error("Error calculating remaining time:", error, call)
            return {
              ...call,
              remainingTime: 0,
            }
          }
        } else {
          // For completed or expired calls, set remainingTime to 0
          return {
            ...call,
            remainingTime: 0,
          }
        }
      })
    }

    return calls || []
  } catch (error) {
    console.error("Error in getCalls:", error)
    return []
  }
}

// Create a new call
export const createCall = async (data) => {
  try {
    console.log("Creating call with data:", data)

    // Ensure the call has the correct data structure
    const callData = {
      ...data,
      callTime: new Date(), // Ensure we have a valid date
      date: new Date(),
      status: "Pendiente",
    }

    const response = await apiRequest("POST", BASE_URL, callData)

    // Ensure the response has a valid remainingTime
    if (response) {
      // Calculate remaining time based on callTime
      try {
        const callTime = new Date(response.callTime || new Date()).getTime()
        const currentTime = new Date().getTime()
        const elapsedSeconds = Math.floor((currentTime - callTime) / 1000)
        const totalSeconds = 90 * 60 // 90 minutes in seconds
        const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)

        return {
          ...response,
          remainingTime: remainingSeconds,
        }
      } catch (error) {
        console.error("Error calculating remaining time for new call:", error)
        return {
          ...response,
          remainingTime: 90 * 60, // Default to 90 minutes
        }
      }
    }

    return response
  } catch (error) {
    console.error("Error in createCall:", error)
    throw error
  }
}

// Mark a call as completed
export const completeCall = async (id, userRole = "LOGISTICA") => {
  try {
    console.log(`Completing call ${id} as ${userRole}...`)

    // Include the user role in the request to ensure proper authorization
    return apiRequest("PUT", `${BASE_URL}/${id}/complete`, {
      status: "Realizada",
      completionTime: new Date(),
      userRole: userRole, // Send the user role for authorization
    })
  } catch (error) {
    console.error("Error in completeCall:", error)
    throw error
  }
}

// Check for expired calls manually
export const checkExpiredCalls = async () => {
  try {
    return apiRequest("POST", `${BASE_URL}/check-expired`)
  } catch (error) {
    console.error("Error in checkExpiredCalls:", error)
    throw error
  }
}

// Export calls to CSV
export const exportCalls = async (filters = {}) => {
  try {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      throw new Error("No access token found")
    }

    const queryString = new URLSearchParams(filters).toString()
    window.open(`http://localhost:5000/${BASE_URL}/export?${queryString}&token=${token}`, "_blank")
  } catch (error) {
    console.error("Error in exportCalls:", error)
    throw error
  }
}

// Delete a call
export const deleteCall = async (id) => {
  try {
    console.log(`Deleting call with ID: ${id}`)
    return apiRequest("DELETE", `${BASE_URL}/${id}`)
  } catch (error) {
    console.error("Error in deleteCall:", error)
    throw error
  }
}

// Format time for display
export const formatTime = (seconds) => {
  // Handle invalid input
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    console.warn("Invalid seconds value in formatTime:", seconds)
    return "0:00"
  }

  // Convert to integer to be safe
  const secs = Math.floor(Number(seconds))
  const minutes = Math.floor(secs / 60)
  const remainingSeconds = secs % 60
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
}

// Format time with hours for longer durations
export const formatTimeWithHours = (seconds) => {
  // Handle invalid input
  if (seconds === null || seconds === undefined || isNaN(seconds)) {
    console.warn("Invalid seconds value in formatTimeWithHours:", seconds)
    return "00:00:00"
  }

  // Convert to integer to be safe
  const secs = Math.floor(Number(seconds))
  const hours = Math.floor(secs / 3600)
  const minutes = Math.floor((secs % 3600) / 60)
  const remainingSecs = secs % 60
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`
}

// Calculate progress percentage (for progress bars)
export const calculateProgress = (remainingTime) => {
  // Handle invalid input
  if (remainingTime === null || remainingTime === undefined || isNaN(remainingTime)) {
    console.warn("Invalid remainingTime in calculateProgress:", remainingTime)
    return 0
  }

  const totalTime = 90 * 60 // 90 minutes in seconds
  return Math.max(0, Math.min(100, (Number(remainingTime) / totalTime) * 100))
}
