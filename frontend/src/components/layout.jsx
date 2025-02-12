import { Link, useLocation } from "react-router-dom"
import { Home, Package, Users, FileText, LogIn, UserPlus } from "react-feather"

const navItems = [
  { path: "/", name: "Home", icon: Home },
  { path: "/pd", name: "Product Designation", icon: Package },
  { path: "/pd/create", name: "Create PD", icon: FileText },
  { path: "/masspd", name: "Mass Production", icon: Package },
  { path: "/customers", name: "Customers", icon: Users },
  { path: "/login", name: "Login", icon: LogIn },
  { path: "/register", name: "Register", icon: UserPlus },
]

const Layout = ({ children }) => {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Your App</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200 ${
                location.pathname === item.path ? "bg-gray-100 text-gray-800" : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container px-6 py-8 mx-auto">{children}</div>
      </main>
    </div>
  )
}

export default Layout

