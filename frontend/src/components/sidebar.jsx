"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Restructured menu items with nested actions - focused on the models provided
const menuItems = [
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

  const toggleItem = (label) => {
    setOpenItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

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
          width: isOpen ? 240 : 0,
          opacity: isOpen ? 1 : 0,
          transition: { duration: 0.3 },
        }}
        className={`h-full bg-white border-r overflow-hidden ${isOpen ? "block" : "hidden md:block"}`}
      >
        <ScrollArea className="h-full">
          <div className="py-2">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.label}>
                {index === 7 && <Separator className="mx-4 my-2" />}

                {item.noDropdown ? (
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-2 mx-2 my-1 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
                    onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ) : (
                  <Collapsible
                    open={openItems[item.label]}
                    onOpenChange={() => toggleItem(item.label)}
                    className="mx-2 my-1"
                  >
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-between w-full gap-3 px-4 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openItems[item.label] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="py-1 pr-2 space-y-1 pl-9">
                        {item.actions?.map((action) => (
                          <Link
                            key={action.label}
                            to={action.disabled ? "#" : action.path}
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md ${
                              action.disabled
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
                            <action.icon className="w-4 h-4" />
                            {action.label}
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="p-4 mt-4 border-t">
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start" size="sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </ScrollArea>
      </motion.aside>
    </>
  )
}

export default Sidebar

