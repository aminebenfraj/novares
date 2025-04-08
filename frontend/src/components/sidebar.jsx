"use client"

import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Box,
  Atom,
  Settings,
  MapPin,
  LogOut,
  HelpCircle,
  Briefcase,
  PenToolIcon as Tool,
  ChevronDown,
  Plus,
  List,
  Edit,
  Wrench,
  ShoppingCart,
  Warehouse,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "../apis/userApi"
import { CallNotifications } from "../components/call-notifications"
import { getAllMassProductions } from "../apis/massProductionApi"
import { getAllPedidos } from "../apis/pedido/pedidoApi"
import { getCalls } from "../apis/logistic/callApi"
import { getAllMaterials } from "../apis/gestionStockApi/materialApi"
import { getAllAllocations } from "../apis/gestionStockApi/materialMachineApi"
import { getAllReadiness } from "../apis/readiness/readinessApi"

// Initial menu items structure
const initialMenuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
    noDropdown: true,
  },
  {
    icon: Tool,
    label: "Materials",
    path: "/materials",
    badge: "0",
    badgeKey: "materials",
    actions: [
      { label: "List", path: "/materials", icon: List },
      { label: "Create", path: "/materials/create", icon: Plus },
      {
        label: "Details",
        path: "/materials/details",
        icon: Edit,
        disabled: true,
        tooltip: "Select from list to view details",
      },
    ],
  },
  {
    icon: Wrench,
    label: "Machines",
    path: "/machines",
    actions: [
      { label: "List", path: "/machines", icon: List },
      { label: "Create", path: "/machines/create", icon: Plus },
      { label: "Edit", path: "/machines/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ],
  },
  {
    icon: Warehouse,
    label: "Material Allocations",
    path: "/machinematerial",
    badge: "0",
    badgeKey: "allocations",
    badgeColor: "bg-slate-500",
    actions: [
      { label: "List", path: "/machinematerial", icon: List },
      { label: "Create", path: "/machinematerial/create", icon: Plus },
      {
        label: "Details",
        path: "/machinematerial/detail",
        icon: Edit,
        disabled: true,
        tooltip: "Select from list to view details",
      },
    ],
  },
  {
    icon: MapPin,
    label: "Locations",
    path: "/locations",
    actions: [
      { label: "List", path: "/locations", icon: List },
      { label: "Create", path: "/locations/create", icon: Plus },
      { label: "Edit", path: "/locations/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ],
  },
  {
    icon: Box,
    label: "Categories",
    path: "/categories",
    actions: [
      { label: "List", path: "/categories", icon: List },
      { label: "Create", path: "/categories/create", icon: Plus },
      { label: "Edit", path: "/categories/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ],
  },
  {
    icon: Briefcase,
    label: "Suppliers",
    path: "/suppliers",
    actions: [
      { label: "List", path: "/suppliers", icon: List },
      { label: "Create", path: "/suppliers/create", icon: Plus },
      { label: "Edit", path: "/suppliers/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ],
  },
  {
    icon: Atom,
    label: "Mass Production",
    path: "/masspd",
    badge: "0",
    badgeKey: "massProductions",
    badgeColor: "bg-slate-500",
    actions: [
      { label: "List", path: "/masspd", icon: List },
      { label: "Create", path: "/masspd/create", icon: Plus },
      {
        label: "Details",
        path: "/masspd/detail",
        icon: Edit,
        disabled: true,
        tooltip: "Select from list to view details",
      },
    ],
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    path: "/pedido",
    badge: "0",
    badgeKey: "orders",
    badgeColor: "bg-slate-500",
    actions: [
      { label: "List", path: "/pedido", icon: List },
      { label: "Create", path: "/pedido/create", icon: Plus },
      { label: "Details", path: "/pedido", icon: Edit, disabled: true, tooltip: "Select from list to view details" },
    ],
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
    noDropdown: true,
  },
]

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openItems, setOpenItems] = useState({})
  const [user, setUser] = useState({ username: "Loading...", email: "..." })
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [counts, setCounts] = useState({
    materials: 0,
    allocations: 0,
    massProductions: 0,
    orders: 0,
    calls: 0,
    readiness: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const location = useLocation()

  // Auto-expand the menu item that matches the current path
  useEffect(() => {
    menuItems.forEach((item) => {
      if (
        !item.noDropdown &&
        (location.pathname.startsWith(item.path) ||
          item.actions?.some((action) => location.pathname.startsWith(action.path)))
      ) {
        setOpenItems((prev) => ({ ...prev, [item.label]: true }))
      }
    })
  }, [location.pathname, menuItems])

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      }
    }

    fetchUser()
  }, [])

  // Fetch counts for badges
  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true)
      try {
        // Fetch materials count
        let materialsCount = 0
        try {
          const materialsData = await getAllMaterials()
          materialsCount =
            materialsData?.totalDocs ||
            materialsData?.docs?.length ||
            (Array.isArray(materialsData) ? materialsData.length : 0)
        } catch (error) {
          console.error("Error fetching materials:", error)
        }

        // Fetch allocations count
        let allocationsCount = 0
        try {
          const allocationsData = await getAllAllocations()
          allocationsCount =
            allocationsData?.totalDocs ||
            allocationsData?.docs?.length ||
            (Array.isArray(allocationsData) ? allocationsData.length : 0)
        } catch (error) {
          console.error("Error fetching allocations:", error)
        }

        // Fetch mass productions count
        let massProductionsCount = 0
        try {
          const massProductionsData = await getAllMassProductions()
          const massProductions = Array.isArray(massProductionsData)
            ? massProductionsData
            : massProductionsData?.docs || []

          // Filter for on-going mass productions
          massProductionsCount = massProductions.filter((mp) => mp.status === "on-going").length
        } catch (error) {
          console.error("Error fetching mass productions:", error)
        }

        // Fetch orders count
        let ordersCount = 0
        try {
          const ordersData = await getAllPedidos()
          const orders = Array.isArray(ordersData) ? ordersData : ordersData?.docs || []

          // Filter for pending orders
          ordersCount = orders.filter((order) => order.table_status === "Pendiente").length
        } catch (error) {
          console.error("Error fetching orders:", error)
        }

        // Fetch calls count
        let callsCount = 0
        try {
          const callsData = await getCalls({ status: "Pendiente" })
          callsCount = Array.isArray(callsData) ? callsData.length : 0
        } catch (error) {
          console.error("Error fetching calls:", error)
        }

        // Fetch readiness count
        let readinessCount = 0
        try {
          const readinessData = await getAllReadiness()
          readinessCount =
            readinessData?.totalDocs ||
            readinessData?.docs?.length ||
            (Array.isArray(readinessData) ? readinessData.length : 0)
        } catch (error) {
          console.error("Error fetching readiness:", error)
        }

        // Update counts state
        const newCounts = {
          materials: materialsCount,
          allocations: allocationsCount,
          massProductions: massProductionsCount,
          orders: ordersCount,
          calls: callsCount,
          readiness: readinessCount,
        }

        setCounts(newCounts)

        // Update menu items with new badge counts
        updateMenuItemBadges(newCounts)
      } catch (error) {
        console.error("Failed to fetch counts:", error)
      } finally {
        setLoading(false)
      }
    }

    // Function to update menu items with badge counts
    const updateMenuItemBadges = (newCounts) => {
      const updatedMenuItems = initialMenuItems.map((item) => {
        if (item.badgeKey && newCounts[item.badgeKey] !== undefined) {
          return {
            ...item,
            badge: newCounts[item.badgeKey] > 0 ? newCounts[item.badgeKey].toString() : "0",
          }
        }
        return item
      })
      setMenuItems(updatedMenuItems)
    }

    // Fetch counts initially
    fetchCounts()

    // Set up interval to refresh counts every 60 seconds
    const intervalId = setInterval(fetchCounts, 60000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const toggleItem = (label) => {
    setOpenItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  // Check if a menu item or its children are active
  const isActive = (item) => {
    if (item.noDropdown) {
      return location.pathname === item.path
    }

    return (
      location.pathname.startsWith(item.path) ||
      item.actions?.some((action) => location.pathname.startsWith(action.path))
    )
  }

  // Filter menu items based on search term
  const filteredMenuItems = searchTerm
    ? menuItems.filter(
        (item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.actions?.some((action) => action.label.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : menuItems

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isOpen ? 280 : 0,
          opacity: isOpen ? 1 : 0,
          transition: { duration: 0.3 },
        }}
        className={`h-full bg-white border-r overflow-hidden ${isOpen ? "block" : "hidden md:block"} shadow-sm`}
      >
        <div className="flex flex-col h-full">
          {/* User profile section */}
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-slate-100">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-slate-100 text-slate-700">
                  {user.username ? user.username.substring(0, 2).toUpperCase() : "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.username || "User"}</p>
                <p className="text-xs truncate text-muted-foreground">{user.email || "user@example.com"}</p>
              </div>
              {/* Call notifications with count */}
              <CallNotifications count={counts.calls} />
            </div>
          </div>

          {/* Search bar */}
          <div className="px-4 py-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Menu items */}
          <ScrollArea className="flex-1">
            <div className="px-2 py-2">
              {loading ? (
                // Show loading indicators for menu items
                <div className="flex flex-col px-2 space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 rounded-md bg-slate-100 animate-pulse"></div>
                  ))}
                </div>
              ) : filteredMenuItems.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <p>No menu items found</p>
                  <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2">
                    Clear search
                  </Button>
                </div>
              ) : (
                // Render actual menu items
                filteredMenuItems.map((item, index) => (
                  <React.Fragment key={item.label}>
                    {index === 7 && <Separator className="mx-2 my-2" />}

                    {item.noDropdown ? (
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 mx-1 my-0.5 text-sm rounded-md transition-colors ${
                          isActive(item)
                            ? "bg-slate-100 text-slate-900 font-medium"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                        onClick={() => window.innerWidth < 768 && toggleSidebar()}
                      >
                        <item.icon className={`w-5 h-5 ${isActive(item) ? "text-slate-900" : "text-slate-500"}`} />
                        <span>{item.label}</span>
                        {item.badge && Number.parseInt(item.badge) > 0 && (
                          <Badge
                            className={`ml-auto ${item.badgeColor || "bg-slate-500"} text-white`}
                            variant="secondary"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ) : (
                      <Collapsible
                        open={openItems[item.label]}
                        onOpenChange={() => toggleItem(item.label)}
                        className="mx-1 my-0.5"
                      >
                        <CollapsibleTrigger asChild>
                          <button
                            className={`flex items-center justify-between w-full gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                              isActive(item)
                                ? "bg-slate-100 text-slate-900 font-medium"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon
                                className={`w-5 h-5 ${isActive(item) ? "text-slate-900" : "text-slate-500"}`}
                              />
                              <span>{item.label}</span>
                            </div>
                            <div className="flex items-center">
                              {item.badge && Number.parseInt(item.badge) > 0 && (
                                <Badge
                                  className={`mr-2 ${item.badgeColor || "bg-slate-500"} text-white`}
                                  variant="secondary"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  openItems[item.label] ? "rotate-180" : ""
                                } text-slate-500`}
                              />
                            </div>
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="py-1 pr-2 space-y-1 pl-9">
                            {item.actions?.map((action) => (
                              <Link
                                key={action.label}
                                to={action.disabled ? "#" : action.path}
                                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                                  location.pathname === action.path
                                    ? "bg-slate-100 text-slate-900 font-medium"
                                    : action.disabled
                                      ? "text-slate-400 cursor-not-allowed"
                                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                                onClick={(e) => {
                                  if (action.disabled) {
                                    e.preventDefault()
                                    return
                                  }
                                  if (window.innerWidth < 768) toggleSidebar()
                                }}
                                title={action.disabled ? action.tooltip : ""}
                              >
                                <action.icon
                                  className={`w-4 h-4 ${location.pathname === action.path ? "text-slate-900" : ""}`}
                                />
                                {action.label}
                                {location.pathname === action.path && (
                                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer actions */}
          <div className="p-4 mt-auto border-t">
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start w-full" size="sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </Button>
              <Button
                variant="ghost"
                className="justify-start w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
