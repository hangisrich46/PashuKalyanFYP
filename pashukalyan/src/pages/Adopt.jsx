"use client"

import { useState, useEffect } from "react"
import { fetchAllAnimals, checkSession } from "../api"
import API from "../api" // Import default export separately

const Adopt = () => {
  // State for the list of animals
  const [animals, setAnimals] = useState([])
  // State for confirmation dialog
  const [showConfirmation, setShowConfirmation] = useState(false)
  // State to track which animal is being adopted
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  // State for auth error message
  const [authError, setAuthError] = useState("")
  // State for user session
  const [userSession, setUserSession] = useState(null)

  // Fetch user session and animals data when component mounts
  useEffect(() => {
    const getUserSession = async () => {
      try {
        const sessionData = await checkSession()
        // Extract email from the response string
        // Assuming response is in format "User is authenticated: email@example.com"
        if (sessionData && typeof sessionData === "string") {
          const email = sessionData.split(": ")[1]
          setUserSession({ email })
        }
      } catch (error) {
        console.error("Not authenticated:", error)
        setUserSession(null)
      }
    }

    getUserSession()
  }, [])

  useEffect(() => {
    const getAnimals = async () => {
      try {
        const fetchedAnimals = await fetchAllAnimals()
        // Extract the relevant data (name, type, age, gender, status, description, imageUrl)
        const filteredAnimals = fetchedAnimals.data.map((animal) => ({
          id: animal.id,
          name: animal.name,
          type: animal.type,
          age: animal.age,
          gender: animal.gender,
          status: animal.status,
          description: animal.description,
          imageUrl: animal.imageUrl,
        }))
        setAnimals(filteredAnimals)
      } catch (error) {
        console.error("Failed to fetch animals:", error)
      }
    }

    getAnimals()
  }, [])

  // Handle adopt button click
  const handleAdoptClick = (animal) => {
    if (!userSession) {
      setAuthError("You must be logged in to adopt a pet")
      // Clear error after 3 seconds
      setTimeout(() => setAuthError(""), 3000)

      return
    }

    setSelectedAnimal(animal)
    setShowConfirmation(true)
  }

// Handle confirmation
const handleConfirmAdoption = async () => {
  try {
    // Make API call to backend to register adoption application
    const response = await API.post("/adoption-applications", {
      animalId: selectedAnimal.id
    });

    if (response.data && response.data.success) {
      // Update UI accordingly (e.g., change animal status or show success message)
      const updatedAnimals = animals.map(animal => 
        animal.id === selectedAnimal.id 
          ? { ...animal, status: "Application Pending" } 
          : animal
      );
      setAnimals(updatedAnimals);
      
      // Show success message
      // You might want to add a state for success message
    } else {
      console.error("Failed to submit adoption application:", response.data.message);
    }
  } catch (error) {
    console.error("Error submitting adoption application:", error.response?.data?.message || error.message);
  } finally {
    // Close confirmation dialog
    setShowConfirmation(false);
    setSelectedAnimal(null);
  }
};

  // Close confirmation dialog
  const handleCancelAdoption = () => {
    setShowConfirmation(false)
    setSelectedAnimal(null)
  }

  // Handle click outside popover to close it
  const handleOutsideClick = (e) => {
    if (showConfirmation && !e.target.closest(".adoption-popover")) {
      setShowConfirmation(false)
      setSelectedAnimal(null)
    }
  }

  // Add event listener for outside clicks
  useEffect(() => {
    if (showConfirmation) {
      document.addEventListener("mousedown", handleOutsideClick)
    } else {
      document.removeEventListener("mousedown", handleOutsideClick)
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [showConfirmation])

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-black mb-8">Adopt a Pet</h1>

        {/* Auth Error Message */}
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{authError}</div>
        )}

        {/* Animals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.length > 0 ? (
            animals.map((animal) => (
              <div key={animal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={`http://localhost:8080${animal.imageUrl}` || "/placeholder.svg"}
                  alt={animal.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-black">{animal.name}</h3>
                    <span className="bg-gray-100 text-black text-sm px-2 py-1 rounded">{animal.type}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mb-2">
                    <span>{animal.age}</span>
                    <span>{animal.gender}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{animal.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {animal.status && (
                      <span
                        className={`${
                          animal.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        } text-xs px-2 py-1 rounded-full`}
                      >
                        {animal.status}
                      </span>
                    )}
                  </div>
                  <button
                    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
                    onClick={() => handleAdoptClick(animal)}
                    disabled={animal.status === "Adopted" || animal.status === "Application Pending"}
                  >
                    {animal.status === "Adopted"
                      ? "Already Adopted"
                      : animal.status === "Application Pending"
                        ? "Application Pending"
                        : "Adopt Me"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 col-span-3">
              <p className="text-gray-600 text-lg">No animals available for adoption yet.</p>
            </div>
          )}
        </div>

        {/* Confirmation Popover */}
        {showConfirmation && selectedAnimal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="adoption-popover bg-white rounded-lg shadow-lg p-5 w-[400px] border border-gray-200">
              <h2 className="text-xl font-bold mb-3">Confirm Adoption</h2>
              <p className="mb-4">Are you sure you want to apply to adopt {selectedAnimal.name}?</p>
              <div className="flex gap-3 justify-end">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={handleCancelAdoption}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                  onClick={handleConfirmAdoption}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Adopt
