"use client"

import { useState, useEffect } from "react"
import { getAllMassProductions, deleteMassProduction } from "../../utils/apis/massProductionApi"
import { Navbar } from "../../components/Navbar"
import ContactUs from "../../components/ContactUs";

export default function MassProductionList() {
  const [massProductions, setMassProductions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    fetchMassProductions()
  }, [])

  const fetchMassProductions = async () => {
    try {
      setIsLoading(true)
      const data = await getAllMassProductions()
      if (Array.isArray(data)) {
        setMassProductions(data)
      } else {
        console.error("Invalid response format:", data)
        setError("Invalid data received from server.")
      }
    } catch (error) {
      console.error("❌ Error fetching mass productions:", error)
      setError("Failed to load mass productions. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteMassProduction(id)
        setMassProductions((prev) => prev.filter((mp) => mp._id !== id))
        setSelectedItem(null)
      } catch (error) {
        console.error("❌ Error deleting mass production:", error)
        alert("Failed to delete the entry. Please try again.")
      }
    }
  }

  const openModal = (item) => {
    setSelectedItem(item)
    setTimeout(() => setIsModalVisible(true), 50) // Slight delay to ensure DOM update
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setTimeout(() => setSelectedItem(null), 300) // Wait for animation to finish
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-32 h-32 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">{error}</div>
  }

  return (
  <div className="min-h-screen bg-gray-100">
      <Navbar />
    <div className="min-h-screen bg-gray-100">
      <div className="container px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Mass Production List</h1>
        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Project Number", "Status", "PPAP Submission Date", "Actions"].map((header) => (
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
                {massProductions.map((mp) => (
                  <tr
                    key={mp._id}
                    className="transition duration-150 ease-in-out cursor-pointer hover:bg-gray-50"
                    onClick={() => openModal(mp)}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{mp.id || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{mp.project_n || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(mp.status)}`}
                      >
                        {mp.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {mp.ppap_submission_date ? new Date(mp.ppap_submission_date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(mp._id)
                        }}
                        className="text-red-600 transition duration-150 ease-in-out hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedItem && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center transition-opacity duration-300 ${isModalVisible ? "opacity-100" : "opacity-0"}`}
          onClick={closeModal}
        >
          <div
            className={`relative bg-white w-full max-w-4xl mx-auto rounded-lg shadow-xl transition-all duration-300 ${isModalVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Mass Production Details</h3>
              <button onClick={closeModal} className="text-gray-400 transition-colors duration-150 hover:text-gray-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Section title="General Information">
                  <DetailItem label="ID" value={selectedItem.id} />
                  <DetailItem label="Project Number" value={selectedItem.project_n} />
                  <DetailItem label="Status" value={selectedItem.status} />
                  <DetailItem label="Status Type" value={selectedItem.status_type} />
                  <DetailItem label="Description" value={selectedItem.description} />
                  <DetailItem label="Customer" value={selectedItem.customer?.username} />
                  <DetailItem label="Technical Skill" value={selectedItem.technical_skill} />
                </Section>

                <Section title="Dates">
                  <DetailItem label="Initial Request" value={formatDate(selectedItem.initial_request)} />
                  <DetailItem label="PPAP Submission" value={formatDate(selectedItem.ppap_submission_date)} />
                  <DetailItem label="Closure" value={formatDate(selectedItem.closure)} />
                  <DetailItem label="Next Review" value={formatDate(selectedItem.next_review)} />
                  <DetailItem label="MLO" value={formatDate(selectedItem.mlo)} />
                  <DetailItem label="TKO" value={formatDate(selectedItem.tko)} />
                  <DetailItem label="CV" value={formatDate(selectedItem.cv)} />
                  <DetailItem label="PT1" value={formatDate(selectedItem.pt1)} />
                  <DetailItem label="PT2" value={formatDate(selectedItem.pt2)} />
                  <DetailItem label="SOP" value={formatDate(selectedItem.sop)} />
                </Section>

                <Section title="Process Information">
                  <DetailItem label="Request Original" value={selectedItem.request_original} />
                  <DetailItem label="Frasability" value={selectedItem.frasability} />
                  <DetailItem label="Validation for Offer" value={selectedItem.validation_for_offer} />
                  <DetailItem label="Customer Offer" value={selectedItem.customer_offer} />
                  <DetailItem label="Customer Order" value={selectedItem.customer_order} />
                  <DetailItem label="OK for Lunch" value={selectedItem.ok_for_lunch} />
                  <DetailItem label="Kick Off" value={selectedItem.kick_off} />
                  <DetailItem label="Design" value={selectedItem.design} />
                  <DetailItem label="Facilities" value={selectedItem.facilities} />
                  <DetailItem label="P&P Tuning" value={selectedItem.p_p_tuning} />
                  <DetailItem label="Process Qualification" value={selectedItem.process_qualif} />
                </Section>
              </div>

              <Section title="Additional Information" className="mt-6">
                <DetailItem label="PPAP Submitted" value={selectedItem.ppap_submitted ? "Yes" : "No"} />
                <DetailItem label="Days Until PPAP Submission" value={selectedItem.days_until_ppap_submission} />
                {selectedItem.comment && (
                  <div className="mt-4">
                    <h4 className="mb-1 text-sm font-medium text-gray-500">Comment</h4>
                    <p className="text-sm text-gray-900">{selectedItem.comment}</p>
                  </div>
                )}
              </Section>
            </div>
            <div className="px-4 py-3 rounded-b-lg bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white transition-colors duration-150 bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
    <ContactUs />
  </div>
  )
}

function Section({ title, children, className = "" }) {
  return (
    <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
      <h4 className="mb-3 text-lg font-semibold text-gray-700">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || "N/A"}</dd>
    </div>
  )
}

function formatDate(dateString) {
  return dateString ? new Date(dateString).toLocaleDateString() : "N/A"
}

function getStatusColor(status) {
  if (!status) return "bg-gray-100 text-gray-800"

  switch (status.toLowerCase()) {
    case "on-going":
      return "bg-green-100 text-green-800"
    case "stand-by":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    case "closed":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-blue-100 text-blue-800"
  }
}

