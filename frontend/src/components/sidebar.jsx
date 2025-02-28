"use client"

import React from "react"

import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Box,
  Atom,
  Users,
  Settings,
  ClipboardCheck,
  FileText,
  Rocket,
  ListChecks,
  Utensils,
  CheckCircle,
  MapPin,
  LogOut,
  HelpCircle,
  X,
  Briefcase,
  Truck,
  PenToolIcon as Tool,
  Database,
} from "lucide-react"
import { Button } from "../../src/components/ui/button"
import { Separator } from "../../src/components/ui/separator"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Box, label: "Product Designation", path: "/pd" },
  { icon: Atom, label: "Mass Production", path: "/masspd" },
  { icon: Users, label: "User Management", path: "/admin" },
  { icon: Settings, label: "Tests", path: "/test" },
  { icon: ClipboardCheck, label: "Feasibility", path: "/Feasibility" },
  { icon: CheckCircle, label: "Check-ins", path: "/checkins" },
  { icon: Utensils, label: "Ok For Lunch", path: "/okforlunch" },
  { icon: FileText, label: "Validation For Offer", path: "/validationforoffer" },
  { icon: ListChecks, label: "Tasks", path: "/tasklist" },
  { icon: Rocket, label: "Kickoff", path: "/kickoff" },
  { icon: FileText, label: "Design", path: "/design" },
  { icon: Box, label: "Categories", path: "/categories" },
  { icon: MapPin, label: "Locations", path: "/locations" },
  { icon: Settings, label: "Machines", path: "/machines" },
  { icon: Briefcase, label: "Suppliers", path: "/suppliers" },
  { icon: Tool, label: "Materials", path: "/materials" },
  { icon: Database, label: "Facilities", path: "/facilities" },
  { icon: Truck, label: "P-P Tuning", path: "/pptuning" },
  { icon: FileText, label: "Qualification Confirmation", path: "/qualificationconfirmation" },
  { icon: ClipboardCheck, label: "Process Qualification", path: "/processQualification" },
]

export const Sidebar = ({ isOpen, toggleSidebar }) => {
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

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="fixed top-0 left-0 z-50 w-64 h-full overflow-y-auto bg-white shadow-lg md:relative md:z-0"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Novares</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-col p-4 space-y-2">
              {menuItems.map((item, index) => (
                <React.Fragment key={item.label}>
                  {index === 6 && <Separator className="my-2" />}
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </React.Fragment>
              ))}
            </div>

            <div className="p-4 border-t">
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
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar

