import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard, faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../utils/AuthValidation"; // ✅ Import Register Schema
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [serverError, setServerError] = useState("");

  // ✅ Use React Hook Form with external validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // ✅ Handle form submission
  const onSubmit = async (data) => {
    setServerError("");

    try {
      await authRegister(data.license, data.username, data.email, data.password);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      setServerError(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="flex flex-col justify-center items-center font-[sans-serif] h-[700px] p-20 bg-white">
        <div className="max-w-md w-full mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_13px_-3px_rgba(0,0,0,0.15)]"
          >
            <div className="mb-6">
              <h3 className="text-violet-700 text-3xl font-extrabold">Register</h3>
            </div>

            {/* 🔴 Display Server Error */}
            {serverError && <p className="text-red-600 text-sm text-center mb-4">{serverError}</p>}

            {/* License Input */}
            <div className="relative flex items-center">
              <FontAwesomeIcon icon={faIdCard} className="absolute left-2 text-violet-700" />
              <input
                {...register("license")}
                type="text"
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 pl-8 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter license"
              />
            </div>
            {errors.license && <p className="text-red-500 text-xs">{errors.license.message}</p>}

            {/* Username Input */}
            <div className="relative flex items-center mt-6">
              <FontAwesomeIcon icon={faUser} className="absolute left-2 text-violet-700" />
              <input
                {...register("username")}
                type="text"
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 pl-8 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter username"
              />
            </div>
            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}

            {/* Email Input */}
            <div className="relative flex items-center mt-6">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-2 text-violet-700" />
              <input
                {...register("email")}
                type="email"
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 pl-8 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

            {/* Password Input */}
            <div className="relative flex items-center mt-6">
              <FontAwesomeIcon icon={faLock} className="absolute left-2 text-violet-700" />
              <input
                {...register("password")}
                type="password"
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 pl-8 py-3 outline-none placeholder:text-gray-800"
                placeholder="Enter password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

            {/* Password Confirmation Input */}
            <div className="relative flex items-center mt-6">
              <FontAwesomeIcon icon={faLock} className="absolute left-2 text-violet-700" />
              <input
                {...register("passwordConfirmation")}
                type="password"
                className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-400 focus:border-gray-800 pl-8 py-3 outline-none placeholder:text-gray-800"
                placeholder="Confirm password"
              />
            </div>
            {errors.passwordConfirmation && (
              <p className="text-red-500 text-xs">{errors.passwordConfirmation.message}</p>
            )}

            {/* Submit Button */}
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
