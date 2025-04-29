"use client"

import { useState, useEffect } from "react"
import { checkSession, fetchAllFood, addFood, deleteFood } from "../api"
import { Link, useNavigate } from "react-router-dom"


const Donate = () => {
  // Initialize the navigate function
  const navigate = useNavigate();
  
  // State for the list of food items
  const [foodItems, setFoodItems] = useState([])
  // State for cart
  const [cart, setCart] = useState([])
  // State for auth error message
  const [authError, setAuthError] = useState("")
  // State for success message
  const [successMessage, setSuccessMessage] = useState("")
  // State for user session
  const [userSession, setUserSession] = useState(null)
  // State for quantities
  const [quantities, setQuantities] = useState({})
  // State for loading
  const [isLoading, setIsLoading] = useState(true)
  // State for search query
  const [searchQuery, setSearchQuery] = useState("")
  // State for search results
  const [searchResults, setSearchResults] = useState([])
  // State to track if search is active
  const [isSearchActive, setIsSearchActive] = useState(false)

  // Fetch user session and food items data when component mounts
  useEffect(() => {
    const getUserSession = async () => {
      try {
        const sessionData = await checkSession()
        // Extract email from the response string
        if (sessionData && typeof sessionData === "string") {
          const email = sessionData.split(": ")[1]
          setUserSession({ email })
        } else {
          // No valid session, clear the cart
          setUserSession(null)
          setCart([])
          localStorage.removeItem("donationCart")
        }
      } catch (error) {
        console.error("Not authenticated:", error)
        setUserSession(null)
        // Clear cart if not authenticated
        setCart([])
        localStorage.removeItem("donationCart")
      }
    }
  
    getUserSession()
  }, [])
  
  // Load saved cart from localStorage when component mounts
  useEffect(() => {
    const savedCartData = localStorage.getItem("donationCart");
    if (savedCartData && userSession) {
      try {
        const parsedData = JSON.parse(savedCartData);
        
        // Only load cart if it belongs to current user
        if (parsedData.userId === userSession.id) {
          setCart(parsedData.items);
          
          // Rebuild quantities
          const savedQuantities = {};
          parsedData.items.forEach(item => {
            savedQuantities[item.id] = item.quantity;
          });
          setQuantities(prev => ({...prev, ...savedQuantities}));
        } else {
          // Clear cart if it belongs to a different user
          localStorage.removeItem("donationCart");
        }
      } catch (error) {
        console.error("Error loading saved cart:", error);
      }
    }
  }, [userSession]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0 && userSession) {
      localStorage.setItem("donationCart", JSON.stringify({
        userId: userSession.id,
        items: cart
      }));
    } else if (cart.length === 0) {
      localStorage.removeItem("donationCart");
    }
  }, [cart, userSession]);
  
  useEffect(() => {
    const getFoodItems = async () => {
      setIsLoading(true)
      try {
        const response = await fetchAllFood();
        console.log("Food API response:", response);
        
        // Parse the data based on your API structure
        let items = [];
        if (response && response.data) {
          // Handle nested data structure if present
          const foodData = response.data.data || response.data;
          
          if (Array.isArray(foodData)) {
            items = foodData.map((item) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              imageUrl: item.imageUrl ? `http://localhost:8080${item.imageUrl}` : "/placeholder.svg?height=200&width=300",
            }));
          }
        }

        // Initialize quantities
        const initialQuantities = {}
        items.forEach((item) => {
          initialQuantities[item.id] = 1
        })
        
        setQuantities(prev => ({...prev, ...initialQuantities}))
        setFoodItems(items)
        console.log("Processed food items:", items);
      } catch (error) {
        console.error("Failed to fetch food items:", error)

        // Fallback data for development/preview
        const sampleItems = [
          {
            id: 1,
            name: "Premium Dog Food",
            description:
              "High-quality dog food with balanced nutrition for adult dogs. Contains essential vitamins and minerals.",
            price: 25.99,
            imageUrl: "/placeholder.svg?height=200&width=300&text=Dog+Food",
          },
          {
            id: 2,
            name: "Puppy Food",
            description:
              "Specially formulated for growing puppies. Rich in protein and calcium for healthy development.",
            price: 29.99,
            imageUrl: "/placeholder.svg?height=200&width=300&text=Puppy+Food",
          },
          {
            id: 3,
            name: "Cat Food",
            description: "Premium cat food with taurine and essential nutrients for healthy cats of all ages.",
            price: 22.99,
            imageUrl: "/placeholder.svg?height=200&width=300&text=Cat+Food",
          },
          {
            id: 4,
            name: "Bird Seed Mix",
            description: "Nutritious seed mix for small birds. Contains a variety of seeds and grains.",
            price: 12.99,
            imageUrl: "/placeholder.svg?height=200&width=300&text=Bird+Seed",
          },
          {
            id: 5,
            name: "Small Animal Feed",
            description: "Complete nutrition for rabbits, guinea pigs, and other small pets.",
            price: 15.99,
            imageUrl: "/placeholder.svg?height=200&width=300&text=Small+Animal+Feed",
          },
          {
            id: 6,
            name: "Senior Dog Food",
            description: "Easy-to-digest food for senior dogs with joint support supplements.",
            price: 32.99,
            imageUrl: "/placeholder.svg?height=200&width=300&text=Senior+Dog+Food",
          },
        ]

        // Initialize quantities for sample data
        const initialQuantities = {}
        sampleItems.forEach((item) => {
          initialQuantities[item.id] = 1
        })
        setQuantities(prev => ({...prev, ...initialQuantities}))
        setFoodItems(sampleItems)
      } finally {
        setIsLoading(false)
      }
    }

    getFoodItems()
  }, [])

  // Handle search food items
  const searchFoodItems = async (query) => {
    if (!query.trim()) {
      setIsSearchActive(false)
      return
    }
    
    setIsLoading(true)
    try {
      // Make API call to search endpoint
      const response = await fetch(`http://localhost:8080/api/food/search?name=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        const items = data.data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl ? `http://localhost:8080${item.imageUrl}` : "/placeholder.svg?height=200&width=300",
        }))
        
        // Initialize quantities for search results
        const searchQuantities = {}
        items.forEach((item) => {
          // Use existing quantity if available, otherwise set to 1
          searchQuantities[item.id] = quantities[item.id] || 1
        })
        
        setQuantities(prev => ({...prev, ...searchQuantities}))
        setSearchResults(items)
        setIsSearchActive(true)
      } else {
        setSearchResults([])
        setIsSearchActive(true)
      }
    } catch (error) {
      console.error("Failed to search food items:", error)
      setSearchResults([])
      setIsSearchActive(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    searchFoodItems(searchQuery)
  }

  // Clear search and show all items
  const clearSearch = () => {
    setSearchQuery("")
    setIsSearchActive(false)
  }

  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    // Ensure quantity is at least 1
    const newQuantity = Math.max(1, value)
    setQuantities({
      ...quantities,
      [id]: newQuantity,
    })
  }

  // Handle add to cart
  const handleAddToCart = (item) => {
    if (!userSession) {
      setAuthError("You must be logged in to donate")
      // Clear error after 3 seconds
      setTimeout(() => setAuthError(""), 3000)
      return
    }

    const quantity = quantities[item.id]
    const cartItem = {
      ...item,
      quantity,
      totalPrice: item.price * quantity,
    }

    // Check if item is already in cart
    const existingItemIndex = cart.findIndex((i) => i.id === item.id)

    let updatedCart;
    if (existingItemIndex >= 0) {
      // Update existing item
      updatedCart = [...cart]
      updatedCart[existingItemIndex] = cartItem
    } else {
      // Add new item
      updatedCart = [...cart, cartItem]
    }
    
    // Update state
    setCart(updatedCart)
    // localStorage update is handled by the useEffect

    // Show success message
    setSuccessMessage(`Added ${quantity} ${item.name} to your donation cart`)
    // Clear message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // Remove item from cart
  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
  }

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.totalPrice, 0).toFixed(2)

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      setAuthError("Your donation cart is empty")
      setTimeout(() => setAuthError(""), 3000)
      return
    }

    // Navigate to the checkout page
    // localStorage is already updated with cart data
    navigate("/checkout");
  }

  // Decide which items to display based on search state
  const displayItems = isSearchActive ? searchResults : foodItems

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Donate Food</h1>
            <p className="text-[#757575] mb-4">Help our animals by donating food and supplies</p>
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-4 rounded-md shadow-md mb-4 md:mb-0">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="font-medium">Donation Cart: Rs {cartTotal}</span>
            </div>
            {cart.length > 0 && (
              <button
                className="mt-2 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for food items..."
                className="w-full py-3 px-4 pr-10 rounded-md border border-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-[#757575] hover:text-black"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            <button 
              type="submit"
              className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search
            </button>
            {isSearchActive && (
              <button 
                type="button"
                onClick={clearSearch}
                className="bg-[#e0e0e0] text-black py-3 px-6 rounded-md hover:bg-[#d0d0d0] transition-colors flex items-center justify-center sm:w-auto"
              >
                Show All
              </button>
            )}
          </form>
        </div>

        {/* Messages */}
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{authError}</div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-[#757575]">Loading food items...</p>
          </div>
        ) : (
          /* Food Items Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.length > 0 ? (
              displayItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-black">{item.name}</h3>
                      <span className="bg-[#f0f0f0] text-black text-sm px-2 py-1 rounded">Rs {item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-[#757575] mb-4 line-clamp-3">{item.description}</p>

                    <div className="flex items-center mb-4">
                      <label htmlFor={`quantity-${item.id}`} className="mr-2 text-sm text-[#757575]">
                        Quantity:
                      </label>
                      <div className="flex border border-[#e0e0e0] rounded-md">
                        <button
                          className="px-2 py-1 bg-[#f0f0f0] text-black border-r border-[#e0e0e0]"
                          onClick={() => handleQuantityChange(item.id, quantities[item.id] - 1)}
                        >
                          -
                        </button>
                        <input
                          id={`quantity-${item.id}`}
                          type="number"
                          min="1"
                          value={quantities[item.id] || 1}
                          onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-12 text-center border-none focus:outline-none"
                        />
                        <button
                          className="px-2 py-1 bg-[#f0f0f0] text-black border-l border-[#e0e0e0]"
                          onClick={() => handleQuantityChange(item.id, quantities[item.id] + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center"
                      onClick={() => handleAddToCart(item)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                        <path d="M20 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Add to Donation Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 col-span-3">
                {isSearchActive ? (
                  <div>
                    <p className="text-[#757575] text-lg">No food items match your search criteria.</p>
                    <button 
                      className="mt-4 bg-[#e0e0e0] text-black py-2 px-4 rounded-md hover:bg-[#d0d0d0] transition-colors"
                      onClick={clearSearch}
                    >
                      Show All Items
                    </button>
                  </div>
                ) : (
                  <p className="text-[#757575] text-lg">No food items available for donation yet.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Donation Information */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-black mb-4">Why Donate Food?</h2>
          <p className="text-[#757575] mb-4">
            Your food donations directly help us feed the animals in our care. We rely on generous supporters like you
            to provide nutritious meals for dogs, cats, and other animals waiting for their forever homes.
          </p>
          <p className="text-[#757575] mb-4">
            All donations are tax-deductible, and you'll receive a receipt for your contribution.
          </p>
          <div className="bg-[#f0f0f0] p-4 rounded-md">
            <h3 className="font-semibold text-black mb-2">Other Ways to Help</h3>
            <ul className="list-disc list-inside text-[#757575]">
              <li>Volunteer your time at our shelter</li>
              <li>Foster an animal temporarily</li>
              <li>Spread the word about animals available for adoption</li>
              <li>Make a monetary donation to support medical care</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Donate