"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Search,
  Menu,
  X,
  Settings,
  HelpCircle,
  User,
  LogOut,
  ChevronDown,
  Home,
  Package,
  Wrench,
  ShoppingCart,
  FileText,
  BarChart3,
  PlusCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CallNotifications } from "./call-notifications"
import { Separator } from "@/components/ui/separator"

export const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname

    if (path === "/") return "Dashboard"
    if (path.startsWith("/materials")) return "Materials"
    if (path.startsWith("/machines")) return "Machines"
    if (path.startsWith("/machinematerial")) return "Material Allocations"
    if (path.startsWith("/locations")) return "Locations"
    if (path.startsWith("/categories")) return "Categories"
    if (path.startsWith("/suppliers")) return "Suppliers"
    if (path.startsWith("/masspd")) return "Mass Production"
    if (path.startsWith("/pedido")) return "Orders"
    if (path.startsWith("/settings")) return "Settings"

    return "Dashboard"
  }

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

  // Quick actions for the navbar
  const quickActions = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Package, label: "Materials", path: "/materials" },
    { icon: Wrench, label: "Machines", path: "/machines" },
    { icon: ShoppingCart, label: "Orders", path: "/pedido" },
    { icon: FileText, label: "Reports", path: "/reports" },
  ]

  // Create actions for the dropdown
  const createActions = [
    { label: "New Material", path: "/materials/create", icon: Package },
    { label: "New Machine", path: "/machines/create", icon: Wrench },
    { label: "New Order", path: "/pedido/create", icon: ShoppingCart },
    { label: "New Production", path: "/masspd/create", icon: BarChart3 },
  ]

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

          <Separator orientation="vertical" className="hidden h-6 md:block" />

          <h1 className="hidden text-lg font-medium md:block">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick action buttons - visible on larger screens */}
          <div className="items-center hidden gap-1 md:flex">
            <TooltipProvider>
              {quickActions.map((action) => (
                <Tooltip key={action.label}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${location.pathname === action.path ? "bg-slate-100" : ""}`}
                      onClick={() => navigate(action.path)}
                    >
                      <action.icon className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6 mx-1" />
          </div>

          {/* Create new dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <PlusCircle className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Create</span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Create New</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {createActions.map((action) => (
                  <DropdownMenuItem key={action.label} onClick={() => navigate(action.path)}>
                    <action.icon className="w-4 h-4 mr-2" />
                    <span>{action.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <div ref={searchRef} className="relative">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-600">
                  <Search className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto max-h-[400px]">
                <div className="py-6">
                  <div className="relative mb-4">
                    <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                    <Input
                      id="search-input-sheet"
                      type="search"
                      placeholder="Search materials, machines, orders..."
                      className="pl-10 pr-4"
                      value={searchQuery}
                      onChange={handleSearch}
                      autoFocus
                    />
                  </div>

                  {showSearchResults && searchResults.length > 0 ? (
                    <div className="space-y-1">
                      <h3 className="mb-2 text-sm font-medium">Results</h3>
                      {searchResults.map((result) => (
                        <SheetClose asChild key={result.id}>
                          <Link to={result.url} className="flex items-center p-2 rounded-md hover:bg-slate-100">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{result.title}</p>
                              <p className="text-xs capitalize text-muted-foreground">{result.type}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 rotate-270 text-muted-foreground" />
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  ) : searchQuery.length > 1 ? (
                    <div className="py-4 text-center">
                      <p className="text-sm text-muted-foreground">No results found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-sm font-medium">Recent Searches</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="rounded-full">
                            Material M-1001
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-full">
                            Order #12345
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-full">
                            Machine CNC-01
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-medium">Quick Access</h3>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {quickActions.map((action) => (
                            <SheetClose asChild key={action.label}>
                              <Button variant="outline" className="justify-start" onClick={() => navigate(action.path)}>
                                <action.icon className="w-4 h-4 mr-2" />
                                {action.label}
                              </Button>
                            </SheetClose>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Call notifications */}
          <CallNotifications />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-slate-100 text-slate-700">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="w-4 h-4 mr-2" />
                <span>Help</span>
                <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-600">
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar
