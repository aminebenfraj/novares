"use client"

import { useState, useEffect } from "react"
import Navbar from "../components/NavBar"
import Sidebar from "../components/Sidebar"

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Navbar at the top, full width */}
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Content area with sidebar and main content side by side */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

