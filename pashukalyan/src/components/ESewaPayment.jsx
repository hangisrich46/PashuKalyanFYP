import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import esewaLogo from "../assets/esewa-logo.png";

const ESewaPayment = ({ cart, onPaymentStart }) => {
  const navigate = useNavigate();
  
  // Create state for payment data
  const [paymentData, setPaymentData] = useState({
    amount: "0",
    tax_amount: "0",
    total_amount: "0",
    transaction_uuid: uuidv4(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: `${window.location.origin}/checkout/success`,
    failure_url: `${window.location.origin}/checkout/failure`,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });
  
  // Generate signature function - exactly like your friend's code
  const generateSignature = (
    total_amount,
    transaction_uuid,
    product_code,
    secret
  ) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
    return hashedSignature;
  };
  
  // Calculate amounts when cart changes
  useEffect(() => {
    if (cart && cart.items && cart.items.length > 0) {
      const amount = cart.items.reduce((total, item) => total + item.totalPrice, 0);
      const tax = amount * 0.13;
      const total = amount + tax;
      
      setPaymentData(prev => ({
        ...prev,
        amount: amount.toFixed(2),
        tax_amount: tax.toFixed(2),
        total_amount: total.toFixed(2)
      }));
    }
  }, [cart]);
  
  // Generate signature when payment data changes
  useEffect(() => {
    const { total_amount, transaction_uuid, product_code, secret } = paymentData;
    const hashedSignature = generateSignature(
      total_amount,
      transaction_uuid,
      product_code,
      secret
    );
    
    setPaymentData(prev => ({
      ...prev,
      signature: hashedSignature
    }));
  }, [paymentData.amount, paymentData.total_amount, paymentData.transaction_uuid]);
  
  const handlePayWithESewa = async () => {
    try {
      onPaymentStart?.();
      
      // Store cart in localStorage for reference after payment
      localStorage.setItem("pendingDonation", JSON.stringify({
        cart,
        amount: paymentData.amount,
        tax: paymentData.tax_amount,
        total: paymentData.total_amount,
        transactionUuid: paymentData.transaction_uuid,
        timestamp: new Date().getTime()
      }));
      
      // Create and submit the form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
      
      // Add parameters to the form data
      Object.entries(paymentData).forEach(([key, value]) => {
        if (key !== "secret") { // Don't include secret in the form
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      });
      
      // Append query parameters to success and failure URLs
      form.querySelector('input[name="success_url"]').value = `${window.location.origin}/checkout/success?status=success&transaction_id=${paymentData.transaction_uuid}`;
      form.querySelector('input[name="failure_url"]').value = `${window.location.origin}/checkout/failure?status=failure&transaction_id=${paymentData.transaction_uuid}`;
      
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  // Return the payment button UI
  return (
    <div className="mt-4">
      <button
        onClick={handlePayWithESewa}
        className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md transition-colors"
      >
        <img src={esewaLogo} alt="eSewa" className="h-6 mr-2" />
        Pay with eSewa
      </button>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Secure payment processed by eSewa
      </p>
    </div>
  );
};

export default ESewaPayment;