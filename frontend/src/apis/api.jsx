import axios from "axios";

export const apiRequest = async (
  method,
  url,
  data = null,
  isFormData = false
) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No access token found");
    }

    const config = {
      method,
      url: `http://192.168.1.187:5000/${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      data,
    };
    const response = await axios(config);
    
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
