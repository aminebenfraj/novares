"use client";

import { useState, useCallback } from "react";
import { Link } from "react-router-dom";

const NavItem = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = useCallback(() => setIsOpen(true), []);
  const handleMouseLeave = useCallback(() => setIsOpen(false), []);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") setIsOpen((prev) => !prev);
      if (e.key === "Escape") setIsOpen(false);
    },
    []
  );

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={() => setIsOpen(false)}
    >
      <button
        className="px-3 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-md hover:bg-gray-700"
      >
        {title}
      </button>
      {isOpen && (
        <div className="absolute left-0 z-10 w-48 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="block px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Navbar = () => {
  return (
    <nav className="p-4 text-white bg-gray-800">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="text-xl font-bold">
          Your App
        </Link>
        <div className="flex space-x-4">
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
      </div>
    </nav>
  );
};
