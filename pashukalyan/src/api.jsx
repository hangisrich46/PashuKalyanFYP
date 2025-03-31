import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // Your backend URL
  withCredentials: true, // Important for session management (sends cookies)
});

// Login Request
export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/login", { email, password });
    return response.data; // "Login successful!"
  } catch (error) {
    throw error.response?.data || "Login failed!";
  }
};

// Check Session
export const checkSession = async () => {
  try {
    const response = await API.get("/check-session");
    return response.data; // "User is authenticated: email@example.com"
  } catch (error) {
    throw error.response?.data || "User not authenticated";
  }
};

// Logout Request
export const logoutUser = async () => {
  try {
    const response = await API.post("/logout");
    return response.data; // "User logged out successfully!"
  } catch (error) {
    throw error.response?.data || "Logout failed!";
  }
};

export default API;
