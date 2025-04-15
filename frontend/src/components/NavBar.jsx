
import React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
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
  Star,
  Clock,
  ChevronRight,
  Bookmark,
  History,
  Briefcase,
  Atom,
  Warehouse,
  MapPin,
  Box,
  CheckSquare,
  FileCheck,
  ClipboardCheck,
  Clipboard,
  PenToolIcon as Tool,
  Truck,
  Shield,
  Bell,
  Edit,
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CallNotifications } from "./call-notifications"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"

// Define module groups for navigation
const moduleGroups = [  
  {
    id: "admin",
    label: "Administration",
    icon: Settings,
    modules: [
      { id: "admin", label: "User Management", path: "/admin", icon: User },
      { id: "settings", label: "Settings", path: "/settings", icon: Settings },
    ],
  },
]

// Define common actions for different modules
const moduleActions = {
  materials: [
    { label: "Create Material", path: "/materials/create", icon: PlusCircle },
    { label: "View Materials", path: "/materials", icon: Package },
  ],
  machines: [
    { label: "Create Machine", path: "/machines/create", icon: PlusCircle },
    { label: "View Machines", path: "/machines", icon: Wrench },
    { label: "Machine Dashboard", path: "/machine-dashboard", icon: BarChart3 },
  ],
  masspd: [
    { label: "Create Production", path: "/masspd/create", icon: PlusCircle },
    { label: "View Productions", path: "/masspd", icon: Atom },
  ],
  pedido: [
    { label: "Create Order", path: "/pedido/create", icon: PlusCircle },
    { label: "View Orders", path: "/pedido", icon: ShoppingCart },
  ],
  readiness: [
    { label: "Create Readiness", path: "/readiness/create", icon: PlusCircle },
    { label: "View Readiness", path: "/readiness", icon: ClipboardCheck },
  ],
  default: [
    { label: "Dashboard", path: "/", icon: Home },
    { label: "Materials", path: "/materials", icon: Package },
    { label: "Orders", path: "/pedido", icon: ShoppingCart },
  ],
}

