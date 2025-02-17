"use client"

import { useState, useEffect } from "react"
import { getAllCustomers } from "../../utils/apis/customerApi"
import { getAllpd } from "../../utils/apis/ProductDesignation-api"
import { createMassProduction } from "../../utils/apis/massProductionApi"
import { Navbar } from "../../components/Navbar"
import ContactUs from "../../components/ContactUs"

export default function MassProductionForm() {
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
  })

  const [customers, setCustomers] = useState([]);
  const [productDesignations, setProductDesignations] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllCustomers()
      .then((data) => {
        console.log("🔍 Customers API Response:", data); // ✅ Debugging
        setCustomers(data);
      })
      .catch((error) => console.error("❌ Error fetching customers:", error));
  
    getAllpd()
      .then((data) => setProductDesignations(data))
      .catch((error) => console.error("❌ Error fetching product designations:", error));
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value

    if (name === "closure") {
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
    e.preventDefault();
  
    console.log("🔍 Submitting Mass Production Data:", formData); // ✅ Debugging log
  
    try {
      const response = await createMassProduction({
        ...formData,
        assignedRole: formData.assignedRole || "Manager", // ✅ Ensure a default role
        assignedEmail: formData.assignedEmail || "mohamedamine.benfredj@polytechnicien.tn" // ✅ Ensure a default email
      });
  
      console.log("✅ Mass Production Created:", response);
      alert("Mass Production task created successfully!");
    } catch (error) {
      console.error("❌ Error creating Mass Production:", error.response?.data || error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Create Mass Production</h1>
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
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select Customer</option>
      {customers.map((customer) => (
        <option key={customer._id} value={customer._id}>
          {customer.username}
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

            {/* PPAP Submission Date and Days Until PPAP Sub Date */}
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
                <label htmlFor="days_until_ppap_sub_date" className="block mb-2 text-sm font-medium text-gray-700">
                  Days Until PPAP Sub Date
                </label>
                <input
                  type="text"
                  id="days_until_ppap_sub_date"
                  name="days_until_ppap_sub_date"
                  value={
                    formData.ppap_submission_date
                      ? new Date(formData.ppap_submission_date) > new Date()
                        ? "ok"
                        : "no"
                      : "no"
                  }
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
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ContactUs />
    </div>
  )
}

