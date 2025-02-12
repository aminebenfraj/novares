import { useEffect, useState, useCallback } from "react";
import { getAllCustomers, deleteCustomer } from "../../utils/apis/customerApi";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar"


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
    
    <div className="min-h-screen bg-gray-100">
      <Navbar />
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Customer List</h2>

        {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}

        {/* Add Customer Button */}
        <button
          onClick={() => navigate("/customers/create")}
          className="px-4 py-2 mb-4 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Add Customer
        </button>

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-600">Loading customers...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-collapse border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border border-gray-300">Name</th>
                  <th className="px-4 py-2 border border-gray-300">Email</th>
                  <th className="px-4 py-2 border border-gray-300">Phone</th>
                  <th className="px-4 py-2 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer._id} className="border border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2">{customer.name}</td>
                      <td className="px-4 py-2">{customer.email}</td>
                      <td className="px-4 py-2">{customer.phone}</td>
                      <td className="flex gap-4 px-4 py-2">
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
                    <td colSpan="4" className="py-4 text-center text-gray-600">
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
    </div>
  );
}
