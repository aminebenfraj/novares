"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createCustomer } from "../../utils/apis/customerApi"
import { customerSchema } from "../../utils/customerValidation"
import { Navbar } from "../../components/Navbar"
import ContactUs from "../../components/ContactUs";

export default function CustomerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setServerError("")

    const validationResult = customerSchema.safeParse(formData)
    if (!validationResult.success) {
      setErrors(validationResult.error.format())
      return
    }

    try {
      await createCustomer(formData)
      navigate("/customers")
    } catch (error) {
      console.error("Error creating customer:", error)
      setServerError("Failed to create customer. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container max-w-2xl px-4 py-8 mx-auto">
        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="px-6 py-8">
            <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Add Customer</h2>
            {serverError && <p className="mb-4 text-sm text-center text-red-500">{serverError}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name._errors[0]}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email._errors[0]}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(123) 456-7890"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone._errors[0]}</p>}
              </div>
              <div>
                <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main St, City, State, ZIP"
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address._errors[0]}</p>}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/customers")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ContactUs />

    </div>
  )
}

