const Test4 = () => {
    return (
      <div className="flex justify-center p-6 bg-gray-100">
        <div className="bg-white shadow-lg p-6 rounded-md w-[900px] text-sm">
          
          {/* Header */}
          <header className="flex justify-between pb-2 border-b">
            <h1 className="text-lg font-bold">BD-PM-D01-D Engineering and Contract Change - Check Lists</h1>
            <img src="/logo.png" alt="Company Logo" className="h-10" />
          </header>
  
          {/* Product Information */}
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
              <div><strong>Request Origin:</strong> Customer</div>
            </div>
          </section>
  
          {/* Modification Description */}
          <section className="p-3 mt-4 border rounded-md">
            <h2 className="font-semibold text-md">Modification Description</h2>
            <p className="mt-2 text-sm">AKO LZ22199: Nueva geometría Lockarit para cableado PHEV</p>
          </section>
  
          {/* Timing Plan */}
          <section className="p-3 mt-4 border rounded-md">
            <h2 className="font-semibold text-md">Timing Plan</h2>
            <table className="w-full mt-2 text-sm border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1 border">Decision</th>
                  <th className="px-2 py-1 border">Planned</th>
                  <th className="px-2 py-1 border">Done</th>
                  <th className="px-2 py-1 border">Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border">Customer Review</td>
                  <td className="px-2 py-1 border">16/05/2022</td>
                  <td className="px-2 py-1 border">✔</td>
                  <td className="px-2 py-1 border">Confirmed</td>
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
  
          {/* Kick-Off Table */}
          <section className="p-3 mt-4 border rounded-md">
            <h2 className="font-semibold text-md">0 - KICK-OFF</h2>
            <table className="w-full mt-2 text-sm border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1 border">Task</th>
                  <th className="px-2 py-1 border">Responsible</th>
                  <th className="px-2 py-1 border">Planned</th>
                  <th className="px-2 py-1 border">Done</th>
                  <th className="px-2 py-1 border">Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border">Time schedule approved</td>
                  <td className="px-2 py-1 border">FPL</td>
                  <td className="px-2 py-1 border">S22/22</td>
                  <td className="px-2 py-1 border">13/05/22</td>
                  <td className="px-2 py-1 border">100%</td>
                </tr>
              </tbody>
            </table>
          </section>
  
          {/* Design Validation */}
          <section className="p-3 mt-4 border rounded-md">
            <h2 className="font-semibold text-md">1 - DESIGN</h2>
            <table className="w-full mt-2 text-sm border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1 border">Task</th>
                  <th className="px-2 py-1 border">Responsible</th>
                  <th className="px-2 py-1 border">Planned</th>
                  <th className="px-2 py-1 border">Done</th>
                  <th className="px-2 py-1 border">Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border">Validation with customer</td>
                  <td className="px-2 py-1 border">SDH</td>
                  <td className="px-2 py-1 border">S22/22</td>
                  <td className="px-2 py-1 border">08/03/23</td>
                  <td className="px-2 py-1 border">Confirmed</td>
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
  
  export default Test4;
  