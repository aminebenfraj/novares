"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Unauthorized = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-gray-700 mb-3">
              You don't have permission to access this page. This area requires specific role privileges.
            </p>
            <p className="text-sm text-gray-500">
              Your current roles: {user?.roles?.join(", ") || "No roles assigned"}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-center"
            >
              Go to Home
            </Link>
            <Link
              to="/profile"
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors text-center"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
