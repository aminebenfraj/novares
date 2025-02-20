import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMassProductionById, updateMassProduction } from "../../apis/massProductionApi"
import { getAllCustomers } from "../../apis/customerApi"
import { getAllpd } from "../../apis/ProductDesignation-api"
import { Navbar } from "../../components/Navbar"
import ContactUs from "../../components/ContactUs"

export default function EditMassProductionForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    id: "",
    status: "",
    status_type: "",
    project_n: "",
    product_designation: [],
    description: "",
    customer: "",
    technical_skill: "",
    initial_request: "",
    request_original: "",
    frasability: "",
    validation_for_offer: "",
    customer_offer: "",
    customer_order: "",
    ok_for_lunch: "",
    kick_off: "",
    design: "",
    facilities: "",
    p_p_tuning: "",
    process_qualif: "",
    ppap_submission_date: "",
    ppap_submitted: false,
    closure: "",
    comment: "",
    next_review: "",
    mlo: "",
    tko: "",
    cv: "",
    pt1: "",
    pt2: "",
    sop: "",
    days_until_ppap_submission: 0,
  })

  const [customers, setCustomers] = useState([])
  const [productDesignations, setProductDesignations] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (id) {
      fetchMassProduction()
      fetchCustomersAndProductDesignations()
    }
  }, [id])

  const fetchMassProduction = async () => {
    try {
      const data = await getMassProductionById(id)
      setFormData(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching mass production:", error)
      setError("Failed to load mass production data. Please try again.")
      setLoading(false)
    }
  }

  const fetchCustomersAndProductDesignations = async () => {
    try {
      const [customersData, pdData] = await Promise.all([getAllCustomers(), getAllpd()])
      setCustomers(customersData.filter((customer) => customer.role === "Customer"))
      setProductDesignations(pdData)
    } catch (error) {
      console.error("Error fetching customers or product designations:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value

    if (name === "ppap_submission_date") {
      const ppapDate = new Date(value)
      const today = new Date()
      const timeDiff = ppapDate.getTime() - today.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        days_until_ppap_submission: daysDiff,
      }))
    } else if (name === "closure") {
      const closureDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ppap_submitted: closureDate < today,
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }))
    }
  }

  const toggleProductDesignation = (pdId) => {
    setFormData((prevData) => ({
      ...prevData,
      product_designation: prevData.product_designation.includes(pdId)
        ? prevData.product_designation.filter((id) => id !== pdId)
        : [...prevData.product_designation, pdId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    if (formData.product_designation.length === 0) {
      setMessage("Please select at least one product designation.")
      setLoading(false)
      return
    }

    try {
      await updateMassProduction(id, formData)
      setMessage("Mass production updated successfully!")
      navigate("/mass-productions") // Redirect to the list page after successful update
    } catch (error) {
      console.error("Error updating mass production:", error)
      setMessage(error.response?.data?.message || "Error updating mass production. Please try again.")
    }

    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Edit Mass Production</h1>
        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {message && (
              <div className="p-4 mb-4 text-sm text-center text-green-700 bg-green-100 rounded-lg">{message}</div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* ID */}
              <div>
                <label htmlFor="id" className="block mb-2 text-sm font-medium text-gray-700">
                  ID
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  readOnly
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="closed">Closed</option>
                  <option value="on-going">On-Going</option>
                  <option value="stand-by">Stand-By</option>
                </select>
              </div>

              {/* Status Type */}
              <div>
                <label htmlFor="status_type" className="block mb-2 text-sm font-medium text-gray-700">
                  Status Type
                </label>
                <select
                  id="status_type"
                  name="status_type"
                  value={formData.status_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Status Type</option>
                  <option value="ok">OK</option>
                  <option value="no">NO</option>
                </select>
              </div>

              {/* Project Number */}
              <div>
                <label htmlFor="project_n" className="block mb-2 text-sm font-medium text-gray-700">
                  Project Number
                </label>
                <input
                  type="text"
                  id="project_n"
                  name="project_n"
                  value={formData.project_n}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Product Designation */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Product Designation</label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                  {productDesignations.map((pd) => (
                    <button
                      key={pd.id}
                      type="button"
                      onClick={() => toggleProductDesignation(pd.id)}
                      className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
                        formData.product_designation.includes(pd.id)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {pd.part_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                ></textarea>
              </div>

              {/* Customer */}
              <div>
                <label htmlFor="customer" className="block mb-2 text-sm font-medium text-gray-700">
                  Customer
                </label>
                <select
                  id="customer"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Initial Request */}
              <div>
                <label htmlFor="initial_request" className="block mb-2 text-sm font-medium text-gray-700">
                  Initial Request
                </label>
                <input
                  type="date"
                  id="initial_request"
                  name="initial_request"
                  value={formData.initial_request}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Technical Skill */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Technical Skill</label>
              <div className="flex gap-4">
                {["sc", "tc"].map((skill) => (
                  <label key={skill} className="flex items-center">
                    <input
                      type="radio"
                      name="technical_skill"
                      value={skill}
                      checked={formData.technical_skill === skill}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">{skill.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Request Original */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Request Original</label>
              <div className="flex gap-4">
                {["internal", "customer"].map((origin) => (
                  <label key={origin} className="flex items-center">
                    <input
                      type="radio"
                      name="request_original"
                      value={origin}
                      checked={formData.request_original === origin}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {origin.charAt(0).toUpperCase() + origin.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Process Steps */}
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Process Steps</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {[
                  "frasability",
                  "validation_for_offer",
                  "customer_offer",
                  "customer_order",
                  "ok_for_lunch",
                  "kick_off",
                  "design",
                  "facilities",
                  "p_p_tuning",
                  "process_qualif",
                ].map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="block mb-2 text-sm font-medium text-gray-700">
                      {field.replace(/_/g, " ")}
                    </label>
                    <select
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="F">F</option>
                      <option value="E">E</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Fields */}
            <div className="p-4 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Date Fields</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {["mlo", "tko", "cv", "pt1", "pt2", "sop", "ppap_submission_date", "closure", "next_review"].map(
                  (field) => (
                    <div key={field}>
                      <label htmlFor={field} className="block mb-2 text-sm font-medium text-gray-700">
                        {field.replace(/_/g, " ").toUpperCase()}
                      </label>
                      <input
                        type="date"
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* New field for Days Until PPAP Submission */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="ppap_submission_date" className="block mb-2 text-sm font-medium text-gray-700">
                  PPAP Submission Date
                </label>
                <input
                  type="date"
                  id="ppap_submission_date"
                  name="ppap_submission_date"
                  value={formData.ppap_submission_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="days_until_ppap_submission" className="block mb-2 text-sm font-medium text-gray-700">
                  Days Until PPAP Submission
                </label>
                <input
                  type="number"
                  id="days_until_ppap_submission"
                  name="days_until_ppap_submission"
                  value={formData.days_until_ppap_submission}
                  readOnly
                  className="w-full px-3 py-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none"
                />
              </div>
            </div>

            {/* PPAP Submitted Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ppap_submitted"
                name="ppap_submitted"
                checked={formData.ppap_submitted}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={formData.closure && new Date(formData.closure) < new Date()}
              />
              <label htmlFor="ppap_submitted" className="ml-2 text-sm font-medium text-gray-700">
                PPAP Submitted
                {formData.closure && new Date(formData.closure) < new Date() && (
                  <span className="ml-2 text-xs text-gray-500">(Auto-checked based on closure date)</span>
                )}
              </label>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block mb-2 text-sm font-medium text-gray-700">
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Mass Production"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ContactUs />
    </div>
  )
}

