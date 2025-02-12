"use client";

import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
      <button className="px-4 py-2 text-lg font-medium text-white transition-all duration-300 rounded-md hover:bg-white/20">
        {title}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 z-10 w-48 mt-2 rounded-lg shadow-lg bg-white/90 backdrop-blur-lg ring-1 ring-white ring-opacity-10"
          >
            <div className="py-2">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block px-4 py-2 text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full p-4 text-white shadow-lg bg-gray-900/80 backdrop-blur-lg">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Your App 🚀
        </Link>
        
        {/* Desktop Menu */}
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

        {/* Mobile Menu Toggle */}
        <button
          className="block p-2 md:hidden focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-4 mt-4 rounded-lg shadow-lg md:hidden bg-gray-900/90 backdrop-blur-lg"
          >
            <div className="flex flex-col space-y-3">
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
