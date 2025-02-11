import { useState } from "react";

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
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Mass Production Form</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID */}
          <div>
            <label className="block text-gray-700">ID</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <label className="block text-gray-700">Status Type</label>
            <select
              name="status_type"
              value={formData.status_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Type</option>
              <option value="ok">OK</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Project Number */}
          <div>
            <label className="block text-gray-700">Project Number</label>
            <input
              type="text"
              name="project_n"
              value={formData.project_n}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Product Designation (Multi-Select) */}
          <div>
            <label className="block text-gray-700">Product Designation</label>
            <input
              type="text"
              name="product_designation"
              value={formData.product_designation}
              onChange={handleChange}
              placeholder="Enter Product IDs separated by commas"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          {/* Technical Skill */}
          <div>
            <label className="block text-gray-700">Technical Skill</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="technical_skill"
                  value="sc"
                  checked={formData.technical_skill === "sc"}
                  onChange={handleChange}
                  className="mr-2"
                />
                SC
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="technical_skill"
                  value="tc"
                  checked={formData.technical_skill === "tc"}
                  onChange={handleChange}
                  className="mr-2"
                />
                TC
              </label>
            </div>
          </div>

          {/* Initial Request Date */}
          <div>
            <label className="block text-gray-700">Initial Request</label>
            <input
              type="date"
              name="initial_request"
              value={formData.initial_request}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* PPAP Submitted Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="ppap_submitted"
              checked={formData.ppap_submitted}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="ml-2 text-gray-700">PPAP Submitted</label>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-gray-700">Comment</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
