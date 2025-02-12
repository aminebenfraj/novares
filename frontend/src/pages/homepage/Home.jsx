import { Link } from "react-router-dom"

export const Home = () => {
  return (
    <div className="text-center">
      <h1 className="mb-8 text-4xl font-bold text-gray-800">Welcome to Your App</h1>
      <p className="mb-8 text-xl text-gray-600">Manage your products and customers with ease.</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/pd" className="p-6 transition-shadow duration-200 bg-white rounded-lg shadow-md hover:shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Product Designation</h2>
          <p className="text-gray-600">View and manage your product designations.</p>
        </Link>
        <Link
          to="/customers"
          className="p-6 transition-shadow duration-200 bg-white rounded-lg shadow-md hover:shadow-lg"
        >
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Customers</h2>
          <p className="text-gray-600">Manage your customer database.</p>
        </Link>
        <Link to="/masspd" className="p-6 transition-shadow duration-200 bg-white rounded-lg shadow-md hover:shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Mass Production</h2>
          <p className="text-gray-600">Handle mass production forms and data.</p>
        </Link>
      </div>
    </div>
  )
}

