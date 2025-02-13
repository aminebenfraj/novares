import React from "react";

const EngineeringChangeTable = () => {
  return (
    <div className="p-6">
      <div className="mb-6 overflow-hidden border border-gray-300 rounded-lg">
        <div className="flex items-center p-4 bg-gray-100">
          <img src="/novares-logo.png" alt="Novares" className="h-8 mr-4" />
          <h1 className="text-xl font-bold">BD-PM-D01-D Engineering and Contract Change - Check</h1>
        </div>
        
        {/* Details Section */}
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="p-4 border border-gray-200 bg-gray-50">
            <p><strong>Modification n°</strong>: 22_014</p>
            <p><strong>Project n°</strong>: B0084</p>
            <p><strong>Product designation</strong>: Lockarit SE380PA</p>
            <p><strong>Product reference</strong>: 5FA809957K / 5FA809958J</p>
            <p><strong>Customer</strong>: SEAT</p>
            <p><strong>Location</strong>: Igualada</p>
            <p><strong>Technical / Skill center</strong>: SC</p>
          </div>
          <div className="p-4 border border-gray-200 bg-gray-50">
            <p><strong>Type</strong>: Project / Business manager</p>
            <p><strong>Serial life</strong>: F. Puyol</p>
            <p><strong>Initial request</strong>: 08/03/22</p>
            <p><strong>Request origin</strong>: Customer</p>
            <p><strong>Ref client</strong>: 5FA809957K / 5FA809958J</p>
            <p><strong>Update</strong>: 08/06/24</p>
          </div>
        </div>
        
        {/* Modification Description */}
        <div className="p-4 border-t border-gray-200">
          <h2 className="text-lg font-bold">Modification Description</h2>
          <p>ÁKO LZ22199: Nueva geometría Lockarit para cableado PHEV</p>
          <img src="/modification-image.png" alt="Modification details" className="w-full mt-4" />
        </div>
        
        {/* Impact Section */}
        <div className="p-4 border-t border-gray-200">
          <p><strong>Impact on S/R characteristics:</strong> NO</p>
        </div>

        {/* Table Section */}
        <div className="p-4 border-t border-gray-200">
          <h2 className="text-lg font-bold">Timing Plan</h2>
          <table className="w-full mt-2 border border-collapse border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Timing Plan</th>
                <th className="p-2 border">Customer Review</th>
                <th className="p-2 border">PPAP Supplier</th>
                <th className="p-2 border">n.a.</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Decision", "S22/22", "5/16/2022", "PPAP (PT1) S18/23"],
                ["TKO", "S22/22", "PPAP (PT2)", "S41/23"],
                ["First part (VC)", "S10/23", "SOP", "S18/24"],
              ].map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border">{item[0]}</td>
                  <td className="p-2 border">{item[1]}</td>
                  <td className="p-2 border">{item[2]}</td>
                  <td className="p-2 border">{item[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EngineeringChangeTable;
