"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Bell, Menu } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../../src/components/ui/button"
import { Input } from "../../src/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../src/components/ui/avatar"

export const Navbar = ({ toggleSidebar }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <header className="z-30 w-full h-16 bg-white border-b">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link to="/" className="flex items-center">
            <img src="/novares-logo.webp" alt="Novares" className="w-auto h-8" />
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
                className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
    </header>
  )
}

export default Navbar

