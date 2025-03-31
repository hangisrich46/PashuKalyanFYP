"use client"

import { useState, useEffect } from "react"

const Adopt = () => {
  // State for the form
  const [formData, setFormData] = useState({
    name: "",
    type: "Dog",
    age: "",
    gender: "Male",
    description: "",
    image: null,
    vaccinated: false,
    neutered: false,
    trained: false,
  })

  // State for the list of animals
  const [animals, setAnimals] = useState([])

  // State for form visibility
  const [showForm, setShowForm] = useState(false)

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === "file") {
      // Handle file upload
      setFormData({
        ...formData,
        image: files[0] ? URL.createObjectURL(files[0]) : null,
      })
    } else if (type === "checkbox") {
      // Handle checkboxes
      setFormData({
        ...formData,
        [name]: checked,
      })
    } else {
      // Handle other inputs
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Create a new animal with the form data and a unique ID
    const newAnimal = {
      ...formData,
      id: Date.now(),
      image: formData.image || `https://placehold.co/300x200?text=${formData.name || "Pet"}`,
    }

    // Add the new animal to the list
    setAnimals([...animals, newAnimal])

    // Reset the form
    setFormData({
      name: "",
      type: "Dog",
      age: "",
      gender: "Male",
      description: "",
      image: null,
      vaccinated: false,
      neutered: false,
      trained: false,
    })

    // Hide the form after submission
    setShowForm(false)
  }

  // Sample animals data for initial display
  useEffect(() => {
    const sampleAnimals = [
      {
        id: 1,
        name: "Buddy",
        type: "Dog",
        age: "2 years",
        gender: "Male",
        description: "Friendly and energetic dog who loves to play fetch.",
        image: "https://placehold.co/300x200?text=Buddy",
        vaccinated: true,
        neutered: true,
        trained: true,
      },
      {
        id: 2,
        name: "Luna",
        type: "Dog",
        age: "1 year",
        gender: "Female",
        description: "Sweet and gentle dog who enjoys cuddles.",
        image: "https://placehold.co/300x200?text=Luna",
        vaccinated: true,
        neutered: false,
        trained: true,
      },
      {
        id: 3,
        name: "Max",
        type: "Dog",
        age: "3 years",
        gender: "Male",
        description: "Playful and protective dog, good with children.",
        image: "https://placehold.co/300x200?text=Max",
        vaccinated: true,
        neutered: true,
        trained: false,
      },
    ]

    setAnimals(sampleAnimals)
  }, [])

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4 md:mb-0">Adopt a Pet</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            {showForm ? "Cancel" : "+ Add Animal"}
          </button>
        </div>

        {/* Add Animal Form */}
        {showForm && (
          <div className="bg-[#f0f0f0] p-6 rounded-md mb-8 shadow-md">
            <h2 className="text-2xl font-semibold text-black mb-4">Add New Animal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="text"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 2 years"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Preview"
                        className="h-32 w-auto object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                  ></textarea>
                </div>

                {/* Checkboxes */}
                <div className="md:col-span-2 flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="vaccinated"
                      name="vaccinated"
                      checked={formData.vaccinated}
                      onChange={handleChange}
                      className="h-4 w-4 text-black border-gray-300 rounded"
                    />
                    <label htmlFor="vaccinated" className="ml-2 text-sm text-gray-700">
                      Vaccinated
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="neutered"
                      name="neutered"
                      checked={formData.neutered}
                      onChange={handleChange}
                      className="h-4 w-4 text-black border-gray-300 rounded"
                    />
                    <label htmlFor="neutered" className="ml-2 text-sm text-gray-700">
                      Neutered/Spayed
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="trained"
                      name="trained"
                      checked={formData.trained}
                      onChange={handleChange}
                      className="h-4 w-4 text-black border-gray-300 rounded"
                    />
                    <label htmlFor="trained" className="ml-2 text-sm text-gray-700">
                      Trained
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  Add Animal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Animals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <div key={animal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={animal.image || "/placeholder.svg"} alt={animal.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-black">{animal.name}</h3>
                  <span className="bg-[#f0f0f0] text-black text-sm px-2 py-1 rounded">{animal.type}</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-2">
                  <span>{animal.age}</span>
                  <span>{animal.gender}</span>
                </div>
                <p className="text-gray-700 mb-4">{animal.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {animal.vaccinated && (
                    <span className="bg-[#e6f7e6] text-[#2e7d32] text-xs px-2 py-1 rounded-full">Vaccinated</span>
                  )}
                  {animal.neutered && (
                    <span className="bg-[#e6f7e6] text-[#2e7d32] text-xs px-2 py-1 rounded-full">Neutered/Spayed</span>
                  )}
                  {animal.trained && (
                    <span className="bg-[#e6f7e6] text-[#2e7d32] text-xs px-2 py-1 rounded-full">Trained</span>
                  )}
                </div>
                <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors">
                  Adopt Me
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {animals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No animals available for adoption yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Add Your First Animal
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Adopt

