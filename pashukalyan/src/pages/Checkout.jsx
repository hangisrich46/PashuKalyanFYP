"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ESewaPayment from "../components/ESewaPayment" // Import the eSewa component

const Checkout = () => {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  // Get cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("donationCart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Check if the cart is stored as {userId, items} or directly as an array
        if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
          // New format from Donate page: {userId, items}
          setCart(parsedCart.items)
        } else if (Array.isArray(parsedCart)) {
          // Old format: direct array
          setCart(parsedCart)
        } else {
          // Fallback to empty array
          console.error("Invalid cart format:", parsedCart)
          setCart([])
        }
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
        setCart([])
      }
      setLoading(false)
    } else {
      // Redirect to donation page if cart is empty
      navigate("/donate")
    }
  }, [navigate])

  // Update localStorage whenever cart changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("donationCart", JSON.stringify(cart))
    } else if (!loading) {
      // Only redirect if this is not the initial loading
      localStorage.removeItem("donationCart")
      navigate("/donate")
    }
  }, [cart, loading, navigate])

  // Calculate totals - with safety check for cart
  const subtotal = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (item.totalPrice || 0), 0)
    : 0
  const tax = subtotal * 0.13 // 13% tax
  const total = subtotal + tax

  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    // Ensure quantity is at least 1
    newQuantity = Math.max(1, newQuantity)
    
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: item.price * newQuantity
        }
      }
      return item
    })
    
    setCart(updatedCart)
  }

  // Handle item removal
  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id)
    setCart(updatedCart)
  }

  // Handle payment processing state
  const handlePaymentStart = () => {
    setPaymentProcessing(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f5f5f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#212121] mx-auto mb-4"></div>
          <p className="text-[#757575]">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-black mb-8 text-center">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-[#e0e0e0]">
            <h2 className="text-xl font-semibold text-black mb-4">Order Summary</h2>

            <div className="space-y-4">
              {Array.isArray(cart) && cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center pb-4 border-b border-[#e0e0e0] last:border-0"
                >
                  <div className="flex items-center">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-black">{item.name}</h3>
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-[#757575] mr-4">Quantity: </p>
                        <div className="flex border border-[#e0e0e0] rounded-md">
                          <button
                            className="px-2 py-0.5 bg-[#f0f0f0] text-black border-r border-[#e0e0e0]"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-10 text-center border-none focus:outline-none text-sm py-0.5"
                          />
                          <button
                            className="px-2 py-0.5 bg-[#f0f0f0] text-black border-l border-[#e0e0e0]"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-black">Rs {item.totalPrice.toFixed(2)}</p>
                    <p className="text-sm text-[#757575]">Rs {item.price.toFixed(2)} each</p>
                    <button 
                      className="text-red-500 text-sm mt-1 hover:text-red-700"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-6 pt-4 border-t border-[#e0e0e0]">
              <div className="flex justify-between mb-2">
                <span className="text-[#757575]">Subtotal</span>
                <span className="text-black">Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#757575]">Tax (13%)</span>
                <span className="text-black">Rs {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#e0e0e0] mt-2">
                <span>Total</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Payment Method</h2>

            <div className="bg-[#f9f9f9] p-4 rounded-md border border-[#e0e0e0] mb-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="esewa"
                  name="paymentMethod"
                  checked={true}
                  readOnly
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-[#e0e0e0]"
                />
                <label htmlFor="esewa" className="ml-2 flex items-center">
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold mr-2">ESEWA</div>
                  <span className="font-medium">eSewa E-Wallet</span>
                </label>
              </div>
              <p className="text-sm text-[#757575] mt-2 ml-6">Pay securely using your eSewa wallet</p>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate("/donate")}
                className="px-6 py-2 border border-[#e0e0e0] rounded-md hover:bg-[#f0f0f0] transition-colors"
              >
                Back to Donations
              </button>

              {/* Integrate the eSewa Payment Component */}
              <ESewaPayment 
                cart={{ items: Array.isArray(cart) ? cart : [] }} 
                onPaymentStart={handlePaymentStart} 
              />
            </div>
          </div>
        </div>

        {/* Donation Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Donation Information</h2>
          <p className="text-[#757575] mb-4">
            Your generous donation will help provide food and care for animals in need. All donations are
            tax-deductible.
          </p>
          <p className="text-[#757575]">
            A receipt will be sent to your email address after your donation is processed.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Checkout
