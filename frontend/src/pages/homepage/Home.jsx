"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
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
  LayoutDashboard,
  Bell,
  Search,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Clock,
  Menu,
  X,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Input } from "../../components/ui/input"
import Navbar from "../../components/NavBar"
import ContactUs from "../../components/ContactUs"

// Sidebar component
const Sidebar = ({ isOpen, toggleSidebar }) => {
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
    { icon: MapPin, label: "Locations", path: "/location" },
    { icon: Settings, label: "Machines", path: "/machine" },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg md:relative md:z-0"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Novares</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-col p-4 space-y-2 overflow-y-auto h-[calc(100vh-64px)]">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

// Stat card component
const StatCard = ({ icon: Icon, title, value, trend, color }) => (
  <Card className="shadow-md">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-bold">{value}</h3>
          <div className="flex items-center mt-1">
            <span className={`text-xs font-medium ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
            <span className="ml-1 text-xs text-gray-500">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
)

// Feature card component
const FeatureCard = ({ to, icon: Icon, title, description, color }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Card className="h-full transition-shadow shadow-md hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" asChild className="p-0 text-blue-600 hover:text-blue-800">
          <Link to={to} className="flex items-center text-sm">
            Access
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
)

// Activity item component
const ActivityItem = ({ user, action, target, time, status }) => (
  <div className="flex items-start gap-4 py-3">
    <Avatar className="w-8 h-8">
      <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
      <AvatarFallback>{user.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">{user}</p>
        <p className="text-sm text-gray-500">{action}</p>
        <p className="text-sm font-medium">{target}</p>
      </div>
      <p className="flex items-center text-xs text-gray-500">
        <Clock className="w-3 h-3 mr-1" />
        {time}
      </p>
    </div>
    <Badge variant={status === "Completed" ? "success" : status === "In Progress" ? "warning" : "default"}>
      {status}
    </Badge>
  </div>
)

// Main dashboard component
const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  const toggleSidebar = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const features = [
    {
      icon: Box,
      title: "Product Designation",
      description: "View and manage your product designations.",
      to: "/pd",
      color: "bg-blue-500",
    },
    {
      icon: Atom,
      title: "Mass Production",
      description: "Handle mass production forms and data.",
      to: "/masspd",
      color: "bg-gray-500",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Manage users and their roles.",
      to: "/admin",
      color: "bg-indigo-500",
    },
    {
      icon: Settings,
      title: "Tests",
      description: "Access various test modules.",
      to: "/test",
      color: "bg-green-500",
    },
    {
      icon: ClipboardCheck,
      title: "Feasibility",
      description: "Manage and view feasibility studies.",
      to: "/Feasibility",
      color: "bg-yellow-500",
    },
    {
      icon: CheckCircle,
      title: "Check-ins",
      description: "Manage check-ins for projects and feasibility studies.",
      to: "/checkins",
      color: "bg-red-500",
    },
    {
      icon: Utensils,
      title: "Ok For Lunch",
      description: "Manage OkForLunch approvals and records.",
      to: "/okforlunch",
      color: "bg-purple-500",
    },
    {
      icon: FileText,
      title: "Validation For Offer",
      description: "Manage and validate offers efficiently.",
      to: "/validationforoffer",
      color: "bg-teal-500",
    },
  ]

  // Recent activity data (mock data)
  const recentActivity = [
    {
      user: "John Doe",
      action: "created a new",
      target: "Product Designation",
      time: "2 hours ago",
      status: "Completed",
    },
    {
      user: "Jane Smith",
      action: "updated",
      target: "Feasibility Study #1234",
      time: "4 hours ago",
      status: "Completed",
    },
    {
      user: "Mike Johnson",
      action: "started",
      target: "Mass Production Form",
      time: "Yesterday",
      status: "In Progress",
    },
    { user: "Sarah Williams", action: "submitted", target: "Design Review", time: "2 days ago", status: "Pending" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {/* Sidebar for larger screens */}
        {screenWidth >= 768 && <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />}

        {/* Main content */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="flex items-center justify-between p-4 bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search..." className="w-64 pl-8 border-gray-300 rounded-md" />
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-6">
            {/* Welcome banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 mb-8 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700"
            >
              <h2 className="mb-2 text-2xl font-bold">Welcome to Novares Management System</h2>
              <p className="max-w-2xl opacity-90">
                Manage your products, production, feasibility, check-ins, and more efficiently from this dashboard.
              </p>
            </motion.div>

            {/* Stats section */}
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Overview</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Box} title="Total Products" value="124" trend={12} color="bg-blue-500" />
                <StatCard
                  icon={ClipboardCheck}
                  title="Feasibility Studies"
                  value="38"
                  trend={5}
                  color="bg-yellow-500"
                />
                <StatCard icon={ListChecks} title="Active Tasks" value="27" trend={-3} color="bg-cyan-500" />
                <StatCard icon={Users} title="Team Members" value="16" trend={0} color="bg-indigo-500" />
              </div>
            </div>

            {/* Quick access section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Quick Access</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.5 }}
                  >
                    <FeatureCard {...feature} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Activity and charts section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Recent activity */}
              <Card className="shadow-md lg:col-span-2">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {recentActivity.map((activity, index) => (
                      <ActivityItem key={index} {...activity} />
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-blue-600">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>

              {/* Charts */}
              <div className="space-y-6">
                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Project Status</h3>
                      <PieChart className="w-4 h-4 text-gray-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-48 text-gray-400">
                      Chart visualization would appear here
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Monthly Progress</h3>
                      <BarChart3 className="w-4 h-4 text-gray-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-48 text-gray-400">
                      Chart visualization would appear here
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactUs />
    </div>
  )
}

export default Dashboard

