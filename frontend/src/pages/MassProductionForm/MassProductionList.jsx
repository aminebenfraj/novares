"use client";

import { useState, useEffect } from "react";
import { getAllMassProductions, deleteMassProduction } from "../../utils/apis/massProductionApi";

export default function MassProductionList() {
  const [massProductions, setMassProductions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMassProductions();
  }, []);

  const fetchMassProductions = async () => {
    try {
      setIsLoading(true);
      const data = await getAllMassProductions();
      if (Array.isArray(data)) {
        setMassProductions(data);
      } else {
        console.error("Invalid response format:", data);
        setError("Invalid data received from server.");
      }
    } catch (error) {
      console.error("❌ Error fetching mass productions:", error);
      setError("Failed to load mass productions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteMassProduction(id);
        setMassProductions((prev) => prev.filter((mp) => mp._id !== id));
      } catch (error) {
        console.error("❌ Error deleting mass production:", error);
        alert("Failed to delete the entry. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container max-w-6xl p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Mass Production List</h1>
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm leading-normal text-gray-600 uppercase bg-gray-100">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Project Number</th>
                <th className="px-6 py-3 text-left">PPAP Submission Date</th>
                <th className="px-6 py-3 text-left">Days Until PPAP</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light text-gray-600">
              {massProductions.length > 0 ? (
                massProductions.map((mp) => (
                  <tr key={mp._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="px-6 py-3 text-left whitespace-nowrap">{mp.id || "N/A"}</td>
                    <td className="px-6 py-3 text-left">
                      <span className={`py-1 px-3 rounded-full text-xs ${getStatusColor(mp.status)}`}>
                        {mp.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-left">{mp.project_n || "N/A"}</td>
                    <td className="px-6 py-3 text-left">
                      {mp.ppap_submission_date
                        ? new Date(mp.ppap_submission_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-3 text-left">{mp.days_until_ppap_submission ?? "N/A"}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <a
                          href={`/mass-production-edit/${mp._id}`}
                          className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </a>
                        <button
                          onClick={() => handleDelete(mp._id)}
                          className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-3 text-center text-gray-500">
                    No mass production data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ✅ Function to get status color classes dynamically
function getStatusColor(status) {
  if (!status) return "bg-gray-200 text-gray-600"; // Handle undefined status safely

  switch (status.toLowerCase()) {
    case "on-going":
      return "bg-green-200 text-green-600";
    case "stand-by":
      return "bg-yellow-200 text-yellow-600";
    case "cancelled":
      return "bg-red-200 text-red-600";
    case "closed":
      return "bg-gray-200 text-gray-600";
    default:
      return "bg-blue-200 text-blue-600";
  }
}
