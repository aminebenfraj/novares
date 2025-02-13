import React from "react";

const ImpactTable = () => {
  return (
    <div className="p-6">
      {/* Impact on Part Price Section */}
      <div className="mb-6 overflow-hidden border border-gray-300 rounded-lg">
        <h2 className="p-2 text-lg font-bold bg-gray-200">IMPACT on PART PRICE</h2>
        <table className="w-full border border-collapse border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Cost</th>
              <th className="p-2 border">Comments</th>
              <th className="p-2 border">Sales price</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Product", "Yes"],
              ["Raw material - typ", "No"],
              ["Raw material - qty / volume or surface", "Yes"],
              ["Packaging", "No"],
              ["Purchased part", "No"],
              ["...", ""],
              ["Injection cycle time", "Yes"],
              ["Moulding labor (%)", "No"],
              ["Press size", "No"],
              ["Assembly, finishing, paint cycle time", "No"],
              ["Assembly, finishing, paint labor (%)", "No"],
              ["PPM level", "No"],
              ["...", ""]
            ].map((item, index) => (
              <tr key={index}>
                <td className="p-2 border">{item[0]}</td>
                <td className="p-2 border">{item[1]}</td>
                {index === 5 ? (
                  <td colSpan="2" className="p-2 font-bold text-center bg-gray-300 border">
                    CONFIDENTIAL
                  </td>
                ) : (
                  <>
                    <td className="p-2 border"></td>
                    <td className="p-2 border"></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Impact on Investment Section */}
      <div className="overflow-hidden border border-gray-300 rounded-lg">
        <h2 className="p-2 text-lg font-bold bg-gray-200">IMPACT on INVESTMENT</h2>
        <table className="w-full border border-collapse border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Cost</th>
              <th className="p-2 border">Comments</th>
              <th className="p-2 border">Sales price</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Pre study", "Yes"],
              ["Project management", "Yes"],
              ["Study / Design", "Yes"],
              ["CAE", "Yes"],
              ["Design", "Yes"],
              ["Monitoring", "Yes"],
              ["Measurement (metrology)", "Yes"],
              ["Validation", "Yes"],
              ["Molds", "Yes"],
              ["Special machines", "Yes"],
              ["Checking fixture", "Yes"],
              ["Equipment (painting, prehension...)", "No"],
              ["Run (for validation)", "Yes"],
              ["Stock / production coverage", "Yes"],
              ["IS presentation", "Yes"],
              ["Documentation update", "Yes"],
              ["...", ""]
            ].map((item, index) => (
              <tr key={index}>
                <td className="p-2 border">{item[0]}</td>
                <td className="p-2 border">{item[1]}</td>
                {index === 5 ? (
                  <td colSpan="2" className="p-2 font-bold text-center bg-gray-300 border">
                    CONFIDENTIAL
                  </td>
                ) : (
                  <>
                    <td className="p-2 border"></td>
                    <td className="p-2 border"></td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImpactTable;
