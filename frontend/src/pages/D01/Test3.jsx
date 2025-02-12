const Test3 = () => {
  return (
    <div className="max-w-5xl p-6 mx-auto bg-white border shadow-md">
      {/* Header */}
      <div className="pb-4 mb-4 border-b">
        <h1 className="text-xl font-bold">BD-PM-D01-D Engineering and Contract Change - Check List</h1>
        <div className="grid grid-cols-2 mt-2 text-sm">
          <div>
            <p><strong>Modification n°:</strong> 22_014</p>
            <p><strong>Project n°:</strong> B0084</p>
            <p><strong>Product designation:</strong> Lockart SE380PA</p>
            <p><strong>Product reference:</strong> 5FA809957K / 5FA809958J</p>
          </div>
          <div>
            <p><strong>Customer:</strong> SEAT</p>
            <p><strong>Location:</strong> Igualada</p>
            <p><strong>Type:</strong> Serial life</p>
            <p><strong>Request origin:</strong> Customer</p>
          </div>
        </div>
      </div>
      
      {/* Modification Description */}
      <div className="mb-4 text-sm">
        <p><strong>Modification description:</strong> AKO LZ22199: Nueva geometría Lockart para cableado PHEV</p>
        <p><strong>Impact on S/R characteristics:</strong> NO</p>
      </div>
      
      {/* Timing Plan Table */}
      <table className="w-full text-sm border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-2 py-1 border">Timing Plan</th>
            <th className="px-2 py-1 border">Planned</th>
            <th className="px-2 py-1 border">Done</th>
            <th className="px-2 py-1 border">Comments</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-2 py-1 border">Decision</td>
            <td className="px-2 py-1 border">S22/22</td>
            <td className="px-2 py-1 border">-</td>
            <td className="px-2 py-1 border">-</td>
          </tr>
          <tr>
            <td className="px-2 py-1 border">TKO</td>
            <td className="px-2 py-1 border">S22/22</td>
            <td className="px-2 py-1 border">-</td>
            <td className="px-2 py-1 border">-</td>
          </tr>
        </tbody>
      </table>

      {/* Design Table */}
      <h2 className="mt-6 text-lg font-bold">1 - DESIGN</h2>
      <table className="w-full mt-2 text-sm border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-2 py-1 border">Task</th>
            <th className="px-2 py-1 border">Responsible</th>
            <th className="px-2 py-1 border">Planned</th>
            <th className="px-2 py-1 border">Done</th>
            <th className="px-2 py-1 border">Comments</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-2 py-1 border">Modification of checking fixtures / Updating of file</td>
            <td className="px-2 py-1 border">SDH</td>
            <td className="px-2 py-1 border">S22/22</td>
            <td className="px-2 py-1 border">08/03/23</td>
            <td className="px-2 py-1 border">Modificado con nuevo punto de fijación</td>
          </tr>
          <tr>
            <td className="px-2 py-1 border">Modification of tools</td>
            <td className="px-2 py-1 border">MMA / Moldit</td>
            <td className="px-2 py-1 border">S22/22</td>
            <td className="px-2 py-1 border">08/03/23</td>
            <td className="px-2 py-1 border">Utillaje en Moldit (Portugal)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Test3;
