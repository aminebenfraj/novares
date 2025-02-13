"use client"

import { useEffect, useState, useCallback } from "react"
import { getAllCustomers, deleteCustomer } from "../../utils/apis/customerApi"
import { useNavigate } from "react-router-dom"
import { Navbar } from "../../components/Navbar"
import ContactUs from "../../components/ContactUs";

export default function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const response = await getAllCustomers()
      setCustomers(response)
    } catch (error) {
      console.error("Error fetching customers:", error)
      setError("Failed to load customers.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id)
        setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer._id !== id))
      } catch (error) {
        console.error("Error deleting customer:", error)
        setError("Failed to delete customer.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Customer List</h1>
        {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}
        <div className="mb-4">
          <button
            onClick={() => navigate("/customers/create")}
            className="px-4 py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Add Customer
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-hidden bg-white rounded-lg shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Email", "Phone", "Actions"].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <tr key={customer._id} className="transition duration-150 ease-in-out hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{customer.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{customer.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{customer.phone}</td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/customers/edit/${customer._id}`)}
                            className="text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id)}
                            className="ml-4 text-red-600 transition duration-150 ease-in-out hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-sm text-center text-gray-500">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <ContactUs />
    </div>
  )
}
