import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-gray-100">
      <Navbar />
      <div className="container px-6 py-16 mx-auto text-center">
        <h1 className="mb-8 text-5xl font-bold text-gray-900 animate-fade-in-down">
          Welcome to Your App
        </h1>
        <p className="mb-12 text-xl text-gray-700 animate-fade-in-up">
          Manage your products and customers with ease.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/pd"
            className="overflow-hidden transition-all duration-300 transform bg-white shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-blue-300"
          >
            <div className="p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Product Designation</h2>
              <p className="text-gray-600">View and manage your product designations.</p>
            </div>
            <div className="h-2 bg-blue-500"></div>
          </Link>
          <Link
            to="/customers"
            className="overflow-hidden transition-all duration-300 transform bg-white shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-green-300"
          >
            <div className="p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Customers</h2>
              <p className="text-gray-600">Manage your customer database.</p>
            </div>
            <div className="h-2 bg-green-500"></div>
          </Link>
          <Link
            to="/masspd"
            className="overflow-hidden transition-all duration-300 transform bg-white shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-purple-300"
          >
            <div className="p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">Mass Production</h2>
              <p className="text-gray-600">Handle mass production forms and data.</p>
            </div>
            <div className="h-2 bg-purple-500"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};
