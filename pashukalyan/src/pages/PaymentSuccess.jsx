import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { recordDonation, getDonationInvoice } from "../api";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [donationId, setDonationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationData, setDonationData] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        console.log("Payment success page loaded");
        
        // Check localStorage for pending donation
        const pendingDonationJson = localStorage.getItem("pendingDonation");
        
        if (!pendingDonationJson) {
          console.log("No pending donation found");
          setLoading(false);
          return;
        }
        
        // Parse the pending donation data
        const pendingDonation = JSON.parse(pendingDonationJson);
        console.log("Found pending donation:", pendingDonation);
        
        // Store the donation data for display
        setDonationData({
          amount: pendingDonation.amount || "0.00",
          tax: pendingDonation.tax_amount || pendingDonation.tax || "0.00",
          total: pendingDonation.total_amount || pendingDonation.total || "0.00",
          reference: pendingDonation.transactionUuid || pendingDonation.transaction_uuid || "Transaction complete"
        });
        
        // Create the donation record for the backend
        const userId = localStorage.getItem("userId") || 1;
        
        const donationRecord = {
          userId: userId,
          transactionUuid: pendingDonation.transactionUuid || pendingDonation.transaction_uuid || `don_${Date.now()}`,
          paymentMethod: "ESEWA",
          paymentStatus: "COMPLETE",
          subtotal: pendingDonation.amount,
          tax: pendingDonation.tax_amount || pendingDonation.tax,
          total: pendingDonation.total_amount || pendingDonation.total,
          items: pendingDonation.cart && pendingDonation.cart.items ? 
            pendingDonation.cart.items.map(item => ({
              itemId: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              totalPrice: item.totalPrice
            })) : []
        };
        
        // Try to record the donation
        try {
          const response = await recordDonation(donationRecord);
          console.log("Donation recording response:", response);
          
          if (response && response.donationId) {
            setDonationId(response.donationId);
          }
        } catch (error) {
          console.error("Error recording donation:", error);
          // Continue showing success even if recording fails
        }
      } catch (error) {
        console.error("Error processing payment:", error);
      } finally {
        // Clear localStorage and finish loading
        localStorage.removeItem("pendingDonation");
        localStorage.removeItem("donationCart");
        setLoading(false);
      }
    };
    
    processPayment();
  }, []);

  const handleDownloadInvoice = () => {
    if (donationId) {
      getDonationInvoice(donationId);
    } else {
      alert("Receipt is not available yet. Please try again later.");
    }
  };

  // Simple loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="w-12 h-12 border-4 border-[#60BB46] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Processing your donation...</p>
        </div>
      </div>
    );
  }

  // Success screen
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <svg 
          className="w-16 h-16 text-green-500 mx-auto mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your donation has been processed successfully. Thank you for your generosity!
        </p>
        
        {donationData && (
          <div className="text-left mb-6 p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Donation Summary:</h2>
            <p>Amount: Rs {parseFloat(donationData.amount).toFixed(2)}</p>
            <p>Tax: Rs {parseFloat(donationData.tax).toFixed(2)}</p>
            <p>Total: Rs {parseFloat(donationData.total).toFixed(2)}</p>
            <p className="mt-2 text-sm text-gray-500">
              Reference: {donationData.reference}
            </p>
          </div>
        )}
        
        {donationId && (
          <button
            onClick={handleDownloadInvoice}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
          >
            Download Receipt
          </button>
        )}
        
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-[#60BB46] text-white rounded-md hover:bg-[#4A9934] transition-colors"
          >
            Return to Home
          </button>
          
          <button
            onClick={() => navigate("/donate")}
            className="px-6 py-2 border border-[#60BB46] text-[#60BB46] rounded-md hover:bg-[#f0f9f0] transition-colors"
          >
            Donate Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;