"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import MainLayout from "@/components/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllMachines, deleteMachine } from "@/apis/gestionStockApi/machineApi"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  Settings,
  Wrench,
  PowerOff,
  Filter,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const ShowMachines = () => {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [machineToDelete, setMachineToDelete] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  // Removed viewMode state - using grid view only
  const { toast } = useToast()

  useEffect(() => {
    fetchMachines()
  }, [])

  const fetchMachines = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllMachines()
      setMachines(data)
    } catch (error) {
      console.error("Failed to fetch machines:", error)
      setError("Failed to fetch machines. Please try again.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch machines. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (machine) => {
    setMachineToDelete(machine)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!machineToDelete) return

    try {
      await deleteMachine(machineToDelete._id)
      setMachines(machines.filter((machine) => machine._id !== machineToDelete._id))
      toast({
        title: "Success",
        description: "Machine deleted successfully!",
      })
    } catch (error) {
      console.error("Failed to delete machine:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete machine. Please try again.",
      })
    } finally {
      setDeleteDialogOpen(false)
      setMachineToDelete(null)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-green-700 border-green-200 bg-green-50">
            <CheckCircle className="w-3 h-3" />
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-red-700 border-red-200 bg-red-50">
            <PowerOff className="w-3 h-3" />
            Inactive
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
            <Wrench className="w-3 h-3" />
            Maintenance
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-gray-700 border-gray-200 bg-gray-50">
            {status}
          </Badge>
        )
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "inactive":
        return <PowerOff className="w-5 h-5 text-red-500" />
      case "maintenance":
        return <Wrench className="w-5 h-5 text-amber-500" />
      default:
        return <Settings className="w-5 h-5 text-gray-500" />
    }
  }

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || machine.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const renderSkeletons = () => {
    return Array(6)
      .fill()
      .map((_, index) => (
        <Card key={index} className="bg-gray-50 dark:bg-zinc-700">
          <CardContent className="p-4 space-y-3">
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-1/4 h-8" />
            <div className="flex justify-end pt-4 space-x-2">
              <Skeleton className="w-20 h-9" />
              <Skeleton className="w-20 h-9" />
            </div>
          </CardContent>
        </Card>
      ))
  }

  const renderGridView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {loading ? (
        renderSkeletons()
      ) : (
        <AnimatePresence>
          {filteredMachines.map((machine) => (
            <motion.div
              key={machine._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="flex flex-col h-full transition-shadow bg-gray-50 dark:bg-zinc-700 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {machine.name}
                    </CardTitle>
                    {getStatusIcon(machine.status)}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow py-2">
                  <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-300">{machine.description}</p>
                  {getStatusBadge(machine.status)}
                </CardContent>
                <CardFooter className="flex justify-end pt-2 space-x-2">
                  <Link to={`/machines/edit/${machine._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={() => handleDeleteClick(machine)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  )

  return (
    <MainLayout>
      <div className="container py-8 mx-auto">
        <Card className="bg-white shadow-lg dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
          <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Machines</CardTitle>
              <CardDescription>Manage your equipment and machinery</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchMachines} className="h-9">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link to="/machines/create">
                <Button className="text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 h-9">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Machine
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Filters and search */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search machines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Status counts */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-green-100 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">Active</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                      {machines.filter((m) => m.status === "active").length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </CardContent>
              </Card>

              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Maintenance</p>
                    <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                      {machines.filter((m) => m.status === "maintenance").length}
                    </p>
                  </div>
                  <Wrench className="w-8 h-8 text-amber-500" />
                </CardContent>
              </Card>

              <Card className="border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">Inactive</p>
                    <p className="text-2xl font-bold text-red-900 dark:text-red-200">
                      {machines.filter((m) => m.status === "inactive").length}
                    </p>
                  </div>
                  <PowerOff className="w-8 h-8 text-red-500" />
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Error message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Machines list/grid */}
            {!loading && filteredMachines.length === 0 && !error ? (
              <div className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <Settings className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No machines found</h3>
                <p className="mb-4 text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first machine"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Link to="/machines/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Machine
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              renderGridView()
            )}
          </CardContent>
        </Card>

        {/* Delete confirmation dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the machine "{machineToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}

export default ShowMachines
