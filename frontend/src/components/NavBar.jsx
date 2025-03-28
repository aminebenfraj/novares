"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Bell, Menu } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

export const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <header className="z-30 h-16 w-full border-b bg-white">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link to="/" className="flex items-center">
            <img src="/novares-logo.webp" alt="Novares" className="h-8 w-auto" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            className="relative flex items-center"
            initial={false}
            animate={{ width: isSearchOpen ? "auto" : "40px" }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 transition-colors duration-200 hover:text-primary"
              onClick={toggleSearch}
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <motion.div
              initial={false}
              animate={{ width: isSearchOpen ? "200px" : "0px", opacity: isSearchOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Input
                type="text"
                placeholder="Search..."
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Search input"
              />
            </motion.div>
          </motion.div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

export default Navbar

