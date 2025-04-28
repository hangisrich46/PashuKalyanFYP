import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Adopt from "./pages/Adopt";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Donate from "./pages/Donate";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/adopt", element: <Adopt /> },
  { path: "/blog", element: <Blog /> },
  { path: "/login", element: <Login /> },
  { path: "/donate", element: <Donate /> },
  { path: "/register", element: <Register /> },
  { path: "/admin", element: <AdminDashboard />},
  { path: "/checkout", element: <Checkout />}


]);

export default router;
