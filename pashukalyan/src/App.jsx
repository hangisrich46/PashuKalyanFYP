import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

import Login from "./pages/Login";
import Adopt from "./pages/Adopt";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
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
            <Route path="/admin" element={<AdminDashboard />}

                        
                        />
            

        
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
