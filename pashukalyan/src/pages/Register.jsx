import { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",  // changed from firstName to first_name
    lastName: "",   // changed from lastName to last_name
    email: "",
    phoneNumber: "",  // changed from phone to phone_number
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
  
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
  
    if (!agreeTerms) {
      toast.warning("You must agree to the Terms and Conditions");
      return;
    }
  
    try {
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
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Registration successful!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
      } else {
        if (response.status === 409) {
          setErrors({ email: data.message });
          toast.error(data.message);
        } else {
          setErrors({ server: data.message || "Registration failed" });
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ server: "Something went wrong. Please try again later." });
      toast.error("Something went wrong. Please try again later.");
    }
  };
  
  
  return (
    <div className="min-h-screen bg-[#dfdbdb] py-12">
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
                  className="w-full p-3 border border-[#e0e0e0] rounded-md"
                  required
                />
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
    className="w-full p-3 border border-[#e0e0e0] rounded-md"
    required
  />
 
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
                  className="w-full p-3 border border-[#e0e0e0] rounded-md"
                  required
                />
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
                  className="w-full p-3 border border-[#e0e0e0] rounded-md"
                  required
                />
              </div>
            </div>

            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                className="h-4 w-4 mt-1"
              />
              <label className="ml-2 text-sm text-[#757575]">
                I agree to the <a href="/terms" className="text-[#000000] hover:underline">Terms and Conditions</a>
                and <a href="/privacy" className="text-[#000000] hover:underline">Privacy Policy</a>
              </label>
            </div>

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
