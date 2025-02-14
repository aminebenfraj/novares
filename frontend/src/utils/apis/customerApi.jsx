import { apiRequest } from "./api"

export const getAllCustomers = async () => {
  try {
    const response = await apiRequest("GET", "api/users")
    // Filter customers to include only users with the Customer role
    return response.filter((user) => user.roles.includes("Customer"))
  } catch (error) {
    console.error("Error fetching customers:", error)
    throw error
  }
}

