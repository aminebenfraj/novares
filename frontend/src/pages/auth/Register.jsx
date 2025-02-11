import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard, faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    lisence: "",  // ✅ Added lisence field as required by schema
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register(formData.lisence, formData.username, formData.email, formData.password);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col justify-between min-h-screen">
    

      {/* Registration Form */}
      <div className="flex flex-col justify-center items-center font-[sans-serif] h-[700px] p-20 bg-white">
        <div className="max-w-md w-full mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_13px_-3px_rgba(0,0,0,0.15)]"
          >
            <div className="mb-6">
              <h3 className="text-violet-700 text-3xl font-extrabold">Register</h3>
            </div>

            {/* Display Error Message */}
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            <div className="relative flex items-center">
              <FontAwesomeIcon icon={faIdCard} className="absolute left-2 text-violet-700" />
              <input
                name="lisence"
                type="text"
                required
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 pl-8 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter license"
                onChange={handleChange}
                value={formData.lisence}
              />
            </div>

            <div className="relative flex items-center mt-6">
              <FontAwesomeIcon icon={faUser} className="absolute left-2 text-violet-700" />
              <input
                name="username"
                type="text"
                required
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 pl-8 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter username"
                onChange={handleChange}
                value={formData.username}
              />
            </div>

            <div className="relative flex items-center mt-6">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-2 text-violet-700" />
              <input
                name="email"
                type="email"
                required
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 pl-8 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter email"
                onChange={handleChange}
                value={formData.email}
              />
            </div>

            <div className="relative flex items-center mt-6">
              <FontAwesomeIcon icon={faLock} className="absolute left-2 text-violet-700" />
              <input
                name="password"
                type="password"
                required
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 pl-8 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter password"
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            <div className="relative flex items-center mt-6">
              <FontAwesomeIcon icon={faLock} className="absolute left-2 text-violet-700" />
              <input
                name="passwordConfirmation"
                type="password"
                required
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 pl-8 py-3 outline-none placeholder:text-gray-800"
                placeholder="Confirm password"
                onChange={handleChange}
                value={formData.passwordConfirmation}
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold tracking-wider rounded-full text-white bg-violet-700 hover:bg-purple-500 focus:outline-none"
              >
                Register
              </button>
              <p className="text-gray-800 text-sm text-center mt-6">
                Already have an account?
                <Link
                  to="/login"
                  className="text-violet-700 font-semibold hover:underline ml-1 whitespace-nowrap"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
