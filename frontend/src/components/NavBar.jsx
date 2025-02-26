
import { useState, useCallback, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, ChevronDown, Menu, X } from "lucide-react"

const NavItem = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleMouseEnter = useCallback(() => setIsOpen(true), [])
  const handleMouseLeave = useCallback(() => setIsOpen(false), [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") setIsOpen((prev) => !prev)
    if (e.key === "Escape") setIsOpen(false)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={dropdownRef}>
      <button
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 rounded-md hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        {title}
        <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute left-0 z-10 w-48 bg-white rounded-md shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="py-2">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block px-4 py-2 text-sm text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <header className="bg-white shadow-md">
      <div className="w-full max-w-[1180px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/">
              <img src="/novares-logo.webp" alt="Novares" className="w-auto h-10" />
            </Link>
            <nav className="hidden space-x-6 md:flex">
              <NavItem
                title="Products"
                links={[
                  { to: "/pd", label: "View Products" },
                  { to: "/pd/create", label: "Create Product" },
                ]}
              />
              <NavItem
                title="Mass Production"
                links={[
                  { to: "/masspd", label: "View Mass Production" },
                  { to: "/masspd/create", label: "Create Mass Production" },
                ]}
              />
              <NavItem
                title="Administration"
                links={[
                  { to: "/admin", label: "User Management" },
                  { to: "/admin/create-user", label: "Create User" },
                ]}
              />
              <NavItem
                title="Tests"
                links={[
                  { to: "/test", label: "Test" },
                  { to: "/test1", label: "Test 1" },
                  { to: "/test2", label: "Test 2" },
                  { to: "/test3", label: "Test 3" },
                  { to: "/test4", label: "Test 4" },
                ]}
              />
            </nav>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative flex items-center">
              <button
                className="mr-2 text-gray-600 transition-colors duration-200 hover:text-primary"
                onClick={toggleSearch}
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5" />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
                } overflow-hidden`}
              >
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  aria-label="Search input"
                />
              </div>
            </div>
            <NavItem
              title="Account"
              links={[
                { to: "/login", label: "Login" },
                { to: "/register", label: "Register" },
              ]}
            />
          </div>

          <button className="block md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>
      </div>

      <div
        className={`absolute left-0 w-full bg-white px-6 py-4 transition-all duration-300 ${
          menuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        } md:hidden shadow-md`}
      >
        <div className="flex flex-col space-y-4">
          <Link to="/pd" className="text-sm font-medium text-gray-700 hover:text-primary">
            Products
          </Link>
          <Link to="/masspd" className="text-sm font-medium text-gray-700 hover:text-primary">
            Mass Production
          </Link>
          <Link to="/admin" className="text-sm font-medium text-gray-700 hover:text-primary">
            User Management
          </Link>
          <Link to="/test" className="text-sm font-medium text-gray-700 hover:text-primary">
            Tests
          </Link>
          <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary">
            Login
          </Link>
          <Link to="/register" className="text-sm font-medium text-gray-700 hover:text-primary">
            Register
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar

