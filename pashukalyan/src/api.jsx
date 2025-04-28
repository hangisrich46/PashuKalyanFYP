import axios from "axios";

const API_URL = "/api/payment/esewa";

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

    // Clear client-side storage
    localStorage.removeItem("userSession");
    localStorage.removeItem("donationCart");
    sessionStorage.removeItem("userSession");

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log("Logout completed, cookies and storage cleared");
    return response.data; // e.g., "User logged out successfully!"
  } catch (error) {
    console.error("Logout error:", error);

    // Even if API call fails, clear client-side data
    localStorage.removeItem("userSession");
    localStorage.removeItem("donationCart");
    sessionStorage.removeItem("userSession");

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
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

//----FOOD API ADMIN
// Get all food items
export const fetchAllFood = async () => {
  try {
    const response = await API.get('/food');
    return response;
  } catch (error) {
    console.error('Error fetching food items:', error);
    throw error;
  }
};

// Get food by ID
export const getFoodById = async (id) => {
  try {
    const response = await API.get(`/food/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching food item with id ${id}:`, error);
    throw error;
  }
};

// Add a new food item
export const addFood = async (foodData) => {
  try {
    const response = await API.post('/food', foodData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error adding food item:', error);
    throw error;
  }
};

// Update a food item
export const updateFood = async (id, foodData) => {
  try {
    const response = await API.put(`/food/${id}`, foodData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error(`Error updating food item with id ${id}:`, error);
    throw error;
  }
};

// Delete a food item
export const deleteFood = async (id) => {
  try {
    const response = await API.delete(`/food/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting food item with id ${id}:`, error);
    throw error;
  }
};

// ESewa API service
export const esewaApi = {
  // Initiate payment
  initiatePayment: async (cartData) => {
    try {
      // Use your API instance instead of axios directly
      const response = await API.post("/payment/esewa/initiate", cartData);
      return response.data;
    } catch (error) {
      console.error("ESewa payment initiation error:", error);
      throw error.response?.data || { success: false, message: "Failed to initiate payment" };
    }
  },
  
  // Verify payment
  verifyPayment: async (transactionUuid) => {
    try {
      const response = await API.get(`/payment/esewa/verify/${transactionUuid}`);
      return response.data;
    } catch (error) {
      console.error("ESewa payment verification error:", error);
      throw error.response?.data || { success: false, message: "Failed to verify payment" };
    }
  }
};

// ---------- DONATION APIs ----------

// Record a new donation
export const recordDonation = async (donationData) => {
  try {
    const response = await API.post("/donations/record", donationData);
    console.log("Donation recorded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error recording donation:", error);
    throw error.response?.data || { success: false, message: "Failed to record donation" };
  }
};

// Get all donations (admin feature)
export const getAllDonations = async () => {
  try {
    const response = await API.get("/donations");
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    throw error.response?.data || { success: false, message: "Failed to fetch donations" };
  }
};

// Get donation by ID
export const getDonationById = async (donationId) => {
  try {
    const response = await API.get(`/donations/id/${donationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donation with ID ${donationId}:`, error);
    throw error.response?.data || { success: false, message: "Failed to fetch donation" };
  }
};

// Get donations by user ID
export const getDonationsByUserId = async (userId) => {
  try {
    const response = await API.get(`/donations/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching donations for user ${userId}:`, error);
    throw error.response?.data || { success: false, message: "Failed to fetch user donations" };
  }
};

// Get donation invoice
export const getDonationInvoice = async (donationId) => {
  try {
    // Using window.open for direct download instead of axios
    window.open(`${API.defaults.baseURL}/donations/id/${donationId}/invoice`, '_blank');
    return { success: true, message: "Invoice download initiated" };
  } catch (error) {
    console.error(`Error downloading invoice for donation ${donationId}:`, error);
    throw { success: false, message: "Failed to download invoice" };
  }
};

export default API;