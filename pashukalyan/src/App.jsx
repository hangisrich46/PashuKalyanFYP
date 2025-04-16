import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Adopt from "./pages/Adopt";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import API from "./api"; // Import your API

function App() {
  // Add session checking logic
  useEffect(() => {
    const checkSessionStatus = async () => {
      try {
        const sessionResponse = await API.get("/check-session");
        console.log("Current backend session:", sessionResponse.data);
        console.log("Current cookies:", document.cookie);
        console.log("Current localStorage:", localStorage.getItem("userSession"));
      } catch (error) {
        console.log("Not authenticated according to backend:", error.response?.data || error.message);
        
        // If backend says not authenticated but we have local storage, clear it
        if (localStorage.getItem("userSession")) {
          console.log("Clearing inconsistent session state");
          localStorage.removeItem("userSession");
        }
      }
    };
    
    // Check immediately on app load
    checkSessionStatus();
    
    // Check every minute
    const interval = setInterval(checkSessionStatus, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/adopt" element={<Adopt />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;