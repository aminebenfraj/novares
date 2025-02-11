import axios from "axios";

// Base API URL for scalability
const API_URL = "http://localhost:5000/api/auth";

// 🔹 Login function
export const login = async (lisence, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      lisence,  // Changed from email to lisence for authentication
      password,
    });

    // Store token securely
    localStorage.setItem("accessToken", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);

    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error("An error occurred during login");
    }
  }
};

// 🔹 Register function
export const register = async (lisence, username, email, password, role = "user") => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      lisence,
      username,
      email,
      password,
      role,
    });

    return response.data;
  } catch (error) {
    console.error("Register error:", error);

    if (error.response) {
      throw new Error(error.response.data.message || "Registration failed");
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error("An error occurred during registration");
    }
  }
};

// 🔹 Fetch current user details
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return null;
  }
};

// 🔹 Logout function
export const logout = () => {
  localStorage.removeItem("accessToken");
};
