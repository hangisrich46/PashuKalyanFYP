import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate(); // To redirect after login

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        { email, password },
        { withCredentials: true } // Ensures session cookie is sent and stored
      );

      if (response.status === 200) {
        // Store session data
        sessionStorage.setItem("userEmail", email);

        // Redirect to /Home
        navigate("/Home");
      }
    } catch (error) {
      setErrors(error.response?.data || "Login failed! Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#dfdbdb]">
      <main className="flex-grow flex flex-col md:flex-row p-6 gap-8">
        <div className="md:w-1/2 space-y-8">
          <div>
            <h2 className="text-2xl font-medium text-[#000000] mb-4">‘ SERVING THE NEEDY ONES ’</h2>
            <div className="rounded overflow-hidden">
              <img src="logincv.png" alt="People with dogs" className="w-full object-cover h-[300px]" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-medium text-[#000000] mb-4">‘ SAVE AND GIVE HOME ’</h2>
            <div className="rounded overflow-hidden">
              <img src="feed.png" alt="People helping dogs" className="w-full object-cover h-[300px]" />
            </div>
          </div>
        </div>

        <div className="md:w-1/2 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
            <div className="text-center mb-6">
              <p className="text-[#757575] text-sm">WELCOME BACK</p>
              <h2 className="text-2xl font-medium text-[#000000]">Log In to your Account</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {errors && <div className="text-red-500 text-center">{errors}</div>}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-[#757575]">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="johnsondoe@nomail.com"
                  value={email}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9e9e9e]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm text-[#757575]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handleChange}
                    className="w-full p-3 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#9e9e9e]"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9e9e9e]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-[#000000] border-[#9e9e9e] rounded"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-[#757575]">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="text-sm text-[#757575] hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#212121] text-white py-3 rounded-md hover:bg-[#424242] transition-colors"
              >
                CONTINUE
              </button>

              <div className="text-center text-sm text-[#757575]">
                Don’t have an account?{" "}
                <a href="/register" className="text-[#000000] hover:underline">
                  Register
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
