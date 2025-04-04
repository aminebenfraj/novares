"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Search, Bell, Menu, X, Settings, HelpCircle, User, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef(null)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Low stock alert",
      description: "5 materials are below minimum stock levels",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "New order received",
      description: "Order #12345 has been created",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Project completed",
      description: "Mass production project MP-2023-001 is now complete",
      time: "Yesterday",
      read: true,
    },
  ])

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus()
      }, 300)
    } else {
      setSearchQuery("")
      setShowSearchResults(false)
    }
  }

  // Mock search function - replace with actual search logic
  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 1) {
      // Mock search results - replace with actual API call
      const results = [
        { id: 1, title: "Material M-1001", type: "material", url: "/materials/details/1" },
        { id: 2, title: "Machine CNC-01", type: "machine", url: "/machines/details/1" },
        { id: 3, title: "Order #12345", type: "order", url: "/pedido/1" },
      ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))

      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="z-30 w-full h-16 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Link to="/" className="flex items-center">
            <img src="/novares-logo.webp" alt="Novares" className="w-auto h-8" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div ref={searchRef} className="relative">
            <motion.div
              className="flex items-center"
              initial={false}
              animate={{ width: isSearchOpen ? "300px" : "40px" }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 z-10 text-gray-600 transition-colors duration-200 hover:text-primary"
                onClick={toggleSearch}
                aria-label="Toggle search"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </Button>
              <motion.div
                initial={false}
                animate={{
                  width: isSearchOpen ? "300px" : "0px",
                  opacity: isSearchOpen ? 1 : 0,
                  paddingRight: isSearchOpen ? "40px" : "0px",
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Input
                  id="search-input"
                  type="text"
                  placeholder="Search materials, orders, projects..."
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </motion.div>
            </motion.div>

            {/* Search results dropdown */}
            <AnimatePresence>
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg top-full"
                >
                  <div className="py-1">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        to={result.url}
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowSearchResults(false)}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{result.title}</p>
                          <p className="text-xs capitalize text-muted-foreground">{result.type}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute flex items-center justify-center w-5 h-5 p-0 text-white bg-red-500 -top-1 -right-1">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start p-3 ${!notification.read ? "bg-primary/5" : ""}`}
                      onSelect={(e) => {
                        e.preventDefault()
                        markAsRead(notification.id)
                      }}
                    >
                      <div className="flex items-start w-full gap-2">
                        <div
                          className={`h-2 w-2 mt-1.5 rounded-full ${!notification.read ? "bg-primary" : "bg-transparent"}`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-sm text-primary">
                    View all notifications
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  <p>No notifications</p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 p-0 rounded-full">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="w-4 h-4 mr-2" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar

