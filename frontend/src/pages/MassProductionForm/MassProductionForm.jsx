"use client"

import { useState, useEffect } from "react"
import { getAllCustomers } from "../../utils/apis/customerApi"
import { getAllpd } from "../../utils/apis/ProductDesignation-api"
import { createMassProduction } from "../../utils/apis/massProductionApi"

export default function MassProductionForm() {
  const [formData, setFormData] = useState({
    id: "",
    status: "",
    status_type: "",
    project_n: "",
    product_designation: "",
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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllCustomers()
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customers:", error))

    getAllpd()
      .then((data) => setProductDesignations(data))
      .catch((error) => console.error("Error fetching product designations:", error))
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await createMassProduction(formData)
      setMessage("Mass production created successfully!")
      setFormData({ ...formData, id: "" }) // Reset form if needed
    } catch (error) {
      console.error("Error creating mass production:", error)
      setMessage(error.response?.data?.message || "Error creating mass production. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-blue-800">Mass Production Form</h2>

        {message && (
          <div className="p-4 mb-4 text-sm text-center text-green-700 bg-green-100 rounded-lg">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* ID */}
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-700">ID</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block mb-2 text-sm font-medium text-blue-700">Status Type</label>
              <select
                name="status_type"
                value={formData.status_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Status Type</option>
                <option value="ok">OK</option>
                <option value="no">NO</option>
              </select>
            </div>

            {/* Project Number */}
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-700">Project Number</label>
              <input
                type="text"
                name="project_n"
                value={formData.project_n}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Product Designation */}
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-700">Product Designation</label>
              <select
                name="product_designation"
                value={formData.product_designation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Product</option>
                {productDesignations.map((pd) => (
                  <option key={pd.id} value={pd.id}>
                    {pd.part_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-blue-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              ></textarea>
            </div>

            {/* Customer */}
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-700">Customer</label>
              <select
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block mb-2 text-sm font-medium text-blue-700">Initial Request</label>
              <input
                type="date"
                name="initial_request"
                value={formData.initial_request}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Technical Skill */}
          <div>
            <label className="block mb-2 text-sm font-medium text-blue-700">Technical Skill</label>
            <div className="flex gap-4">
              {["sc", "tc"].map((skill) => (
                <label key={skill} className="flex items-center">
                  <input
                    type="radio"
                    name="technical_skill"
                    value={skill}
                    checked={formData.technical_skill === skill}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-blue-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-blue-700">{skill.toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Request Original */}
          <div>
            <label className="block mb-2 text-sm font-medium text-blue-700">Request Original</label>
            <div className="flex gap-4">
              {["internal", "customer"].map((origin) => (
                <label key={origin} className="flex items-center">
                  <input
                    type="radio"
                    name="request_original"
                    value={origin}
                    checked={formData.request_original === origin}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-blue-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-blue-700">
                    {origin.charAt(0).toUpperCase() + origin.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Process Steps */}
          <div className="p-4 bg-blue-100 rounded-lg">
            <h3 className="mb-4 text-lg font-semibold text-blue-800">Process Steps</h3>
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
                  <label className="block mb-2 text-sm font-medium text-blue-700">{field.replace(/_/g, " ")}</label>
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="p-4 bg-blue-100 rounded-lg">
            <h3 className="mb-4 text-lg font-semibold text-blue-800">Date Fields</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {["mlo", "tko", "cv", "pt1", "pt2", "sop", "ppap_submission_date", "closure", "next_review"].map(
                (field) => (
                  <div key={field}>
                    <label className="block mb-2 text-sm font-medium text-blue-700">
                      {field.replace(/_/g, " ").toUpperCase()}
                    </label>
                    <input
                      type="date"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          {/* New field for Days Until PPAP Submission */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-700">PPAP Submission Date</label>
              <input
                type="date"
                name="ppap_submission_date"
                value={formData.ppap_submission_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-blue-700">Days Until PPAP Submission</label>
              <input
                type="number"
                name="days_until_ppap_submission"
                value={formData.days_until_ppap_submission}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 border border-blue-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* PPAP Submitted Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="ppap_submitted"
              checked={formData.ppap_submitted}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
              disabled={formData.closure && new Date(formData.closure) < new Date()}
            />
            <label className="ml-2 text-sm font-medium text-blue-700">
              PPAP Submitted
              {formData.closure && new Date(formData.closure) < new Date() && (
                <span className="ml-2 text-xs text-gray-500">(Auto-checked based on closure date)</span>
              )}
            </label>
          </div>

          {/* Comment */}
          <div>
            <label className="block mb-2 text-sm font-medium text-blue-700">Comment</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  )
}

