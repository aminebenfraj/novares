"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { getAllPedidos, deletePedido, getFilterOptions } from "../../apis/pedido/pedidoApi"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  MoreHorizontal,
  FileText,
  Trash2,
  Edit,
  Filter,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Box,
  X,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import MainLayout from "@/components/MainLayout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const PedidoList = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [pedidos, setPedidos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pedidoToDelete, setPedidoToDelete] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    tipo: [],
    fabricante: [],
    proveedor: [],
    solicitante: [],
    recepcionado: [],
    pedir: [],
    ano: [],
    table_status: [],
  })

  const [filters, setFilters] = useState({
    tipo: "",
    fabricante: "",
    proveedor: "",
    solicitante: "",
    recepcionado: "",
    pedir: "",
    anoDesde: "",
    anoHasta: "",
    fechaDesde: null,
    fechaHasta: null,
    table_status: "",
    status: "",
    stockStatus: "",
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  // Debounce search to avoid too many requests
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Load filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = {}

        for (const field of [
          "tipo",
          "fabricante",
          "proveedor",
          "solicitante",
          "recepcionado",
          "pedir",
          "ano",
          "table_status",
        ]) {
          const data = await getFilterOptions(field)
          options[field] = data
        }

        setFilterOptions(options)
      } catch (error) {
        console.error("Error loading filter options:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load filter options",
        })
      }
    }

    loadFilterOptions()
  }, [])

  const handleFilterChange = (field, value) => {
    // If value is "all", set to empty string for any field
    if (value === "all") {
      setFilters((prev) => ({
        ...prev,
        [field]: "",
      }))
      return
    }

    // For all other fields
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const fetchPedidos = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Create a clean copy of filters for API
      const apiFilters = {}

      // Process each filter and only add non-empty values
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          apiFilters[key] = value
        }
      })

      const response = await getAllPedidos(pagination.page, pagination.limit, debouncedSearch, apiFilters)

      if (response && response.data) {
        setPedidos(response.data)

        setPagination({
          ...pagination,
          page: response.page || 1,
          total: response.total || 0,
          totalPages: response.totalPages || 0,
        })
      } else {
        setError("Invalid data received from server.")
      }
    } catch (error) {
      console.error("Error fetching pedidos:", error)
      setError("Failed to load orders. Please try again later.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load orders. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch pedidos when pagination, search, filters change
  useEffect(() => {
    fetchPedidos()
  }, [pagination.page, pagination.limit, debouncedSearch])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchPedidos()
  }, [filters])

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const confirmDelete = (pedido) => {
    setPedidoToDelete(pedido)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!pedidoToDelete) return

    try {
      await deletePedido(pedidoToDelete._id)
      setPedidos(pedidos.filter((pedido) => pedido._id !== pedidoToDelete._id))
      toast({
        title: "Success",
        description: "Order deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting order:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete order. Please try again.",
      })
    } finally {
      setDeleteDialogOpen(false)
      setPedidoToDelete(null)
    }
  }

  const clearFilters = () => {
    setFilters({
      tipo: "",
      fabricante: "",
      proveedor: "",
      solicitante: "",
      recepcionado: "",
      pedir: "",
      anoDesde: "",
      anoHasta: "",
      fechaDesde: null,
      fechaHasta: null,
      table_status: "",
      status: "",
      stockStatus: "",
    })
  }

  const getStatusFromPedido = (pedido) => {
    if (pedido.recepcionado === "Si") return "completed"
    if (pedido.aceptado) return "in_progress"
    if (pedido.introducidaSAP) return "pending"
    return "cancelled"
  }

  const getStatusDetails = (status) => {
    const statusMap = {
      pending: {
        label: "Pending",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      },
      in_progress: {
        label: "In Progress",
        icon: Package,
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      },
      completed: {
        label: "Completed",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      cancelled: {
        label: "Cancelled",
        icon: AlertCircle,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
    }
    return statusMap[status] || statusMap.pending
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount) => {
    if (!amount) return "N/A"
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  // Helper function to safely extract property values from objects
  const getPropertyValue = (obj, property) => {
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

  return (
    <MainLayout>
      <motion.div className="container py-6 mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders Management</h1>
            <p className="text-muted-foreground">Track and manage your purchase orders efficiently</p>
          </div>
          <Button onClick={() => navigate("/pedido/create")} className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Order
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by any field..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Filters
                    {Object.values(filters).some((v) => v !== "" && v !== null) && (
                      <Badge variant="secondary" className="ml-1">
                        {Object.values(filters).filter((v) => v !== "" && v !== null).length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-80" align="end">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                        <X className="w-4 h-4 mr-2" />
                        Clear all
                      </Button>
                    </div>
                  </div>
                  {/* Filter options would go here */}
                  <div className="flex items-center justify-between p-4 border-t">
                    <Button variant="ghost" onClick={() => setIsFilterOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        fetchPedidos()
                        setIsFilterOpen(false)
                      }}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading orders...</span>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Box className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">No orders found</h3>
                <p className="mt-1 mb-4 text-muted-foreground">
                  {searchTerm || Object.values(filters).some((v) => v !== "" && v !== null)
                    ? "Try adjusting your filters"
                    : "Create your first order to get started"}
                </p>
                {!searchTerm && !Object.values(filters).some((v) => v !== "" && v !== null) && (
                  <Button onClick={() => navigate("/pedido/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Order
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence initial={false} mode="popLayout">
                      {pedidos.map((pedido) => {
                        const status = getStatusFromPedido(pedido)
                        const statusDetails = getStatusDetails(status)
                        const StatusIcon = statusDetails.icon
                        return (
                          <motion.tr
                            key={pedido._id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="hover:bg-muted/50"
                          >
                            <TableCell>{getPropertyValue(pedido.tipo)}</TableCell>
                            <TableCell className="font-medium">{getPropertyValue(pedido.referencia)}</TableCell>
                            <TableCell>{getPropertyValue(pedido.solicitante)}</TableCell>
                            <TableCell>{getPropertyValue(pedido.proveedor)}</TableCell>
                            <TableCell className="font-semibold">{formatCurrency(pedido.importePedido)}</TableCell>
                            <TableCell>{formatDate(pedido.fechaSolicitud)}</TableCell>
                            <TableCell>
                              {pedido.table_status ? (
                                <div className="flex items-center space-x-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: pedido.table_status.color }}
                                  ></div>
                                  <span>{pedido.table_status.name}</span>
                                </div>
                              ) : (
                                <Badge variant="secondary" className={statusDetails.className}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusDetails.label}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => navigate(`/pedido/${pedido._id}`)}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigate(`/pedido/edit/${pedido._id}`)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => confirmDelete(pedido)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex items-center justify-between px-2 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {pedidos.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the order
                <span className="font-semibold"> {getPropertyValue(pedidoToDelete?.referencia)}</span>. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </MainLayout>
  )
}

export default PedidoList
