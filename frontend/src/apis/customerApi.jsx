import { apiRequest } from "./api";

export const getAllCustomers = async () => {
  try {
    const response = await apiRequest("GET", "api/users/customers", null, {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    });

    console.log("🔍 API Response (Customers):", response); // ✅ Debugging

    if (!response || !Array.isArray(response)) {
      throw new Error("Invalid response format from API");
    }

    // ✅ Ensure every user has a `roles` field before filtering
    return response.filter((user) => user.roles && user.roles.includes("Customer"));
  } catch (error) {
    console.error("❌ Error fetching customers:", error);
    throw error;
  }
};
