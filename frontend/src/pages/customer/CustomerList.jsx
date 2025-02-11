import { useEffect, useState, useCallback } from "react";
import { getAllCustomers, deleteCustomer } from "../../utils/apis/customerApi";
import { useNavigate } from "react-router-dom";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Memoized fetchCustomers function to avoid unnecessary re-renders
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllCustomers();
      setCustomers(response);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer._id !== id));
      } catch (error) {
        console.error("Error deleting customer:", error);
        setError("Failed to delete customer.");
      }
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer List</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {/* Add Customer Button */}
        <button
          onClick={() => navigate("/customers/create")}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Add Customer
        </button>

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-600">Loading customers...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Phone</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer._id} className="border border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2">{customer.name}</td>
                      <td className="px-4 py-2">{customer.email}</td>
                      <td className="px-4 py-2">{customer.phone}</td>
                      <td className="px-4 py-2 flex gap-4">
                        <button
                          onClick={() => navigate(`/customers/edit/${customer._id}`)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-600 py-4">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
