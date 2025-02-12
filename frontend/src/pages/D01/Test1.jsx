const Test1 = () => {
    return (
      <div className="flex justify-center p-6 bg-gray-100">
        <div className="bg-white shadow-lg p-6 rounded-md w-[900px] text-sm">
          {/* Header */}
          <header className="flex justify-between pb-2 border-b">
            <h1 className="text-lg font-bold">BD-PM-D01-D Engineering and Contract Change - Check Lists</h1>
            <img src="/logo.png" alt="Company Logo" className="h-10" />
          </header>
  
          {/* Impact on Investment */}
          <section className="p-3 mt-4 border rounded-md">
            <h2 className="font-semibold text-md">Impact on Investment</h2>
            <table className="w-full mt-2 text-sm border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1 border">Description</th>
                  <th className="px-2 py-1 border">Cost</th>
                  <th className="px-2 py-1 border">Comments</th>
                  <th className="px-2 py-1 border">Sales Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border">Pre Study</td>
                  <td className="px-2 py-1 text-gray-500 border">CONFIDENTIAL</td>
                  <td className="px-2 py-1 text-gray-500 border">CONFIDENTIAL</td>
                  <td className="px-2 py-1 text-gray-500 border">CONFIDENTIAL</td>
                </tr>
              </tbody>
            </table>
          </section>
  
          {/* Validation for Offer */}
          <section className="p-3 mt-4 border rounded-md">
            <h2 className="font-semibold text-md">Validation for Offer</h2>
            <table className="w-full mt-2 text-sm border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1 border">Team Member</th>
                  <th className="px-2 py-1 border">Status</th>
                  <th className="px-2 py-1 border">Date</th>
                  <th className="px-2 py-1 border">Comment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border">Project Manager - F.Puyol</td>
                  <td className="px-2 py-1 border">OK</td>
                  <td className="px-2 py-1 border"></td>
                  <td className="px-2 py-1 border"></td>
                </tr>
              </tbody>
            </table>
          </section>
  
          {/* Footer */}
          <footer className="mt-4 text-xs text-center text-gray-500">
            MECAPLAST Group - UNAUTHORIZED COPY
          </footer>
        </div>
      </div>
    );
  };
  
  export default Test1;
  