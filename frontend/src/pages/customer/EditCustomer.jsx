import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById, updateCustomer } from "../../utils/apis/customerApi";
import { customerSchema } from "../../utils/customerValidation"; // ✅ Import Zod Schema
import { Navbar } from "../../components/Navbar"

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // ✅ Memoize `fetchCustomer` to prevent unnecessary re-creation
  const fetchCustomer = useCallback(async () => {
    if (!id) return; // Ensure ID is valid before making API call

    try {
      const response = await getCustomerById(id);
      setFormData(response);
    } catch (error) {
      console.error("Error fetching customer:", error);
      setServerError("Failed to load customer details.");
    }
  }, [id]); // ✅ `fetchCustomer` only depends on `id`

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]); // ✅ Fixes missing dependency issue

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    // ✅ Validate data using Zod
    const validationResult = customerSchema.safeParse(formData);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      setErrors(formattedErrors);
      return;
    }

    try {
      await updateCustomer(id, formData);
      navigate("/customers"); // ✅ Redirect to customer list
    } catch (error) {
      console.error("Error updating customer:", error);
      setServerError("Failed to update customer. Please try again.");
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-100">
      <Navbar />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Edit Customer</h2>

        {serverError && <p className="mb-4 text-sm text-center text-red-500">{serverError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name._errors[0]}</p>}
          </div>

          {/* Email (Disabled) */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              disabled // ✅ Email should not be editable
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email._errors[0]}</p>}
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone._errors[0]}</p>}
          </div>

          {/* Address */}
          <div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address._errors[0]}</p>}
          </div>

         
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 text-white transition bg-green-500 rounded-lg hover:bg-green-600"
          >
            Update Customer
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="w-full py-2 mt-2 text-white transition bg-gray-500 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
