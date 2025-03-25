"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllPedidos, deletePedido, getFilterOptions } from "../../apis/pedido/pedidoApi"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  MoreVertical,
  FileText,
  Trash2,
  Edit3,
  Filter,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Calendar,
  DollarSign,
  User,
  Briefcase,
  Box,
  ArrowUpDown,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import MainLayout from "@/components/MainLayout"
import { motion } from "framer-motion"

function PedidoList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [pedidos, setPedidos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTab, setCurrentTab] = useState("all")
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    tipo: [],
    fabricante: [],
    proveedor: [],
    solicitante: [],
    recepcionado: [],
    pedir: [],
    ano: [],
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
  })

  const [sort, setSort] = useState({
    field: "fechaSolicitud",
    order: -1,
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

        for (const field of ["tipo", "fabricante", "proveedor", "solicitante", "recepcionado", "pedir", "ano"]) {
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

  const fetchPedidos = async () => {
    try {
      setIsLoading(true)

      const response = await getAllPedidos(pagination.page, pagination.limit, debouncedSearch, filters, sort)

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
      console.error("❌ Error fetching pedidos:", error)
      setError("Failed to load pedidos. Please try again later.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load pedidos. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch pedidos when pagination, search, filters or sort changes
  useEffect(() => {
    fetchPedidos()
  }, [pagination.page, pagination.limit, debouncedSearch, currentTab, sort])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchPedidos()
  }, [filters])

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleDelete = async (id) => {
    try {
      await deletePedido(id)
      await fetchPedidos()
      setIsDeleteDialogOpen(false)
      toast({
        title: "Success",
        description: "Order deleted successfully",
      })
    } catch (error) {
      console.error("❌ Error deleting pedido:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the order. Please try again.",
      })
    }
  }

  const handleEditClick = (pedido) => {
    navigate(`/pedido/edit/${pedido._id}`)
  }

  const handleViewDetails = (pedido) => {
    navigate(`/pedido/${pedido._id}`)
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
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
    })
  }

  const handleSortChange = (field) => {
    setSort((prev) => {
      if (prev.field === field) {
        // Toggle order if same field
        return { field, order: prev.order === 1 ? -1 : 1 }
      }
      // Default to descending for new field
      return { field, order: -1 }
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

  if (error && pedidos.length === 0) {
    return (
      <MainLayout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container py-8 mx-auto">
          <Card className="max-w-lg mx-auto mt-8">
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => fetchPedidos()}>Try Again</Button>
            </CardContent>
          </Card>
        </motion.div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
        <div className="container py-8 mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center"
          >
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Orders Management</h1>
              <p className="mt-2 text-muted-foreground">Track and manage your purchase orders efficiently</p>
            </div>
            <Button className="flex items-center gap-2" onClick={() => navigate("/pedido/create")} size="lg">
              <Plus className="w-4 h-4" />
              Create Order
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid gap-6"
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute w-4 h-4 transform -translate-y-1/2 text-muted-foreground left-3 top-1/2" />
                    <Input
                      placeholder="Search orders by any field..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9"
                    />
                  </div>
                  <div className="flex items-center w-full gap-2 md:w-auto">
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Filter className="w-4 h-4" />
                          Filters
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
                        <ScrollArea className="h-[400px]">
                          <div className="p-4 space-y-4">
                            {/* Type Filter */}
                            <div>
                              <label className="text-sm font-medium">Type</label>
                              <Select value={filters.tipo} onValueChange={(value) => handleFilterChange("tipo", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Types</SelectItem>
                                  {filterOptions.tipo.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Provider Filter */}
                            <div>
                              <label className="text-sm font-medium">Provider</label>
                              <Select
                                value={filters.proveedor}
                                onValueChange={(value) => handleFilterChange("proveedor", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Providers</SelectItem>
                                  {filterOptions.proveedor.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Requester Filter */}
                            <div>
                              <label className="text-sm font-medium">Requester</label>
                              <Select
                                value={filters.solicitante}
                                onValueChange={(value) => handleFilterChange("solicitante", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select requester" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Requesters</SelectItem>
                                  {filterOptions.solicitante.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Year Range Filter */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Year Range</label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  placeholder="From"
                                  value={filters.anoDesde}
                                  onChange={(e) => handleFilterChange("anoDesde", e.target.value)}
                                  className="w-full"
                                />
                                <span>-</span>
                                <Input
                                  type="number"
                                  placeholder="To"
                                  value={filters.anoHasta}
                                  onChange={(e) => handleFilterChange("anoHasta", e.target.value)}
                                  className="w-full"
                                />
                              </div>
                            </div>

                            {/* Received Filter */}
                            <div>
                              <label className="text-sm font-medium">Received</label>
                              <Select
                                value={filters.recepcionado}
                                onValueChange={(value) => handleFilterChange("recepcionado", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All</SelectItem>
                                  <SelectItem value="Si">Yes</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </ScrollArea>
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

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4" />
                          Sort
                          <ArrowUpDown className="w-3 h-3 ml-1" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="space-y-2">
                          <h4 className="font-medium">Sort by</h4>
                          <div className="space-y-1">
                            {[
                              { id: "fechaSolicitud", label: "Request Date", icon: Calendar },
                              { id: "referencia", label: "Reference", icon: FileText },
                              { id: "solicitante", label: "Requester", icon: User },
                              { id: "importePedido", label: "Amount", icon: DollarSign },
                              { id: "proveedor", label: "Provider", icon: Briefcase },
                            ].map((option) => (
                              <Button
                                key={option.id}
                                variant="ghost"
                                className="flex items-center justify-between w-full"
                                onClick={() => handleSortChange(option.id)}
                              >
                                <span className="flex items-center">
                                  <option.icon className="w-4 h-4 mr-2" />
                                  {option.label}
                                </span>
                                {sort.field === option.id && <span>{sort.order === 1 ? "↑" : "↓"}</span>}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                  <TabsList className="justify-start w-full px-6 border-b rounded-none">
                    <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">
                      All Orders
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900 dark:data-[state=active]:bg-yellow-900 dark:data-[state=active]:text-yellow-100"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Pending
                    </TabsTrigger>
                    <TabsTrigger
                      value="in_progress"
                      className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-100"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      In Progress
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-100"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </TabsTrigger>
                    <TabsTrigger
                      value="cancelled"
                      className="data-[state=active]:bg-red-100 data-[state=active]:text-red-900 dark:data-[state=active]:bg-red-900 dark:data-[state=active]:text-red-100"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Cancelled
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value={currentTab} className="m-0">
                    {isLoading ? (
                      <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[250px]" />
                              <Skeleton className="h-4 w-[200px]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ScrollArea className="h-[calc(100vh-20rem)]">
                        <div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead
                                  onClick={() => handleSortChange("tipo")}
                                  className="cursor-pointer hover:text-primary"
                                >
                                  <div className="flex items-center">
                                    Type
                                    {sort.field === "tipo" && (
                                      <span className="ml-1">{sort.order === 1 ? "↑" : "↓"}</span>
                                    )}
                                  </div>
                                </TableHead>
                                <TableHead
                                  onClick={() => handleSortChange("referencia")}
                                  className="cursor-pointer hover:text-primary"
                                >
                                  <div className="flex items-center">
                                    Reference
                                    {sort.field === "referencia" && (
                                      <span className="ml-1">{sort.order === 1 ? "↑" : "↓"}</span>
                                    )}
                                  </div>
                                </TableHead>
                                <TableHead
                                  onClick={() => handleSortChange("solicitante")}
                                  className="cursor-pointer hover:text-primary"
                                >
                                  <div className="flex items-center">
                                    Requester
                                    {sort.field === "solicitante" && (
                                      <span className="ml-1">{sort.order === 1 ? "↑" : "↓"}</span>
                                    )}
                                  </div>
                                </TableHead>
                                <TableHead>Manufacturer</TableHead>
                                <TableHead
                                  onClick={() => handleSortChange("proveedor")}
                                  className="cursor-pointer hover:text-primary"
                                >
                                  <div className="flex items-center">
                                    Provider
                                    {sort.field === "proveedor" && (
                                      <span className="ml-1">{sort.order === 1 ? "↑" : "↓"}</span>
                                    )}
                                  </div>
                                </TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead
                                  onClick={() => handleSortChange("importePedido")}
                                  className="cursor-pointer hover:text-primary"
                                >
                                  <div className="flex items-center">
                                    Amount
                                    {sort.field === "importePedido" && (
                                      <span className="ml-1">{sort.order === 1 ? "↑" : "↓"}</span>
                                    )}
                                  </div>
                                </TableHead>
                                <TableHead
                                  onClick={() => handleSortChange("fechaSolicitud")}
                                  className="cursor-pointer hover:text-primary"
                                >
                                  <div className="flex items-center">
                                    Request Date
                                    {sort.field === "fechaSolicitud" && (
                                      <span className="ml-1">{sort.order === 1 ? "↑" : "↓"}</span>
                                    )}
                                  </div>
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pedidos.map((pedido) => {
                                const status = getStatusFromPedido(pedido)
                                const statusDetails = getStatusDetails(status)
                                const StatusIcon = statusDetails.icon
                                return (
                                  <tr
                                    key={pedido._id}
                                    className="cursor-pointer group hover:bg-muted/50"
                                    onClick={() => handleViewDetails(pedido)}
                                  >
                                    <TableCell>{getPropertyValue(pedido.tipo)}</TableCell>
                                    <TableCell className="font-medium">{getPropertyValue(pedido.referencia)}</TableCell>
                                    <TableCell>{getPropertyValue(pedido.solicitante)}</TableCell>
                                    <TableCell>{pedido.fabricante || "N/A"}</TableCell>
                                    <TableCell>{getPropertyValue(pedido.proveedor)}</TableCell>
                                    <TableCell>{pedido.cantidad}</TableCell>
                                    <TableCell>{formatCurrency(pedido.precioUnidad)}</TableCell>
                                    <TableCell className="font-semibold">
                                      {formatCurrency(pedido.importePedido)}
                                    </TableCell>
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
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100"
                                          >
                                            <MoreVertical className="w-4 h-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                          <DropdownMenuItem onClick={() => handleViewDetails(pedido)}>
                                            <FileText className="w-4 h-4 mr-2" />
                                            View Details
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleEditClick(pedido)}>
                                            <Edit3 className="w-4 h-4 mr-2" />
                                            Edit Order
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => {
                                              setSelectedPedido(pedido)
                                              setIsDeleteDialogOpen(true)
                                            }}
                                          >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Order
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </TableCell>
                                  </tr>
                                )
                              })}

                              {pedidos.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={11} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center py-8">
                                      <Box className="w-12 h-12 mb-3 text-muted-foreground" />
                                      <p className="mb-2 text-muted-foreground">No orders found</p>
                                      <Button
                                        variant="outline"
                                        onClick={() => navigate("/pedido/create")}
                                        className="mt-2"
                                      >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create New Order
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </ScrollArea>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center justify-between px-6 py-4 border-t"
                    >
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
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this order? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => selectedPedido && handleDelete(selectedPedido._id)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </MainLayout>
  )
}

export default PedidoList

