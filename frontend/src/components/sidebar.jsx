"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Box, Atom, Users, Settings, ClipboardCheck, FileText, Rocket, ListChecks, Utensils, CheckCircle, MapPin, LogOut, HelpCircle, Briefcase, Truck, PenToolIcon as Tool, Database, ChevronDown, Plus, List, Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Restructured menu items with nested actions
const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    path: "/",
    noDropdown: true 
  },
  { 
    icon: Box, 
    label: "Product Designation", 
    path: "/pd",
    actions: [
      { label: "List", path: "/pd", icon: List },
      { label: "Create", path: "/pd/create", icon: Plus },
      { label: "Edit", path: "/pd/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: Atom, 
    label: "Mass Production", 
    path: "/masspd",
    actions: [
      { label: "List", path: "/masspd", icon: List },
      { label: "Create", path: "/masspd/create", icon: Plus },
      { label: "Edit", path: "/masspd/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: Users, 
    label: "User Management", 
    path: "/admin",
    actions: [
      { label: "List", path: "/admin", icon: List },
      { label: "Create", path: "/admin/create-user", icon: Plus },
      { label: "Edit", path: "/admin/edit-user", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: Settings, 
    label: "Tests", 
    path: "/test",
    actions: [
      { label: "Test", path: "/test", icon: List },
      { label: "Test 1", path: "/test1", icon: List },
      { label: "Test 2", path: "/test2", icon: List },
      { label: "Test 3", path: "/test3", icon: List },
      { label: "Test 4", path: "/test4", icon: List },
      { label: "Test 5", path: "/test5", icon: List },
    ]
  },
  { 
    icon: ClipboardCheck, 
    label: "Feasibility", 
    path: "/Feasibility",
    actions: [
      { label: "List", path: "/Feasibility", icon: List },
      { label: "Create", path: "/CreateFeasibility", icon: Plus },
      { label: "Edit", path: "/feasibility/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: CheckCircle, 
    label: "Check-ins", 
    path: "/checkins",
    actions: [
      { label: "List", path: "/checkins", icon: List },
      { label: "Create", path: "/checkins/create", icon: Plus },
      { label: "Edit", path: "/checkins/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: Utensils, 
    label: "Ok For Lunch", 
    path: "/okforlunch",
    actions: [
      { label: "List", path: "/okforlunch", icon: List },
      { label: "Create", path: "/okforlunch/create", icon: Plus },
      { label: "Edit", path: "/okforlunch/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: FileText, 
    label: "Validation For Offer", 
    path: "/validationforoffer",
    actions: [
      { label: "List", path: "/validationforoffer", icon: List },
      { label: "Create", path: "/validationforoffer/create", icon: Plus },
      { label: "Edit", path: "/validationforoffer/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: ListChecks, 
    label: "Tasks", 
    path: "/tasklist",
    actions: [
      { label: "List", path: "/tasklist", icon: List },
      { label: "Create", path: "/task/create", icon: Plus },
      { label: "Edit", path: "/task/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: Rocket, 
    label: "Kickoff", 
    path: "/kickoff",
    actions: [
      { label: "List", path: "/kickoff", icon: List },
      { label: "Create", path: "/kickoff/create", icon: Plus },
      { label: "Edit", path: "/kickoff/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: FileText, 
    label: "Design", 
    path: "/design",
    actions: [
      { label: "List", path: "/design", icon: List },
      { label: "Create", path: "/design/create", icon: Plus },
      { label: "Edit", path: "/design/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: Box, 
    label: "Categories", 
    path: "/categories",
    actions: [
      { label: "List", path: "/categories", icon: List },
      { label: "Create", path: "/categories/create", icon: Plus },
      { label: "Edit", path: "/categories/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: MapPin, 
    label: "Locations", 
    path: "/locations",
    actions: [
      { label: "List", path: "/locations", icon: List },
      { label: "Create", path: "/locations/create", icon: Plus },
      { label: "Edit", path: "/locations/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: Settings, 
    label: "Machines", 
    path: "/machines",
    actions: [
      { label: "List", path: "/machines", icon: List },
      { label: "Create", path: "/machines/create", icon: Plus },
      { label: "Edit", path: "/machines/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: Briefcase, 
    label: "Suppliers", 
    path: "/suppliers",
    actions: [
      { label: "List", path: "/suppliers", icon: List },
      { label: "Create", path: "/suppliers/create", icon: Plus },
      { label: "Edit", path: "/suppliers/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: Tool, 
    label: "Materials", 
    path: "/materials",
    actions: [
      { label: "List", path: "/materials", icon: List },
      { label: "Create", path: "/materials/create", icon: Plus },
      { label: "Edit", path: "/materials/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: Database, 
    label: "Facilities", 
    path: "/facilities",
    actions: [
      { label: "List", path: "/facilities", icon: List },
      { label: "Create", path: "/facilities/create", icon: Plus },
      { label: "Edit", path: "/facilities/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: Truck, 
    label: "P-P Tuning", 
    path: "/pptuning",
    actions: [
      { label: "List", path: "/pptuning", icon: List },
      { label: "Create", path: "/pptuning/create", icon: Plus },
      { label: "Edit", path: "/p_p_tuning/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: FileText, 
    label: "Qualification Confirmation", 
    path: "/qualificationconfirmation",
    actions: [
      { label: "List", path: "/qualificationconfirmation", icon: List },
      { label: "Create", path: "/qualificationconfirmation/create", icon: Plus },
      { label: "Edit", path: "/qualificationconfirmation/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
  { 
    icon: ClipboardCheck, 
    label: "Process Qualification", 
    path: "/processQualification",
    actions: [
      { label: "List", path: "/processQualification", icon: List },
      { label: "Create", path: "/processQualification/create", icon: Plus },
      { label: "Edit", path: "/processQualification/edit", icon: Edit, disabled: true, tooltip: "Select from list to edit" },
    ]
  },
]

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (label) => {
    setOpenItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

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
                {index === 6 && <Separator className="mx-4 my-2" />}
                
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
                      <button
                        className="flex items-center justify-between w-full gap-3 px-4 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
                      >
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
                                e.preventDefault();
                                return;
                              }
                              if (window.innerWidth < 768) toggleSidebar();
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
