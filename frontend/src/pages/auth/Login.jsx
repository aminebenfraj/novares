import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import ContactUs from "../../components/ContactUs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../lib/AuthValidation"; // ✅ Import Login Schema
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState(null);

  // ✅ Use React Hook Form with external validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // ✅ Handle form submission
  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await login(data.license, data.password);
      navigate("/"); // Redirect after successful login
    } catch (err) {
      console.error(err);
      setServerError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#125671]">
      <div className="flex justify-center items-center font-[sans-serif] h-[700px] min-h-max p-4 bg-white">
        <div className="w-full max-w-md mx-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_13px_-3px_rgba(0,0,0,0.2)]"
          >
            <div className="mb-6">
              <h3 className="text-3xl font-extrabold text-violet-700">Sign in</h3>
            </div>

            {/* 🔴 Display Server Error */}
            {serverError && <p className="mb-4 text-sm text-red-600">{serverError}</p>}

            {/* License Input */}
            <div className="relative flex items-center">
              <input
                {...register("license")}
                type="text"
                className="w-full px-2 py-3 text-sm text-gray-800 bg-transparent border-b border-gray-400 outline-none focus:border-gray-800 placeholder:text-gray-800"
                placeholder="Enter license"
              />
              <FontAwesomeIcon icon={faEnvelope} className="absolute right-2 text-violet-700" />
            </div>
            {errors.license && <p className="text-xs text-red-500">{errors.license.message}</p>}

            {/* Password Input */}
            <div className="relative flex items-center mt-6">
              <input
                {...register("password")}
                type="password"
                className="w-full px-2 py-3 text-sm text-gray-800 bg-transparent border-b border-gray-400 outline-none focus:border-gray-800 placeholder:text-gray-800"
                placeholder="Enter password"
              />
              <FontAwesomeIcon icon={faLock} className="absolute cursor-pointer right-2 text-violet-700" />
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded shrink-0"
                />
                <label htmlFor="remember-me" className="block ml-3 text-sm text-gray-800">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm font-semibold text-purple-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-semibold tracking-wider rounded-full text-white bg-violet-600 hover:bg-violet-500 focus:outline-none"
              >
                Sign in
              </button>
              <p className="mt-6 text-sm text-center text-gray-800">
                Dont have an account?
                <Link to="/register" className="ml-1 font-semibold text-purple-500 hover:underline">
                  {" "}Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
            <ContactUs />
      
    </div>
  );
}
