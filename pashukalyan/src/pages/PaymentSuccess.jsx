import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [donation, setDonation] = useState(null);
  const [donationId, setDonationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSuccessfulPayment = async () => {
      try {
        setLoading(true);
        console.log("Payment success page loaded");
        console.log("URL search params:", location.search);
        
        // First check URL for donationId
        const params = new URLSearchParams(location.search);
        const id = params.get('donationId');
        
        // Check for ESewa response data (this may be in a different parameter depending on ESewa)
        const esewaData = params.get('data');
        
        console.log("Found donation ID:", id);
        console.log("Found ESewa data:", esewaData);
        
        if (id) {
          // Donation already recorded, just fetch details
          setDonationId(id);
          try {
            console.log("Fetching donation with ID:", id);
            const donationData = await fetchDonationById(id);
            console.log("Fetched donation:", donationData);
            setDonation(donationData);
          } catch (fetchError) {
            console.error("Error fetching donation:", fetchError);
            setError("Failed to load donation details");
          }
        } else {
          // Check localStorage for pending donation
          const pendingDonation = localStorage.getItem("pendingDonation");
          console.log("Pending donation from localStorage:", pendingDonation);
          
          if (pendingDonation) {
            try {
              const donationData = JSON.parse(pendingDonation);
              setDonation(donationData);
              
              // Record donation in database
              console.log("Recording donation:", donationData);
              
              // Create donation record DTO
              const donationRecord = {
                transactionUuid: donationData.transactionUuid || `don_${new Date().getTime()}`,
                status: "COMPLETE",
                paymentMethod: "ESEWA",
                subtotal: donationData.subtotal,
                tax: donationData.tax,
                total: donationData.total,
                items: donationData.cart.items
              };
              
              // Record donation directly with axios
              const response = await axios.post('/api/donations/record', donationRecord);
              console.log("Donation recording response:", response.data);
              
              if (response.data.success) {
                const newDonationId = response.data.donationId;
                console.log("New donation ID:", newDonationId);
                setDonationId(newDonationId);
                
                // Try to fetch full donation details
                try {
                  const fullDonation = await axios.get(`/api/donations/id/${newDonationId}`);
                  console.log("Full donation details:", fullDonation.data);
                  setDonation(fullDonation.data);
                } catch (detailError) {
                  console.error("Error fetching full donation:", detailError);
                }
              } else {
                setError("Failed to record donation");
              }
            } catch (recordError) {
              console.error("Error recording donation:", recordError);
              setError("Error processing donation");
            }
          } else {
            console.error("No donation data found");
            setError("No donation data found");
          }
        }
      } catch (error) {
        console.error("Error handling payment success:", error);
        setError("An unexpected error occurred");
      } finally {
        // Clear cart data
        localStorage.removeItem("pendingDonation");
        localStorage.removeItem("donationCart");
        setLoading(false);
      }
    };
    
    handleSuccessfulPayment();
  }, [location.search]); // Use location.search to ensure it runs when URL params change

  const handleDownloadInvoice = () => {
    if (donationId) {
      const url = `/api/donations/id/${donationId}/invoice`;
      console.log("Opening invoice URL:", url);
      window.open(url, '_blank');
    } else {
      console.error("No donation ID available for invoice download");
      alert("Receipt not available yet");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#60BB46] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Processing your donation...</p>
          </div>
        ) : (
          <>
            {error ? (
              <div className="text-red-500 mb-4">
                <p>{error}</p>
                <p className="mt-2">Please try refreshing the page</p>
              </div>
            ) : (
              <>
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
                
                {donation && (
                  <div className="text-left mb-6 p-4 bg-gray-50 rounded">
                    <h2 className="font-semibold mb-2">Donation Summary:</h2>
                    <p>Amount: Rs {(donation.subtotalAmount || donation.subtotal || 0).toFixed(2)}</p>
                    <p>Tax: Rs {(donation.taxAmount || donation.tax || 0).toFixed(2)}</p>
                    <p>Total: Rs {(donation.totalAmount || donation.total || 0).toFixed(2)}</p>
                    
                    {/* Display transaction ID for reference */}
                    <p className="mt-2 text-sm text-gray-500">
                      Reference: {donation.transactionUuid || donation.transactionCode || "Transaction complete"}
                    </p>
                  </div>
                )}
              </>
            )}
            
            {/* Always show Download Receipt button if we have a donation ID */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;