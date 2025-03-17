"use client"

import { Link } from "react-router-dom"
import {
  Package,
  Wrench,
  Warehouse,
  Box,
  FileText,
  ShoppingCart,
  BarChart3,
  ArrowUpRight,
  Users,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardTitle, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MainLayout from "../../components/MainLayout"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Import the APIs
import { getAllMaterials } from "@/apis/gestionStockApi/materialApi"
import { getAllMachines } from "@/apis/gestionStockApi/machineApi"
import { getAllAllocations } from "@/apis/gestionStockApi/materialMachineApi"
import { getAllPedidos } from "../../apis/pedido/pedidoApi"
import { getAllMassProductions } from "@/apis/massProductionApi"

// Stat card component
const StatCard = ({ icon: Icon, title, value, trend, color, isLoading }) => (
  <Card className="shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="w-full">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? <Skeleton className="w-20 h-8 mt-1" /> : <h3 className="mt-1 text-2xl font-bold">{value}</h3>}
          {trend !== undefined && !isLoading && (
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${trend > 0 ? "text-emerald-500" : "text-rose-500"}`}>
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
  </Card>
)

// Feature card component
const FeatureCard = ({ to, icon: Icon, title, description, color }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Card className="h-full transition-shadow shadow-sm hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
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

// Activity item component
const ActivityItem = ({ title, description, time, icon: Icon, iconColor }) => (
  <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
    <div className={`p-2 rounded-full ${iconColor}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="mt-1 text-xs text-muted-foreground">{time}</p>
    </div>
  </div>
)

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("inventory")
  const [materials, setMaterials] = useState([])
  const [machines, setMachines] = useState([])
  const [allocations, setAllocations] = useState([])
  const [orders, setOrders] = useState([])
  const [massProductions, setMassProductions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch materials
        const materialsResponse = await getAllMaterials()
        setMaterials(materialsResponse.data || [])

        // Fetch machines
        const machinesResponse = await getAllMachines()
        setMachines(Array.isArray(machinesResponse) ? machinesResponse : machinesResponse.data || [])

        // Fetch allocations
        const allocationsResponse = await getAllAllocations()
        setAllocations(Array.isArray(allocationsResponse) ? allocationsResponse : allocationsResponse.data || [])

        // Fetch orders
        const ordersResponse = await getAllPedidos()
        setOrders(ordersResponse.data || [])

        // Fetch mass productions
        const massProductionsResponse = await getAllMassProductions()
        setMassProductions(
          Array.isArray(massProductionsResponse) ? massProductionsResponse : massProductionsResponse.data || [],
        )
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate statistics
  const getLowStockCount = () => {
    return materials.filter((material) => material.currentStock <= material.minimumStock).length
  }

  // Get recent activities based on timestamps
  const getRecentActivities = (type) => {
    if (type === "inventory") {
      // Get recent material and machine activities
      const recentMaterials = materials.slice(0, 3).map((material) => ({
        type: "material",
        title: `Material ${material.reference}`,
        description: `${material.description || "Material"} - Current stock: ${material.currentStock}`,
        time: new Date(material.updatedAt).toLocaleDateString(),
        icon: Package,
        iconColor: "bg-blue-100 text-blue-700",
        date: new Date(material.updatedAt),
      }))

      const recentAllocations = allocations.slice(0, 3).map((allocation) => ({
        type: "allocation",
        title: "Material Allocated",
        description: `${allocation.allocatedStock} units allocated to machine`,
        time: new Date(allocation.updatedAt || allocation.createdAt).toLocaleDateString(),
        icon: Warehouse,
        iconColor: "bg-amber-100 text-amber-700",
        date: new Date(allocation.updatedAt || allocation.createdAt),
      }))

      // Combine and sort by date
      return [...recentMaterials, ...recentAllocations].sort((a, b) => b.date - a.date).slice(0, 3)
    } else {
      // Get recent orders and mass productions
      const recentOrders = orders.slice(0, 3).map((order) => ({
        type: "order",
        title: `Order ${order.referencia || order._id}`,
        description: `${order.descripcionInterna || "Order"} - ${order.proveedor || "Supplier"}`,
        time: new Date(order.fechaSolicitud || order.createdAt).toLocaleDateString(),
        icon: ShoppingCart,
        iconColor: "bg-emerald-100 text-emerald-700",
        date: new Date(order.fechaSolicitud || order.createdAt),
      }))

      const recentProductions = massProductions.slice(0, 3).map((prod) => ({
        type: "production",
        title: `Project ${prod.project_n || prod.id}`,
        description: `Status: ${prod.status} - ${prod.description || "Production"}`,
        time: new Date(prod.updatedAt || prod.createdAt).toLocaleDateString(),
        icon: Box,
        iconColor: "bg-blue-100 text-blue-700",
        date: new Date(prod.updatedAt || prod.createdAt),
      }))

      // Combine and sort by date
      return [...recentOrders, ...recentProductions].sort((a, b) => b.date - a.date).slice(0, 3)
    }
  }

  const inventoryFeatures = [
    {
      icon: Package,
      title: "Materials",
      description: "Manage materials, stock levels, and inventory.",
      to: "/materials",
      color: "bg-blue-500",
    },
    {
      icon: Wrench,
      title: "Machines",
      description: "View and manage machines and equipment.",
      to: "/machines",
      color: "bg-emerald-500",
    },
    {
      icon: Warehouse,
      title: "Allocations",
      description: "Allocate materials to machines and track usage.",
      to: "/machinematerial/create",
      color: "bg-amber-500",
    },
    {
      icon: Box,
      title: "Categories",
      description: "Manage material categories and classifications.",
      to: "/categories",
      color: "bg-indigo-500",
    },
    {
      icon: FileText,
      title: "Locations",
      description: "Manage storage locations and organization.",
      to: "/locations",
      color: "bg-purple-500",
    },
    {
      icon: ShoppingCart,
      title: "Suppliers",
      description: "Manage supplier information and orders.",
      to: "/suppliers",
      color: "bg-rose-500",
    },
  ]

  const productionFeatures = [
    {
      icon: Box,
      title: "Mass Production",
      description: "Manage mass production processes and tracking.",
      to: "/masspd",
      color: "bg-blue-500",
    },
    {
      icon: ShoppingCart,
      title: "Orders",
      description: "View and manage material orders and requests.",
      to: "/pedido",
      color: "bg-emerald-500",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Manage users and their access permissions.",
      to: "/admin",
      color: "bg-amber-500",
    },
  ]

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

  const inventoryStatus = calculateInventoryStatus()

  return (
    <MainLayout>
      <div>
        {/* Welcome banner */}
        <div className="w-full p-6 text-white bg-gradient-to-r from-primary to-primary/80">
          <h2 className="mb-2 text-2xl font-bold">Inventory & Production Management</h2>
          <p>Manage materials, machines, allocations, and production processes efficiently.</p>
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
            <h2 className="mb-4 text-lg font-semibold">Overview</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Package}
                title="Total Materials"
                value={materials.length}
                color="bg-blue-500"
                isLoading={loading}
              />
              <StatCard
                icon={Wrench}
                title="Machines"
                value={machines.length}
                color="bg-emerald-500"
                isLoading={loading}
              />
              <StatCard
                icon={ShoppingCart}
                title="Orders"
                value={orders.length}
                color="bg-amber-500"
                isLoading={loading}
              />
              <StatCard
                icon={AlertTriangle}
                title="Low Stock Items"
                value={getLowStockCount()}
                color="bg-rose-500"
                isLoading={loading}
              />
            </div>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="inventory" className="mb-8" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Quick Access</h2>
              <TabsList>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="production">Production</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="inventory" className="mt-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {inventoryFeatures.map((feature) => (
                  <FeatureCard key={feature.title} {...feature} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="production" className="mt-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {productionFeatures.map((feature) => (
                  <FeatureCard key={feature.title} {...feature} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Activity and charts section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
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
                ) : (
                  <div className="space-y-4">
                    {getRecentActivities(activeTab).length > 0 ? (
                      getRecentActivities(activeTab).map((activity, index) => (
                        <ActivityItem
                          key={index}
                          title={activity.title}
                          description={activity.description}
                          time={activity.time}
                          icon={activity.icon}
                          iconColor={activity.iconColor}
                        />
                      ))
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-muted-foreground">No recent activity found</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Inventory Status</CardTitle>
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <Skeleton className="w-24 h-4" />
                          <Skeleton className="w-8 h-4" />
                        </div>
                        <Skeleton className="w-full h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Materials in Stock</span>
                        <span className="text-sm text-muted-foreground">{inventoryStatus.inStock}%</span>
                      </div>
                      <div className="w-full h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${inventoryStatus.inStock}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Critical Items</span>
                        <span className="text-sm text-muted-foreground">{inventoryStatus.critical}%</span>
                      </div>
                      <div className="w-full h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${inventoryStatus.critical}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Out of Stock</span>
                        <span className="text-sm text-muted-foreground">{inventoryStatus.outOfStock}%</span>
                      </div>
                      <div className="w-full h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-rose-500"
                          style={{ width: `${inventoryStatus.outOfStock}%` }}
                        ></div>
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
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard

