
"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Package,
  Wrench,
  Warehouse,
  Box,
  FileText,
  ShoppingCart,
  ArrowUpRight,
  AlertTriangle,
  Clock,
  CheckCircle,
  Loader2,
  Activity,
  Search,
  RefreshCw,
  ChevronRight,
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  LayoutDashboard,
  Users,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardTitle, CardHeader, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MainLayout from "../../components/MainLayout"
import { motion } from "framer-motion"

// Import the APIs
import { getAllMaterials } from "@/apis/gestionStockApi/materialApi"
import { getAllMachines } from "@/apis/gestionStockApi/machineApi"
import { getAllAllocations } from "@/apis/gestionStockApi/materialMachineApi"
import { getAllPedidos } from "@/apis/pedido/pedidoApi"
import { getAllMassProductions } from "@/apis/massProductionApi"
import { getAllReadiness } from "@/apis/readiness/readinessApi"
import { useToast } from "@/hooks/use-toast"

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  Filler,
)

// Dashboard stat card component with animation
const StatCard = ({ icon: Icon, title, value, trend, color, isLoading, onClick }) => (
  <motion.div
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    whileTap={{ y: 0, transition: { duration: 0.2 } }}
    className="w-full"
  >
    <Card className="overflow-hidden transition-all shadow-sm cursor-pointer hover:shadow-md" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="w-full">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? <Skeleton className="w-20 h-8 mt-1" /> : <h3 className="mt-1 text-2xl font-bold">{value}</h3>}
            {trend !== undefined && !isLoading && (
              <div className="flex items-center mt-1">
                {trend >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-rose-500" />
                )}
                <span className={`text-xs font-medium ${trend >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </span>
                <span className="ml-1 text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
      <div className="h-1 bg-muted">
        <div
          className={`h-full ${color.replace("bg-", "bg-")}`}
          style={{ width: `${Math.min(Math.abs(trend || 0) * 2, 100)}%` }}
        ></div>
      </div>
    </Card>
  </motion.div>
)

// Feature card component with animation
const FeatureCard = ({ to, icon: Icon, title, description, color, count }) => (
  <motion.div
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    whileTap={{ y: 0, transition: { duration: 0.2 } }}
    className="h-full"
  >
    <Card className="h-full transition-all shadow-sm hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          {count !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" asChild className="p-0 text-primary hover:text-primary/80">
          <Link to={to} className="flex items-center text-sm">
            Access
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
)

// Activity item component with animation
const ActivityItem = ({ title, description, time, icon: Icon, iconColor, onClick }) => (
  <motion.div whileHover={{ x: 5, transition: { duration: 0.2 } }} whileTap={{ x: 0, transition: { duration: 0.2 } }}>
    <div
      className="flex items-start gap-4 p-3 transition-colors rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
      onClick={onClick}
    >
      <div className={`p-2 rounded-full ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="mt-1 text-xs text-muted-foreground">{time}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </div>
  </motion.div>
)

// Status badge component
const StatusBadge = ({ status }) => {
  let color, icon, label

  switch (status?.toLowerCase?.()) {
    case "on-going":
    case "in_progress":
    case "pending":
      color = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      icon = <Clock className="w-3 h-3 mr-1" />
      label = status === "on-going" ? "On-going" : status === "in_progress" ? "In Progress" : "Pending"
      break
    case "completed":
    case "closed":
      color = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      icon = <CheckCircle className="w-3 h-3 mr-1" />
      label = status === "completed" ? "Completed" : "Closed"
      break
    case "stand-by":
      color = "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      icon = <AlertTriangle className="w-3 h-3 mr-1" />
      label = "Stand-by"
      break
    case "cancelled":
      color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      icon = <AlertTriangle className="w-3 h-3 mr-1" />
      label = "Cancelled"
      break
    default:
      color = "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      icon = <AlertTriangle className="w-3 h-3 mr-1" />
      label = status || "Unknown"
  }

  return (
    <Badge variant="secondary" className={color}>
      {icon}
      {label}
    </Badge>
  )
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [materials, setMaterials] = useState([])
  const [machines, setMachines] = useState([])
  const [allocations, setAllocations] = useState([])
  const [orders, setOrders] = useState([])
  const [massProductions, setMassProductions] = useState([])
  const [readinessEntries, setReadinessEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const navigate = useNavigate()

  // Fetch data when component mounts
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch all data in parallel
      const [
        materialsResponse,
        machinesResponse,
        allocationsResponse,
        ordersResponse,
        massProductionsResponse,
        readinessResponse,
      ] = await Promise.all([
        getAllMaterials(),
        getAllMachines(),
        getAllAllocations(),
        getAllPedidos(),
        getAllMassProductions(),
        getAllReadiness(),
      ])

      // Process materials
      setMaterials(Array.isArray(materialsResponse) ? materialsResponse : materialsResponse?.data || [])

      // Process machines
      setMachines(Array.isArray(machinesResponse) ? machinesResponse : machinesResponse?.data || [])

      // Process allocations
      setAllocations(Array.isArray(allocationsResponse) ? allocationsResponse : allocationsResponse?.data || [])

      // Process orders
      setOrders(ordersResponse?.data || [])

      // Process mass productions
      setMassProductions(
        Array.isArray(massProductionsResponse) ? massProductionsResponse : massProductionsResponse?.data || [],
      )

      // Process readiness entries
      setReadinessEntries(Array.isArray(readinessResponse) ? readinessResponse : readinessResponse?.data || [])

      toast({
        title: "Data loaded successfully",
        description: "Dashboard data has been refreshed",
      })
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load dashboard data. Please try again later.")
      toast({
        title: "Error loading data",
        description: "Failed to load dashboard data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAllData()
  }

  // Calculate statistics
  const getLowStockCount = () => {
    return materials.filter((material) => material.currentStock <= material.minimumStock).length
  }

  const getActiveProjects = () => {
    return massProductions.filter((prod) => prod.status === "on-going" || prod.status === "in_progress").length
  }

  const getPendingOrders = () => {
    return orders.filter((order) => !order.recepcionado || order.recepcionado === "No").length
  }

  const getReadinessProgress = () => {
    if (readinessEntries.length === 0) return 0
    const completed = readinessEntries.filter((entry) => entry.status === "closed").length
    return Math.round((completed / readinessEntries.length) * 100)
  }

  // Get recent activities across all modules
  const getRecentActivities = () => {
    const recentItems = []

    // Add recent materials
    materials.slice(0, 3).forEach((material) => {
      recentItems.push({
        type: "material",
        id: material._id,
        title: `Material ${material.reference || material._id}`,
        description: `${material.description || "Material"} - Stock: ${material.currentStock}`,
        time: new Date(material.updatedAt || material.createdAt).toISOString(),
        icon: Package,
        iconColor: "bg-blue-100 text-blue-700",
        date: new Date(material.updatedAt || material.createdAt),
        route: `/materials/details/${material._id}`,
      })
    })

    // Add recent orders
    orders.slice(0, 3).forEach((order) => {
      recentItems.push({
        type: "order",
        id: order._id,
        title: `Order ${order.referencia?.reference || order._id}`,
        description: `${order.descripcionInterna || "Order"} - ${getPropertyValue(order.proveedor) || "Supplier"}`,
        time: new Date(order.fechaSolicitud || order.createdAt || new Date()).toISOString(),
        icon: ShoppingCart,
        iconColor: "bg-emerald-100 text-emerald-700",
        date: new Date(order.fechaSolicitud || order.createdAt || new Date()),
        route: `/pedido/${order._id}`,
      })
    })

    // Add recent mass productions
    massProductions.slice(0, 3).forEach((prod) => {
      recentItems.push({
        type: "production",
        id: prod._id || prod.id,
        title: `Project ${prod.project_n || prod.id || prod._id}`,
        description: `Status: ${prod.status} - ${prod.description || "Production"}`,
        time: new Date(prod.updatedAt || prod.createdAt || new Date()).toISOString(),
        icon: Box,
        iconColor: "bg-purple-100 text-purple-700",
        date: new Date(prod.updatedAt || prod.createdAt || new Date()),
        route: `/masspd/detail/${prod._id || prod.id}`,
      })
    })

    // Add recent readiness entries
    readinessEntries.slice(0, 3).forEach((entry) => {
      recentItems.push({
        type: "readiness",
        id: entry._id,
        title: `Readiness ${entry.id || entry._id}`,
        description: `${entry.project_name || "Project"} - Status: ${entry.status || "Unknown"}`,
        time: new Date(entry.updatedAt || entry.createdAt || new Date()).toISOString(),
        icon: FileText,
        iconColor: "bg-amber-100 text-amber-700",
        date: new Date(entry.updatedAt || entry.createdAt || new Date()),
        route: `/readiness/detail/${entry._id}`,
      })
    })

    // Sort by date (newest first) and take the top 5
    return recentItems.sort((a, b) => b.date - a.date).slice(0, 5)
  }

  // Helper function to safely extract property values from objects
  const getPropertyValue = (obj) => {
    if (!obj) return "N/A"

    // If the object is already a string, return it
    if (typeof obj === "string") return obj

    // If it's an object with a name property, return the name
    if (typeof obj === "object" && obj !== null) {
      if (obj.name) return obj.name
      if (obj.reference) return obj.reference
      if (obj._id) return obj._id
    }

    return "N/A"
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Calculate inventory status percentages
  const calculateInventoryStatus = () => {
    if (!materials.length) return { inStock: 0, critical: 0, outOfStock: 0 }

    const total = materials.length
    const outOfStock = materials.filter((m) => m.currentStock <= 0).length
    const critical = materials.filter((m) => m.currentStock > 0 && m.currentStock <= m.minimumStock).length
    const inStock = total - outOfStock - critical

    return {
      inStock: Math.round((inStock / total) * 100),
      critical: Math.round((critical / total) * 100),
      outOfStock: Math.round((outOfStock / total) * 100),
    }
  }

  // Calculate project status percentages
  const calculateProjectStatus = () => {
    if (!massProductions.length) return { ongoing: 0, standby: 0, completed: 0, cancelled: 0 }

    const total = massProductions.length
    const ongoing = massProductions.filter((p) => p.status === "on-going").length
    const standby = massProductions.filter((p) => p.status === "stand-by").length
    const completed = massProductions.filter((p) => p.status === "closed").length
    const cancelled = massProductions.filter((p) => p.status === "cancelled").length

    return {
      ongoing: Math.round((ongoing / total) * 100),
      standby: Math.round((standby / total) * 100),
      completed: Math.round((completed / total) * 100),
      cancelled: Math.round((cancelled / total) * 100),
    }
  }

  // Generate chart data for inventory trends
  const getInventoryChartData = () => {
    // Mock data - replace with actual historical data
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Total Stock",
          data: [120, 135, 110, 125, 145, 160],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.3,
          fill: true,
        },
        {
          label: "Low Stock Items",
          data: [20, 25, 15, 18, 12, 10],
          borderColor: "rgb(245, 158, 11)",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    }
  }

  // Generate chart data for project status
  const getProjectStatusChartData = () => {
    const projectStatus = calculateProjectStatus()

    return {
      labels: ["On-going", "Stand-by", "Completed", "Cancelled"],
      datasets: [
        {
          data: [projectStatus.ongoing, projectStatus.standby, projectStatus.completed, projectStatus.cancelled],
          backgroundColor: ["rgb(59, 130, 246)", "rgb(245, 158, 11)", "rgb(34, 197, 94)", "rgb(239, 68, 68)"],
          borderWidth: 1,
        },
      ],
    }
  }

  // Generate chart data for orders by month
  const getOrdersChartData = () => {
    // Mock data - replace with actual data
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Orders",
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: "rgba(59, 130, 246, 0.7)",
        },
      ],
    }
  }

  const inventoryStatus = calculateInventoryStatus()
  const projectStatus = calculateProjectStatus()
  const recentActivities = getRecentActivities()

  // Filter activities based on search and status
  const filteredActivities = recentActivities.filter((activity) => {
    // Filter by search term
    const matchesSearch =
      !searchTerm ||
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by status (if applicable)
    const matchesStatus =
      statusFilter === "all" || activity.description.toLowerCase().includes(statusFilter.toLowerCase())

    return matchesSearch && matchesStatus
  })

  return (
    <MainLayout>
      <div>
        {/* Welcome banner */}
        <div className="w-full p-6 text-white bg-gradient-to-r from-primary to-primary/80">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="mb-2 text-2xl font-bold">Welcome to the Management Dashboard</h2>
              <p>Monitor your inventory, production processes, and orders in one place.</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="w-full md:w-auto"
              >
                {refreshing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats section */}
          <div className="mb-8">
            <h2 className="flex items-center mb-4 text-lg font-semibold">
              <LayoutDashboard className="w-5 h-5 mr-2 text-primary" />
              Overview
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Package}
                title="Materials"
                value={materials.length}
                trend={5}
                color="bg-blue-500"
                isLoading={loading}
                onClick={() => navigate("/materials")}
              />
              <StatCard
                icon={AlertTriangle}
                title="Low Stock Items"
                value={getLowStockCount()}
                trend={-2}
                color="bg-rose-500"
                isLoading={loading}
                onClick={() => navigate("/materials")}
              />
              <StatCard
                icon={Box}
                title="Active Projects"
                value={getActiveProjects()}
                trend={8}
                color="bg-emerald-500"
                isLoading={loading}
                onClick={() => navigate("/masspd")}
              />
              <StatCard
                icon={ShoppingCart}
                title="Pending Orders"
                value={getPendingOrders()}
                trend={3}
                color="bg-amber-500"
                isLoading={loading}
                onClick={() => navigate("/pedido")}
              />
            </div>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center text-lg font-semibold">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Dashboard Analytics
              </h2>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="production">Production</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-0 space-y-6">
              {/* Charts Section */}
              <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Inventory Trends</CardTitle>
                    <CardDescription>Stock levels over the past 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="w-full h-[300px]" />
                    ) : (
                      <div className="h-[300px]">
                        <Line
                          data={getInventoryChartData()}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Orders by Month</CardTitle>
                    <CardDescription>Number of orders placed each month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="w-full h-[300px]" />
                    ) : (
                      <div className="h-[300px]">
                        <Bar
                          data={getOrdersChartData()}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              y: {
                                beginAtZero: true,
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity and Status Section */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent activity */}
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <Activity className="w-5 h-5 mr-2 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-2.5 top-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search activities..."
                          className="w-[180px] pl-8 h-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-8 w-[130px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="on-going">On-going</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="w-3/4 h-4 mb-2" />
                              <Skeleton className="w-full h-3 mb-1" />
                              <Skeleton className="w-1/4 h-3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : filteredActivities.length > 0 ? (
                      <div className="space-y-4">
                        {filteredActivities.map((activity, index) => (
                          <ActivityItem
                            key={`${activity.type}-${activity.id}-${index}`}
                            title={activity.title}
                            description={activity.description}
                            time={formatDate(activity.time)}
                            icon={activity.icon}
                            iconColor={activity.iconColor}
                            onClick={() => navigate(activity.route)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-muted-foreground">
                          {searchTerm || statusFilter !== "all"
                            ? "No matching activities found. Try adjusting your filters."
                            : "No recent activity found"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Project Status */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-lg">
                        <PieChart className="w-5 h-5 mr-2 text-primary" />
                        Project Status
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-6">
                        <Skeleton className="w-full h-[200px] rounded-full" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="h-[200px] flex justify-center">
                          <Doughnut
                            data={getProjectStatusChartData()}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              cutout: "70%",
                              plugins: {
                                legend: {
                                  position: "bottom",
                                  labels: {
                                    boxWidth: 12,
                                    padding: 15,
                                  },
                                },
                              },
                            }}
                          />
                        </div>

                        <div>
                          <h4 className="mb-3 text-sm font-medium">Project Status Breakdown</h4>
                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="flex items-center text-xs">
                                  <span className="inline-block w-2 h-2 mr-1 bg-blue-500 rounded-full"></span>
                                  On-going
                                </span>
                                <span className="text-xs text-muted-foreground">{projectStatus.ongoing}%</span>
                              </div>
                              <Progress value={projectStatus.ongoing} className="h-1.5" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="flex items-center text-xs">
                                  <span className="inline-block w-2 h-2 mr-1 rounded-full bg-amber-500"></span>
                                  Stand-by
                                </span>
                                <span className="text-xs text-muted-foreground">{projectStatus.standby}%</span>
                              </div>
                              <Progress value={projectStatus.standby} className="h-1.5 bg-muted">
                                <div className="h-full bg-amber-500" style={{ width: `${projectStatus.standby}%` }} />
                              </Progress>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="flex items-center text-xs">
                                  <span className="inline-block w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                                  Completed
                                </span>
                                <span className="text-xs text-muted-foreground">{projectStatus.completed}%</span>
                              </div>
                              <Progress value={projectStatus.completed} className="h-1.5 bg-muted">
                                <div className="h-full bg-green-500" style={{ width: `${projectStatus.completed}%` }} />
                              </Progress>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="flex items-center text-xs">
                                  <span className="inline-block w-2 h-2 mr-1 bg-red-500 rounded-full"></span>
                                  Cancelled
                                </span>
                                <span className="text-xs text-muted-foreground">{projectStatus.cancelled}%</span>
                              </div>
                              <Progress value={projectStatus.cancelled} className="h-1.5 bg-muted">
                                <div className="h-full bg-red-500" style={{ width: `${projectStatus.cancelled}%` }} />
                              </Progress>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link to="/masspd">View All Projects</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Access Section */}
              <div>
                <h2 className="flex items-center mb-4 text-lg font-semibold">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Quick Access
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FeatureCard
                    to="/materials"
                    icon={Package}
                    title="Materials"
                    description="Manage materials, stock levels, and inventory."
                    color="bg-blue-500"
                    count={materials.length}
                  />
                  <FeatureCard
                    to="/machines"
                    icon={Wrench}
                    title="Machines"
                    description="View and manage machines and equipment."
                    color="bg-emerald-500"
                    count={machines.length}
                  />
                  <FeatureCard
                    to="/machinematerial"
                    icon={Warehouse}
                    title="Allocations"
                    description="Allocate materials to machines and track usage."
                    color="bg-amber-500"
                    count={allocations.length}
                  />
                  <FeatureCard
                    to="/pedido"
                    icon={ShoppingCart}
                    title="Orders"
                    description="View and manage material orders and requests."
                    color="bg-rose-500"
                    count={orders.length}
                  />
                  <FeatureCard
                    to="/masspd"
                    icon={Box}
                    title="Mass Production"
                    description="Manage mass production processes and tracking."
                    color="bg-indigo-500"
                    count={massProductions.length}
                  />
                  <FeatureCard
                    to="/readiness"
                    icon={FileText}
                    title="Readiness"
                    description="Track project readiness and documentation."
                    color="bg-purple-500"
                    count={readinessEntries.length}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Inventory Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2 text-primary" />
                      Inventory Summary
                    </CardTitle>
                    <CardDescription>Overview of your current inventory status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="w-full h-16" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 text-center border rounded-lg">
                            <p className="text-sm text-muted-foreground">Total Materials</p>
                            <p className="text-2xl font-bold">{materials.length}</p>
                          </div>
                          <div className="p-4 text-center border rounded-lg">
                            <p className="text-sm text-muted-foreground">Low Stock</p>
                            <p className="text-2xl font-bold text-amber-500">{getLowStockCount()}</p>
                          </div>
                          <div className="p-4 text-center border rounded-lg">
                            <p className="text-sm text-muted-foreground">Out of Stock</p>
                            <p className="text-2xl font-bold text-rose-500">
                              {materials.filter((m) => m.currentStock <= 0).length}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-2 text-sm font-medium">Inventory Status</h4>
                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">In Stock</span>
                                <span className="text-sm text-muted-foreground">{inventoryStatus.inStock}%</span>
                              </div>
                              <Progress value={inventoryStatus.inStock} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Critical</span>
                                <span className="text-sm text-muted-foreground">{inventoryStatus.critical}%</span>
                              </div>
                              <Progress value={inventoryStatus.critical} className="h-2 bg-muted">
                                <div
                                  className="h-full bg-amber-500"
                                  style={{ width: `${inventoryStatus.critical}%` }}
                                />
                              </Progress>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Out of Stock</span>
                                <span className="text-sm text-muted-foreground">{inventoryStatus.outOfStock}%</span>
                              </div>
                              <Progress value={inventoryStatus.outOfStock} className="h-2 bg-muted">
                                <div
                                  className="h-full bg-rose-500"
                                  style={{ width: `${inventoryStatus.outOfStock}%` }}
                                />
                              </Progress>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link to="/materials">View Inventory Report</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Low Stock Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                      Low Stock Items
                    </CardTitle>
                    <CardDescription>Materials that need attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="w-full h-16" />
                        ))}
                      </div>
                    ) : (
                      <div>
                        {materials.filter((m) => m.currentStock <= m.minimumStock).length > 0 ? (
                          <div className="space-y-4">
                            {materials
                              .filter((m) => m.currentStock <= m.minimumStock)
                              .slice(0, 5)
                              .map((material) => (
                                <div
                                  key={material._id}
                                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                                  onClick={() => navigate(`/materials/details/${material._id}`)}
                                >
                                  <div>
                                    <p className="font-medium">{material.reference || "N/A"}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {material.description || "No description"}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p
                                      className={`font-bold ${material.currentStock <= 0 ? "text-rose-500" : "text-amber-500"}`}
                                    >
                                      {material.currentStock} / {material.minimumStock}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Current / Minimum</p>
                                  </div>
                                </div>
                              ))}
                            <Button variant="outline" size="sm" className="w-full" asChild>
                              <Link to="/materials">View All Low Stock Items</Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                            <p>All materials are above minimum stock levels</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="production" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Project Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Box className="w-5 h-5 mr-2 text-primary" />
                      Project Status
                    </CardTitle>
                    <CardDescription>Overview of your production projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="w-full h-16" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 text-center border rounded-lg">
                            <p className="text-sm text-muted-foreground">Total Projects</p>
                            <p className="text-2xl font-bold">{massProductions.length}</p>
                          </div>
                          <div className="p-4 text-center border rounded-lg">
                            <p className="text-sm text-muted-foreground">Active Projects</p>
                            <p className="text-2xl font-bold text-blue-500">{getActiveProjects()}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-2 text-sm font-medium">Project Status Breakdown</h4>
                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">On-going</span>
                                <span className="text-sm text-muted-foreground">{projectStatus.ongoing}%</span>
                              </div>
                              <Progress value={projectStatus.ongoing} className="h-2" />
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Stand-by</span>
                                <span className="text-sm text-muted-foreground">{projectStatus.standby}%</span>
                              </div>
                              <Progress value={projectStatus.standby} className="h-2 bg-muted">
                                <div className="h-full bg-amber-500" style={{ width: `${projectStatus.standby}%` }} />
                              </Progress>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Completed</span>
                                <span className="text-sm text-muted-foreground">{projectStatus.completed}%</span>
                              </div>
                              <Progress value={projectStatus.completed} className="h-2 bg-muted">
                                <div className="h-full bg-green-500" style={{ width: `${projectStatus.completed}%` }} />
                              </Progress>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link to="/masspd">View All Projects</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-primary" />
                      Recent Projects
                    </CardTitle>
                    <CardDescription>Latest production projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="w-full h-16" />
                        ))}
                      </div>
                    ) : (
                      <div>
                        {massProductions.length > 0 ? (
                          <div className="space-y-4">
                            {massProductions.slice(0, 5).map((project) => (
                              <div
                                key={project._id || project.id}
                                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                                onClick={() => navigate(`/masspd/detail/${project._id || project.id}`)}
                              >
                                <div>
                                  <p className="font-medium">{project.project_n || project.id || "N/A"}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {project.description || "No description"}
                                  </p>
                                </div>
                                <StatusBadge status={project.status} />
                              </div>
                            ))}
                            <Button variant="outline" size="sm" className="w-full" asChild>
                              <Link to="/masspd">View All Projects</Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <Box className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                            <p>No production projects found</p>
                            <Button variant="outline" size="sm" className="mt-4" asChild>
                              <Link to="/masspd/create">Create New Project</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard
