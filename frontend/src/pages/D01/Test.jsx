const Test = () => {
  return (
    <div className="flex justify-center p-6 bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-md w-[900px] text-sm">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b">
          <h1 className="text-lg font-bold">BD-PM-D01-D Engineering and Contract Change - Check Lists</h1>
          <img src="/logo.png" alt="Company Logo" className="h-10" />
        </div>

        {/* Product Details Section */}
        <section className="p-3 mt-4 border rounded-md">
          <h2 className="font-semibold text-md">Product Information</h2>
          <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
            <div><strong>Modification No:</strong> 22_014</div>
            <div><strong>Project No:</strong> B0084</div>
            <div><strong>Designation:</strong> Lockarit SE380PA</div>
            <div><strong>Product Reference:</strong> 5FA809957K / 5FA809958J</div>
            <div><strong>Customer:</strong> SEAT</div>
            <div><strong>Location:</strong> Igualada</div>
            <div><strong>Technical Center:</strong> SC</div>
            <div><strong>Type:</strong> Update</div>
            <div><strong>Serial Life:</strong> F.Puyol</div>
            <div><strong>Request Origin:</strong> Customer</div>
            <div><strong>Client Ref:</strong> 5FA809957K / 5FA809958J</div>
          </div>
        </section>

        {/* Modification Description */}
        <section className="p-3 mt-4 border rounded-md">
          <h2 className="font-semibold text-md">Modification Description</h2>
          <p className="mt-2 text-sm">
            AKO LZ22199: Nueva geometría Lockarit para cableado PHEV
          </p>
          <div className="flex justify-between mt-2">
            <img src="/image1.png" alt="Before" className="h-20 border" />
            <img src="/image2.png" alt="After" className="h-20 border" />
          </div>
        </section>

        {/* Timing Plan Table */}
        <section className="p-3 mt-4 border rounded-md">
          <h2 className="font-semibold text-md">Timing Plan</h2>
          <table className="w-full mt-2 text-sm border">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-2 py-1 border">Decision</th>
                <th className="px-2 py-1 border">Date</th>
                <th className="px-2 py-1 border">Type</th>
                <th className="px-2 py-1 border">Approval</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 border">S22/22</td>
                <td className="px-2 py-1 border">10/23</td>
                <td className="px-2 py-1 border">PPAP</td>
                <td className="px-2 py-1 border">Customer</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Economic Impact */}
        <section className="p-3 mt-4 border rounded-md">
          <h2 className="font-semibold text-md">Economic Impact</h2>
          <table className="w-full mt-2 text-sm border">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-2 py-1 border">Before</th>
                <th className="px-2 py-1 border">After</th>
                <th className="px-2 py-1 border">Delta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 text-gray-500 border">CONFIDENTIAL</td>
                <td className="px-2 py-1 text-gray-500 border">CONFIDENTIAL</td>
                <td className="px-2 py-1 text-gray-500 border">CONFIDENTIAL</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Impact on Part Price */}
        <section className="p-3 mt-4 border rounded-md">
          <h2 className="font-semibold text-md">Impact on Part Price</h2>
          <table className="w-full mt-2 text-sm border">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-2 py-1 border">Aspect</th>
                <th className="px-2 py-1 border">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 border">Raw Material - Type</td>
                <td className="px-2 py-1 border">Yes</td>
              </tr>
              <tr>
                <td className="px-2 py-1 border">Raw Material - Quantity</td>
                <td className="px-2 py-1 border">No</td>
              </tr>
              <tr>
                <td className="px-2 py-1 border">Packaging</td>
                <td className="px-2 py-1 border">No</td>
              </tr>
              <tr>
                <td className="px-2 py-1 border">Injection Cycle Time</td>
                <td className="px-2 py-1 border">Yes</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <div className="mt-4 text-xs text-center text-gray-500">
          MECAPLAST Group - UNAUTHORIZED COPY
        </div>
      </div>
    </div>
  );
};

export default Test;
