"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getUserByLicense, adminUpdateUser, updateUserRoles } from "../../apis/admin"
import { CheckIcon, SearchIcon } from "lucide-react"
import Navbar from "../../components/NavBar"
import ContactUs from "../../components/ContactUs"

const rolesEnum = [
  "Admin",
  "Manager",
  "Project Manager",
  "Business Manager",
  "Financial Leader",
  "Manufacturing Eng. Manager",
  "Manufacturing Eng. Leader",
  "Tooling Manager",
  "Automation Leader",
  "SAP Leader",
  "Methodes UAP1&3",
  "Methodes UAP2",
  "Maintenance Manager",
  "Maintenance Leader UAP2",
  "Purchasing Manager",
  "Logistic Manager",
  "Logistic Leader UAP1",
  "Logistic Leader UAP2",
  "Logistic Leader",
  "POE Administrator",
  "Material Administrator",
  "Warehouse Leader UAP1",
  "Warehouse Leader UAP2",
  "Prod. Plant Manager UAP1",
  "Prod. Plant Manager UAP2",
  "Quality Manager",
  "Quality Leader UAP1",
  "Quality Leader UAP2",
  "Quality Leader UAP3",
  "Laboratory Leader",
  "Customer",
  "User",
  "PRODUCCION",
   "LOGISTICA",
]

export default function EditUserRoles() {
  const { license } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    image: "",
    roles: [],
  })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchRole, setSearchRole] = useState("")

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const data = await getUserByLicense(license)
      setFormData({
        username: data.username || "",
        email: data.email || "",
        image: data.image || "",
        roles: data.roles || [],
      })
    } catch (error) {
      setMessage("Failed to load user data.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleRole = (role) => {
    setFormData((prevData) => ({
      ...prevData,
      roles: prevData.roles.includes(role) ? prevData.roles.filter((r) => r !== role) : [...prevData.roles, role],
    }))
  }

  const filteredRoles = rolesEnum.filter((role) => role.toLowerCase().includes(searchRole.toLowerCase()))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await adminUpdateUser(license, formData)
      await updateUserRoles(license, formData.roles)
      setMessage("User updated successfully!")
      setTimeout(() => navigate("/admin"), 2000)
    } catch (error) {
      setMessage("Error updating user.")
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return <div className="flex items-center justify-center h-screen text-xl font-semibold">Loading user data...</div>

  return (
    <div>
        <Navbar />
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Edit User</h1>
      {message && <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-md">{message}</div>}

      <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white rounded-lg shadow-md">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Profile Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Assign Roles</label>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search roles..."
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          </div>
          <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-gray-50 min-h-[100px] max-h-[300px] overflow-y-auto">
            {filteredRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  formData.roles.includes(role)
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <CheckIcon className="w-5 h-5 mr-2" />
                Save Changes
              </span>
            )}
          </button>
        </div>
      </form>
      
    </div>
            <ContactUs />
            </div>
  )
}

