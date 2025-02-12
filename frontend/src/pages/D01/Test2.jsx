const Test2 = () => {
    return (
      <div className="flex justify-center p-6 bg-gray-100">
        <div className="bg-white shadow-lg p-6 rounded-md w-[900px] text-sm">
          <header className="flex justify-between pb-2 border-b">
            <h1 className="text-lg font-bold">BD-PM-D01-D Engineering and Contract Change - Check Lists</h1>
            <img src="/logo.png" alt="Company Logo" className="h-10" />
          </header>
  
          {/* Offer Request */}
          <section className="p-3 mt-4 border rounded-md">
            <h2 className="font-semibold text-md">Offer or Request for Agreement</h2>
            <div className="mt-2">
              <p>2-Chiffrage_Marge</p>
              <p>Lockarit New</p>
              <p>Tool_240122_Ind</p>
            </div>
          </section>
  
          {/* Plant Manager & Engineering Manager */}
          <section className="p-3 mt-4 border rounded-md">
            <h2 className="font-semibold text-md">Managers Approval</h2>
            <table className="w-full mt-2 text-sm border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-2 py-1 border">Role</th>
                  <th className="px-2 py-1 border">Name</th>
                  <th className="px-2 py-1 border">Approval</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1 border">Plant Manager</td>
                  <td className="px-2 py-1 border">J.R.Delgado</td>
                  <td className="px-2 py-1 border">OK</td>
                </tr>
                <tr>
                  <td className="px-2 py-1 border">Engineering Manager</td>
                  <td className="px-2 py-1 border">J.R.Delgado</td>
                  <td className="px-2 py-1 border">OK</td>
                </tr>
              </tbody>
            </table>
          </section>
  
          <footer className="mt-4 text-xs text-center text-gray-500">
            MECAPLAST Group - UNAUTHORIZED COPY
          </footer>
        </div>
      </div>
    );
  };
  
  export default Test2;
  