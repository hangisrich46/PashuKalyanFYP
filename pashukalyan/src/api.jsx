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

export const logoutUser = async () => {
  try {
    // Call the backend logout endpoint
    const response = await API.post("/logout");
    
    // Also clear localStorage and any client-side data
    localStorage.removeItem("userSession");
    sessionStorage.removeItem("userSession");
    
    // Force clear cookies on the client side as well
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    console.log("Logout completed, cookies and storage cleared");
    return response.data; // "User logged out successfully!"
  } catch (error) {
    console.error("Logout error:", error);
    
    // Even if the API call fails, still try to clear client-side data
    localStorage.removeItem("userSession");
    sessionStorage.removeItem("userSession");
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    throw error.response?.data || "Logout failed!";
  }
};

// ---------- ANIMAL APIs ----------

// Get all animals
export const fetchAllAnimals = async () => {
  try {
    const response = await API.get("/animals");
    return response.data; // { success: true, data: [...], count: n }
  } catch (error) {
    throw error.response?.data || "Failed to fetch animals";
  }
};

// Get single animal by ID
export const fetchAnimalById = async (id) => {
  try {
    const response = await API.get(`/animals/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch animal";
  }
};

// Create new animal with image
export const createAnimal = async (formData) => {
  try {
    const response = await API.post("/animals", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to create animal";
  }
};

// Update existing animal
export const updateAnimal = async (id, formData) => {
  try {
    const response = await API.put(`/animals/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to update animal";
  }
};

// Delete animal
export const deleteAnimal = async (id) => {
  try {
    const response = await API.delete(`/animals/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to delete animal";
  }
};


export default API;
