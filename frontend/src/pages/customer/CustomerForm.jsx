import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../../utils/apis/customerApi";
import { customerSchema } from "../../utils/customerValidation"; // ✅ Import Zod Schema

export default function CustomerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",});

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

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
      await createCustomer(formData);
      navigate("/customers"); // Redirect to customer list
    } catch (error) {
      console.error("Error creating customer:", error);
      setServerError("Failed to create customer. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Add Customer</h2>

        {serverError && <p className="mb-4 text-sm text-center text-red-500">{serverError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email._errors[0]}</p>}
          </div>

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
          <button
            type="submit"
            className="w-full py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Add Customer
          </button>

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
  );
}
