"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  getAllAllocations,
  getMachineStockHistory,
  updateAllocation,
} from "../../../apis/gestionStockApi/materialMachineApi"
import { getAllMaterials } from "../../../apis/gestionStockApi/materialApi"
import { getMachineById } from "../../../apis/gestionStockApi/machineApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Package,
  AlertTriangle,
  Settings,
  BarChart3,
  Clock,
  Search,
  Edit,
  Plus,
  History,
  Layers,
  RefreshCw,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import MainLayout from "@/components/MainLayout"

const MachineDetailDashboard = () => {
  const { machineId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [allocations, setAllocations] = useState([])
  const [materials, setMaterials] = useState([])
  const [machineHistory, setMachineHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAllocations, setFilteredAllocations] = useState([])
  const [machine, setMachine] = useState(null)
  const [activeTab, setActiveTab] = useState("materials")

  // For the update dialog
  const [selectedAllocation, setSelectedAllocation] = useState(null)
  const [newStock, setNewStock] = useState("")
  const [comment, setComment] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    totalMaterials: 0,
    criticalMaterials: 0,
    lowStockMaterials: 0,
    totalAllocatedStock: 0,
  })

  useEffect(() => {
    if (machineId) {
      fetchData()
    } else {
      toast({
        title: "Error",
        description: "Machine ID is missing",
        variant: "destructive",
      })
      navigate("/machine-dashboard")
    }
  }, [machineId])

  useEffect(() => {
    if (allocations.length > 0) {
      filterAllocations()
      calculateStats()
    }
  }, [searchTerm, allocations, materials])

  const fetchData = async () => {
    try {
      setLoading(true)

      // First fetch the machine details to ensure it exists
      let machineData
      try {
        machineData = await getMachineById(machineId)
        if (!machineData) {
          throw new Error("Machine not found")
        }
        setMachine(machineData)
      } catch (error) {
        console.error("Error fetching machine:", error)
        toast({
          title: "Error",
          description: "Machine not found or could not be loaded",
          variant: "destructive",
        })
        navigate("/machine-dashboard")
        return
      }

      // Then fetch allocations and materials
      try {
        const [allAllocations, materialsData] = await Promise.all([
          getAllAllocations(),
          getAllMaterials(1, 1000), // Get all materials with a high limit
        ])

        // Filter allocations for this machine
        const machineAllocations = allAllocations.filter(
          (allocation) => allocation.machine && allocation.machine._id === machineId,
        )

        setAllocations(machineAllocations)
        setFilteredAllocations(machineAllocations)
        setMaterials(materialsData.data || [])
      } catch (error) {
        console.error("Error fetching allocations or materials:", error)
        toast({
          title: "Warning",
          description: "Some data could not be loaded completely",
          variant: "warning",
        })
      }

      // Finally fetch history separately to avoid undefined machineId issues
      if (machineId) {
        try {
          const historyData = await getMachineStockHistory(machineId)
          setMachineHistory(historyData)
        } catch (error) {
          console.error("Error fetching machine history:", error)
          setMachineHistory([])
          // Don't show toast for history error as it's not critical
        }
      }
    } catch (error) {
      console.error("Error in fetchData:", error)
      toast({
        title: "Error",
        description: "Failed to fetch machine data: " + (error.message || "Unknown error"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAllocations = () => {
    if (!searchTerm.trim()) {
      setFilteredAllocations(allocations)
      return
    }

    const filtered = allocations.filter((allocation) => {
      const materialRef = allocation.material?.reference || ""
      const materialDesc = allocation.material?.description || ""
      const category = materials.find((m) => m._id === allocation.material?._id)?.category?.name || ""

      return (
        materialRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materialDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

    setFilteredAllocations(filtered)
  }

  const calculateStats = () => {
    let criticalCount = 0
    let lowStockCount = 0
    let totalStock = 0

    allocations.forEach((allocation) => {
      // Find the full material details
      const materialDetails = materials.find((m) => m._id === allocation.material?._id)

      if (materialDetails?.critical) {
        criticalCount++
      }

      if (materialDetails?.currentStock <= materialDetails?.minimumStock) {
        lowStockCount++
      }

      totalStock += allocation.allocatedStock || 0
    })

    setStats({
      totalMaterials: allocations.length,
      criticalMaterials: criticalCount,
      lowStockMaterials: lowStockCount,
      totalAllocatedStock: totalStock,
    })
  }

  const handleUpdateAllocation = async () => {
    if (!selectedAllocation || !newStock) return

    try {
      setIsUpdating(true)

      const updateData = {
        allocatedStock: Number.parseInt(newStock),
        comment: comment || `Updated stock from ${selectedAllocation.allocatedStock} to ${newStock}`,
      }

      await updateAllocation(selectedAllocation._id, updateData)

      toast({
        title: "Success",
        description: "Material allocation updated successfully",
      })

      // Refresh data
      fetchData()
      setIsDialogOpen(false)
      setNewStock("")
      setComment("")
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update allocation",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const openUpdateDialog = (allocation) => {
    setSelectedAllocation(allocation)
    setNewStock(allocation.allocatedStock.toString())
    setIsDialogOpen(true)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const exportToCSV = () => {
    const headers = ["Reference", "Description", "Category", "Allocated Stock", "Current Stock", "Status"]

    const rows = filteredAllocations.map((allocation) => {
      const materialDetails = materials.find((m) => m._id === allocation.material?._id)
      let status = "In Stock"
      if (materialDetails?.critical) status = "Critical"
      else if (materialDetails?.currentStock <= materialDetails?.minimumStock) status = "Low Stock"

      return [
        allocation.material?.reference || "",
        allocation.material?.description || "",
        materialDetails?.category?.name || "Unknown",
        allocation.allocatedStock || 0,
        materialDetails?.currentStock || 0,
        status,
      ]
    })

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `machine-materials-${machine?.name}-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 rounded-full animate-spin border-primary border-t-transparent"></div>
        </div>
      </MainLayout>
    )
  }

  if (!machine) {
    return (
      <MainLayout>
        <div className="container py-8 mx-auto">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="w-12 h-12 mb-4 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold">Machine Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              The machine you're looking for doesn't exist or has no material allocations.
            </p>
            <Button onClick={() => navigate("/machine-dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container py-8 mx-auto">
        <Toaster />

        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate("/machine-dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{machine.name}</h1>
              <p className="text-muted-foreground">{machine.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={machine.status === "active" ? "success" : "warning"} className="px-3 py-1 text-sm">
              {machine.status || "Unknown"}
            </Badge>
            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMaterials}</div>
              <p className="text-xs text-muted-foreground">Materials allocated to this machine</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Critical Materials</CardTitle>
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.criticalMaterials}</div>
              <p className="text-xs text-muted-foreground">Critical materials in this machine</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Materials</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStockMaterials}</div>
              <p className="text-xs text-muted-foreground">Materials below minimum stock level</p>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Allocated Stock</CardTitle>
              <Layers className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAllocatedStock}</div>
              <p className="text-xs text-muted-foreground">Total units allocated to this machine</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="materials" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Machine Materials</CardTitle>
                  <CardDescription>All materials allocated to this machine</CardDescription>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search materials..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={exportToCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button asChild>
                    <Link to="/machinematerial/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Material
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  {filteredAllocations.length === 0 ? (
                    <div className="py-12 text-center">
                      <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                      <h3 className="text-lg font-medium">No materials found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or add materials to this machine
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Reference</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Allocated</TableHead>
                            <TableHead className="text-right">Current Stock</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <AnimatePresence>
                            {filteredAllocations.map((allocation) => {
                              // Find the full material details
                              const materialDetails = materials.find((m) => m._id === allocation.material?._id)

                              return (
                                <motion.tr
                                  key={allocation._id}
                                  variants={itemVariants}
                                  exit={{ opacity: 0 }}
                                  className="hover:bg-muted/50"
                                >
                                  <TableCell className="font-medium">{allocation.material?.reference}</TableCell>
                                  <TableCell>{allocation.material?.description}</TableCell>
                                  <TableCell>{materialDetails?.category?.name || "Unknown"}</TableCell>
                                  <TableCell className="text-right">{allocation.allocatedStock}</TableCell>
                                  <TableCell className="text-right">{materialDetails?.currentStock || 0}</TableCell>
                                  <TableCell className="text-right">
                                    {materialDetails?.critical ? (
                                      <Badge variant="destructive">Critical</Badge>
                                    ) : materialDetails?.currentStock <= materialDetails?.minimumStock ? (
                                      <Badge variant="warning">Low Stock</Badge>
                                    ) : (
                                      <Badge variant="success">In Stock</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button variant="ghost" size="icon" onClick={() => openUpdateDialog(allocation)}>
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" asChild>
                                        <Link to={`/machinematerial/detail/${allocation._id}`}>
                                          <Settings className="w-4 h-4" />
                                        </Link>
                                      </Button>
                                    </div>
                                  </TableCell>
                                </motion.tr>
                              )
                            })}
                          </AnimatePresence>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Stock History</CardTitle>
                <CardDescription>History of material stock changes for this machine</CardDescription>
              </CardHeader>
              <CardContent>
                {machineHistory.length === 0 ? (
                  <div className="py-12 text-center">
                    <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <h3 className="text-lg font-medium">No history available</h3>
                    <p className="text-muted-foreground">This machine has no recorded stock history</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {machineHistory.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">
                                {item.material?.reference || "Unknown Material"}
                              </CardTitle>
                              <Badge variant="outline">{item.material?.category?.name || "Unknown Category"}</Badge>
                            </div>
                            <CardDescription>{item.material?.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {item.history &&
                                item.history.map((historyItem, historyIndex) => (
                                  <div key={historyIndex} className="p-3 border rounded-md bg-muted/30">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                          {formatDate(historyItem.date)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-xs text-muted-foreground">Previous Stock</p>
                                        <p className="font-medium">{historyItem.previousStock}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">New Stock</p>
                                        <p className="font-medium">{historyItem.newStock}</p>
                                      </div>
                                    </div>
                                    {historyItem.comment && (
                                      <div className="mt-2">
                                        <p className="text-xs text-muted-foreground">Comment</p>
                                        <p className="text-sm">{historyItem.comment}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Update Allocation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Material Allocation</DialogTitle>
              <DialogDescription>
                Update the allocated stock for {selectedAllocation?.material?.reference}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="current-stock" className="text-right">
                  Current Stock
                </Label>
                <Input
                  id="current-stock"
                  value={selectedAllocation?.allocatedStock || ""}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="new-stock" className="text-right">
                  New Stock
                </Label>
                <Input
                  id="new-stock"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="col-span-3"
                  type="number"
                  min="0"
                />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="comment" className="text-right">
                  Comment
                </Label>
                <Input
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="col-span-3"
                  placeholder="Optional comment"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateAllocation} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Stock"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}

export default MachineDetailDashboard