export const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites")
    return saved ? JSON.parse(saved) : []
  })
  const [recentItems, setRecentItems] = useState(() => {
    const saved = localStorage.getItem("recentItems")
    return saved ? JSON.parse(saved) : []
  })
  const [activeTab, setActiveTab] = useState("recent")
  const searchRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const { toast } = useToast()
  const { user } = useAuth() || { user: { role: "user" } }

  // Get current module from path
  const currentModule = useMemo(() => {
    const path = location.pathname.split("/")[1]

    // Find the module that matches the current path
    for (const group of moduleGroups) {
      const module = group.modules.find((m) => m.path === `/${path}` || (path && m.id === path))
      if (module) return module
    }

    return { id: "home", label: "Dashboard", path: "/", icon: Home }
  }, [location.pathname])

  // Get breadcrumbs based on current path
  const breadcrumbs = useMemo(() => {
    const paths = location.pathname.split("/").filter(Boolean)
    if (paths.length === 0) return [{ label: "Dashboard", path: "/" }]

    const crumbs = [{ label: "Dashboard", path: "/" }]
    let currentPath = ""

    paths.forEach((path, i) => {
      currentPath += `/${path}`

      // Skip IDs (paths that are numbers or have : in them)
      if (/^\d+$/.test(path) || path.includes(":")) return

      // Find module that matches this path
      let label = path.charAt(0).toUpperCase() + path.slice(1)

      // Check if this is a known module
      for (const group of moduleGroups) {
        const module = group.modules.find((m) => m.path === currentPath || m.id === path)
        if (module) {
          label = module.label
          break
        }
      }

      // Handle special cases for create, edit, detail pages
      if (path === "create") label = "Create"
      else if (path === "edit") label = "Edit"
      else if (path === "detail" || path === "details") label = "Details"

      crumbs.push({ label, path: currentPath })
    })

    return crumbs
  }, [location.pathname])

  // Get context-aware actions based on current module
  const contextActions = useMemo(() => {
    const moduleId = currentModule?.id
    return moduleActions[moduleId] || moduleActions.default
  }, [currentModule])

  // Track recent items
  useEffect(() => {
    if (location.pathname === "/") return

    const newItem = {
      path: location.pathname,
      label: breadcrumbs[breadcrumbs.length - 1]?.label || "Page",
      timestamp: new Date().toISOString(),
    }

    setRecentItems((prev) => {
      // Remove duplicates and keep only the last 10 items
      const filtered = prev.filter((item) => item.path !== newItem.path)
      const updated = [newItem, ...filtered].slice(0, 10)
      localStorage.setItem("recentItems", JSON.stringify(updated))
      return updated
    })
  }, [location.pathname, breadcrumbs])

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 1) {
      // Search through all modules
      const results = []

      moduleGroups.forEach((group) => {
        group.modules.forEach((module) => {
          if (module.label.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              id: module.id,
              title: module.label,
              type: group.label,
              url: module.path,
              icon: module.icon,
            })
          }
        })
      })

      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  // Toggle favorite
  const toggleFavorite = (path, label, icon) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.path === path)
      let updated

      if (exists) {
        updated = prev.filter((item) => item.path !== path)
        toast({
          title: "Removed from favorites",
          description: `${label} has been removed from your favorites`,
        })
      } else {
        const newFavorite = { path, label, icon: icon?.name || "Bookmark" }
        updated = [...prev, newFavorite]
        toast({
          title: "Added to favorites",
          description: `${label} has been added to your favorites`,
        })
      }

      localStorage.setItem("favorites", JSON.stringify(updated))
      return updated
    })
  }

  // Check if current page is favorited
  const isFavorite = useMemo(() => {
    return favorites.some((item) => item.path === location.pathname)
  }, [favorites, location.pathname])

  // Get icon component for a path
  const getIconForPath = (path) => {
    for (const group of moduleGroups) {
      const module = group.modules.find((m) => m.path === path)
      if (module) return module.icon
    }
    return Bookmark
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

  return (
    <header className="z-30 w-full bg-white border-b shadow-sm">
      <div className="flex flex-col">
        {/* Main Navbar */}
        <div className="flex items-center justify-between h-16 px-4">
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

            
          </div>

          <div className="flex items-center gap-2">
            {/* Context-aware actions */}
            <div className="items-center hidden gap-1 md:flex">
              <TooltipProvider>
                {contextActions.map((action) => (
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

                {/* Favorite toggle button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        toggleFavorite(
                          location.pathname,
                          breadcrumbs[breadcrumbs.length - 1]?.label,
                          currentModule.icon,
                        )
                      }
                    >
                      <Star className={`w-5 h-5 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
                  </TooltipContent>
                </Tooltip>
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
                  <DropdownMenuItem onClick={() => navigate("/materials/create")}>
                    <Package className="w-4 h-4 mr-2" />
                    <span>Material</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/machines/create")}>
                    <Wrench className="w-4 h-4 mr-2" />
                    <span>Machine</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/pedido/create")}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    <span>Order</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/masspd/create")}>
                    <Atom className="w-4 h-4 mr-2" />
                    <span>Production</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/readiness/create")}>
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    <span>Readiness</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {user?.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin/create-user")}>
                      <User className="w-4 h-4 mr-2" />
                      <span>User</span>
                    </DropdownMenuItem>
                  </>
                )}
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
                <SheetContent side="top" className="h-auto max-h-[80vh]">
                  <div className="py-6">
                    <div className="relative mb-4">
                      <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                      <Input
                        id="search-input-sheet"
                        type="search"
                        placeholder="Search modules, pages, items..."
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
                              {result.icon && React.createElement(result.icon, { className: "w-4 h-4 mr-2" })}
                              <div className="flex-1">
                                <p className="text-sm font-medium">{result.title}</p>
                                <p className="text-xs capitalize text-muted-foreground">{result.type}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
                        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="recent">
                              <Clock className="w-4 h-4 mr-2" />
                              Recent
                            </TabsTrigger>
                            <TabsTrigger value="favorites">
                              <Star className="w-4 h-4 mr-2" />
                              Favorites
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>

                        {activeTab === "recent" && (
                          <div className="space-y-1">
                            {recentItems.length > 0 ? (
                              recentItems.map((item, index) => (
                                <SheetClose asChild key={index}>
                                  <Link to={item.path} className="flex items-center p-2 rounded-md hover:bg-slate-100">
                                    {React.createElement(getIconForPath(item.path) || History, {
                                      className: "w-4 h-4 mr-2 text-slate-500",
                                    })}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{item.label}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(item.timestamp).toLocaleString(undefined, {
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                  </Link>
                                </SheetClose>
                              ))
                            ) : (
                              <div className="py-4 text-center">
                                <p className="text-sm text-muted-foreground">No recent items</p>
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === "favorites" && (
                          <div className="space-y-1">
                            {favorites.length > 0 ? (
                              favorites.map((item, index) => (
                                <SheetClose asChild key={index}>
                                  <Link to={item.path} className="flex items-center p-2 rounded-md hover:bg-slate-100">
                                    {React.createElement(getIconForPath(item.path) || Star, {
                                      className: "w-4 h-4 mr-2 text-yellow-500",
                                    })}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{item.label}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="w-8 h-8"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        toggleFavorite(item.path, item.label)
                                      }}
                                    >
                                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    </Button>
                                  </Link>
                                </SheetClose>
                              ))
                            ) : (
                              <div className="py-4 text-center">
                                <p className="text-sm text-muted-foreground">No favorites yet</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Add pages to favorites by clicking the star icon
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <h3 className="mb-2 text-sm font-medium">Quick Access</h3>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <SheetClose asChild>
                              <Button variant="outline" className="justify-start" onClick={() => navigate("/")}>
                                <Home className="w-4 h-4 mr-2" />
                                Dashboard
                              </Button>
                            </SheetClose>
                            <SheetClose asChild>
                              <Button
                                variant="outline"
                                className="justify-start"
                                onClick={() => navigate("/materials")}
                              >
                                <Package className="w-4 h-4 mr-2" />
                                Materials
                              </Button>
                            </SheetClose>
                            <SheetClose asChild>
                              <Button variant="outline" className="justify-start" onClick={() => navigate("/pedido")}>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Orders
                              </Button>
                            </SheetClose>
                            <SheetClose asChild>
                              <Button variant="outline" className="justify-start" onClick={() => navigate("/masspd")}>
                                <Atom className="w-4 h-4 mr-2" />
                                Production
                              </Button>
                            </SheetClose>
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
                    <AvatarFallback className="bg-slate-100 text-slate-700">
                      {user?.username ? user.username.substring(0, 2).toUpperCase() : "AD"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.username || "Admin User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "admin@example.com"}</p>
                    {user?.role && (
                      <Badge variant="outline" className="mt-1 w-fit">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
                <DropdownMenuItem className="text-rose-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Breadcrumbs navigation bar */}
      
      </div>
    </header>
  )
}

export default Navbar
