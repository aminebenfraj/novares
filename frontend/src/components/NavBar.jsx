"use client";

import { useState, useCallback } from "react";
import { Link } from "react-router-dom";

// Dropdown Nav Item
const NavItem = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = useCallback(() => setIsOpen(true), []);
  const handleMouseLeave = useCallback(() => setIsOpen(false), []);
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" || e.key === " ") setIsOpen((prev) => !prev);
    if (e.key === "Escape") setIsOpen(false);
  }, []);

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={() => setIsOpen(false)}
    >
      <button className="px-4 py-2 text-sm font-medium text-white transition-all duration-300 rounded-md hover:bg-white/20">
        {title}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute left-0 z-10 w-48 mt-2 bg-white rounded-md shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-2">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block px-4 py-2 text-sm text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="z-50 flex items-center w-full h-16 text-white bg-gray-900 shadow-md">
        <div className="container flex items-center justify-between px-4 mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center text-xl font-bold">
            Your App 🚀
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden space-x-6 md:flex">
            <NavItem
              title="Products"
              links={[
                { to: "/pd", label: "View Products" },
                { to: "/pd/create", label: "Create Product" },
              ]}
            />
            <NavItem
              title="Customers"
              links={[
                { to: "/customers", label: "View Customers" },
                { to: "/customers/create", label: "Create Customer" },
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
              title="Account"
              links={[
                { to: "/login", label: "Login" },
                { to: "/register", label: "Register" },
              ]}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="block md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="text-white w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute top-16 left-0 w-full bg-gray-900 text-white px-4 py-3 transition-all duration-300 ${
          menuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        } md:hidden shadow-md`}
      >
        <div className="flex flex-col space-y-2">
          <Link to="/pd" className="py-2 text-sm font-medium hover:text-gray-300">
            View Products
          </Link>
          <Link to="/pd/create" className="py-2 text-sm font-medium hover:text-gray-300">
            Create Product
          </Link>
          <Link to="/customers" className="py-2 text-sm font-medium hover:text-gray-300">
            View Customers
          </Link>
          <Link to="/customers/create" className="py-2 text-sm font-medium hover:text-gray-300">
            Create Customer
          </Link>
          <Link to="/masspd" className="py-2 text-sm font-medium hover:text-gray-300">
            View Mass Production
          </Link>
          <Link to="/masspd/create" className="py-2 text-sm font-medium hover:text-gray-300">
            Create Mass Production
          </Link>
          <Link to="/login" className="py-2 text-sm font-medium hover:text-gray-300">
            Login
          </Link>
          <Link to="/register" className="py-2 text-sm font-medium hover:text-gray-300">
            Register
          </Link>
        </div>
      </div>

      {/* Ensures Navbar doesn't overlap content */}
      <main className="px-4 pt-16">
        {/* Your page content goes here */}
      </main>
    </>
  );
};
