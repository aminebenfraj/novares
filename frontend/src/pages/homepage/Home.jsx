import { Link } from "react-router-dom"
import { Box, Atom, Users, Settings, ClipboardCheck, FileText, ListChecks, Utensils, CheckCircle, BarChart3, PieChart, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardTitle, CardHeader } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import MainLayout from "../../components/MainLayout"
import { getRecentUsers } from "../../apis/userApi"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

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

const Dashboard = () => {
  const [recentUsers, setRecentUsers] = useState([])

  useEffect(() => {
    getRecentUsers()
      .then(setRecentUsers)
      .catch((error) => console.error("Error fetching recent users:", error))
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

  return (
    <MainLayout>
      <div>
        {/* Welcome banner */}
        <div className="w-full p-6 text-white bg-gradient-to-r from-blue-600 to-indigo-700">
          <h2 className="mb-2 text-2xl font-bold">Welcome to Novares Management System</h2>
          <p>Manage your products, production, feasibility, check-ins, and more efficiently from this dashboard.</p>
        </div>

        <div className="p-6">
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
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>

          {/* Activity and charts section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent activity */}
            <Card className="border border-gray-200 lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentUsers.length > 0 ? (
                  <div className="space-y-4">
                    {recentUsers.map((user, index) => (
                      <div key={index} className="flex items-center p-3 space-x-4 rounded-lg bg-gray-50">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/default-avatar.png"} />
                          <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <Skeleton className="w-12 h-12 mx-auto mb-4 rounded-full" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Project Status</h3>
                    <PieChart className="w-4 h-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-48 text-gray-400">
                    Chart visualization would appear here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Monthly Progress</h3>
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
    </MainLayout>
  )
}

export default Dashboard
