// src/components/DevSessionCheck.jsx
import { useEffect } from "react";
import { checkSession } from "../api"; // adjust the path as per your structure

const DevSessionCheck = () => {
  useEffect(() => {
    checkSession()
      .then(data => console.log("✅ Session active:", data))
      .catch(err => console.warn("❌ No active session:", err));
  }, []);

  return null; // No UI needed
};

export default DevSessionCheck;
