import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeTerms) {
      newErrors.terms = "You must agree to the Terms and Conditions";
    }

    // If there are validation errors, show toast and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Show the first error in a toast
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      return;
    }

    try {
      toast.info("Creating your account...", {
        position: "top-right",
        autoClose: 3000
      });

      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phone, 
        }),
      });

      if (response.ok) {
        toast.success("Registration successful! Please check your email to verify your account.", {
          position: "top-right",
          autoClose: 5000
        });
        
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setAgreeTerms(false);
      } else {
        const data = await response.json();
        
        // Handle specific error cases
        if (data.error === "email_exists") {
          toast.error("This email address is already registered. Please use another email or try logging in.", {
            position: "top-right",
            autoClose: 5000
          });
        } else {
          toast.error(data.message || "Registration failed. Please try again.", {
            position: "top-right",
            autoClose: 5000
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network error. Please check your connection and try again later.", {
        position: "top-right",
        autoClose: 5000
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-[#dfdbdb] py-12">
      <ToastContainer />
      <div className="container mx-auto px-4">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <p className="text-[#757575] text-sm">JOIN OUR COMMUNITY</p>
            <h2 className="text-2xl font-medium text-[#000000]">Create an Account</h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-[#757575]">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.firstName ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-md`}
                  required
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm text-[#757575]">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#e0e0e0] rounded-md"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#757575]">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-md`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#757575]">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-[#e0e0e0] rounded-md"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#757575]">Password*</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-md`}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#757575]">Confirm Password*</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-[#e0e0e0]'} rounded-md`}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                className={`h-4 w-4 mt-1 ${errors.terms ? 'border-red-500' : ''}`}
              />
              <label className="ml-2 text-sm text-[#757575]">
                I agree to the <a href="/terms" className="text-[#000000] hover:underline">Terms and Conditions</a>
                and <a href="/privacy" className="text-[#000000] hover:underline">Privacy Policy</a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs">{errors.terms}</p>
            )}

            <button type="submit" className="w-full bg-[#212121] text-white py-3 rounded-md hover:bg-[#424242]">
              REGISTER
            </button>

            <div className="text-center text-sm text-[#757575] mt-4">
              Already have an account? <a href="/login" className="text-[#000000] hover:underline">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;