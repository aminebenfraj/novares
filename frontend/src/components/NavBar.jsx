"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, ChevronDown, Menu, Bell } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../../src/components/ui/button"
import { Input } from "../../src/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../src/components/ui/avatar"

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

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
        transition={{ duration: 0.2 }}
        className={`absolute left-0 z-10 w-48 bg-white rounded-md shadow-lg ${isOpen ? "" : "pointer-events-none"}`}
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
      </motion.div>
    </div>
  )
}

export const Navbar = ({ toggleSidebar }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <header className="bg-white shadow-md">
      <div className="w-full max-w-[1180px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </Button>
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
            <motion.div
              className="relative flex items-center"
              initial={false}
              animate={{ width: isSearchOpen ? "auto" : "40px" }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-gray-600 transition-colors duration-200 hover:text-primary"
                onClick={toggleSearch}
                aria-label="Toggle search"
              >
                <Search className="w-5 h-5" />
              </Button>
              <motion.div
                initial={false}
                animate={{ width: isSearchOpen ? "200px" : "0px", opacity: isSearchOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  aria-label="Search input"
                />
              </motion.div>
            </motion.div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

