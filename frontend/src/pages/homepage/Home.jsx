import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"  // Replace Next.js Link with React Router Link
import {
  Box,
  Atom,
  Users,
  Settings,
  ClipboardCheck,
  FileText,
  ListChecks,
  Utensils,
  CheckCircle,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardTitle ,CardHeader } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import Navbar from "../../components/NavBar"
import Sidebar from "../../components/Sidebar"
import ContactUs from "../../components/ContactUs"
import { getRecentUsers } from "@/apis/userApi"
import { Skeleton } from "@/components/ui/skeleton";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [recentUsers, setRecentUsers] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setIsSidebarOpen(window.innerWidth >= 768); // Auto open for larger screens
    };

    // ✅ Fetch recent users
    getRecentUsers()
      .then((data) => {
        console.log("Fetched recent users:", data);
        setRecentUsers(data);
      })
      .catch((error) => console.error("Error fetching recent users:", error));

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <div className="flex-1 p-6">
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
              <StatCard icon={ClipboardCheck} title="Feasibility Studies" value="38" trend={5} color="bg-yellow-500" />
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
            <Card className="border border-gray-200 shadow-lg lg:col-span-2 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {recentUsers.length > 0 ? (
            recentUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 transition rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <Avatar>
                    <AvatarImage src={user.avatar || "/default-avatar.png"} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Joined {new Date(user.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center py-6 space-y-2">
              <Skeleton className="w-16 h-16 rounded-full" />
              <p className="text-gray-500 dark:text-gray-400">No recent users found.</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Users
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

      <ContactUs />
    </div>
  )
}

export default Dashboard
