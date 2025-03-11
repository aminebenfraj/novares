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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  RefreshCw,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

function PedidoList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [pedidos, setPedidos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTab, setCurrentTab] = useState("all")
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
        description: "Pedido deleted successfully",
      })
    } catch (error) {
      console.error("❌ Error deleting pedido:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the pedido. Please try again.",
      })
    }
  }

  const handleEditClick = (pedido) => {
    navigate(`/pedido/edit/${pedido._id}`)
  }

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDateFilterChange = (field, date) => {
    setFilters((prev) => ({
      ...prev,
      [field]: date,
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
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      in_progress: {
        label: "In Progress",
        icon: Package,
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      completed: {
        label: "Completed",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      cancelled: {
        label: "Cancelled",
        icon: AlertCircle,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
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

  if (isLoading && pedidos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <RefreshCw className="w-8 h-8 text-primary" />
        </div>
      </div>
    )
  }

  if (error && pedidos.length === 0) {
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => fetchPedidos()}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Pedidos Management</h1>
            <p className="mt-2 text-muted-foreground">Track and manage your purchase orders efficiently</p>
          </div>
          <Button className="flex items-center gap-2" onClick={() => navigate("/pedido/create")}>
            <Plus className="w-4 h-4" />
            Create Order
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 text-muted-foreground left-3 top-1/2" />
                  <Input
                    placeholder="Search orders by any field..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
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
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Type</label>
                          <Select value={filters.tipo} onValueChange={(value) => handleFilterChange("tipo", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Types</SelectItem>
                              {filterOptions.tipo.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Manufacturer</label>
                          <Select
                            value={filters.fabricante}
                            onValueChange={(value) => handleFilterChange("fabricante", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select manufacturer" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Manufacturers</SelectItem>
                              {filterOptions.fabricante.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Provider</label>
                          <Select
                            value={filters.proveedor}
                            onValueChange={(value) => handleFilterChange("proveedor", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Providers</SelectItem>
                              {filterOptions.proveedor.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Requester</label>
                          <Select
                            value={filters.solicitante}
                            onValueChange={(value) => handleFilterChange("solicitante", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select requester" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Requesters</SelectItem>
                              {filterOptions.solicitante.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Year Range</label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="From"
                              value={filters.anoDesde}
                              onChange={(e) => handleFilterChange("anoDesde", e.target.value)}
                            />
                            <span>-</span>
                            <Input
                              type="number"
                              placeholder="To"
                              value={filters.anoHasta}
                              onChange={(e) => handleFilterChange("anoHasta", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Request Date Range</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-muted-foreground">From</label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="justify-start w-full font-normal text-left">
                                    {filters.fechaDesde ? format(filters.fechaDesde, "PP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={filters.fechaDesde}
                                    onSelect={(date) => handleDateFilterChange("fechaDesde", date)}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground">To</label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="justify-start w-full font-normal text-left">
                                    {filters.fechaHasta ? format(filters.fechaHasta, "PP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={filters.fechaHasta}
                                    onSelect={(date) => handleDateFilterChange("fechaHasta", date)}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Order Status</label>
                          <Select value={filters.pedir} onValueChange={(value) => handleFilterChange("pedir", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Statuses</SelectItem>
                              {filterOptions.pedir.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Received Status</label>
                          <Select
                            value={filters.recepcionado}
                            onValueChange={(value) => handleFilterChange("recepcionado", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select received status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All</SelectItem>
                              {filterOptions.recepcionado.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
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
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56" align="end">
                    <div className="space-y-2">
                      <h4 className="font-medium">Sort by</h4>
                      <div className="space-y-1">
                        {[
                          { id: "fechaSolicitud", label: "Request Date" },
                          { id: "referencia", label: "Reference" },
                          { id: "solicitante", label: "Requester" },
                          { id: "importePedido", label: "Amount" },
                          { id: "proveedor", label: "Provider" },
                        ].map((option) => (
                          <Button
                            key={option.id}
                            variant="ghost"
                            className="flex items-center justify-between w-full"
                            onClick={() => handleSortChange(option.id)}
                          >
                            {option.label}
                            {sort.field === option.id && <span>{sort.order === 1 ? "↑" : "↓"}</span>}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="justify-start w-full px-6 border-b rounded-none">
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                <TabsContent value={currentTab} className="m-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                    </div>
                  ) : (
                    <ScrollArea className="h-[calc(100vh-20rem)]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Referencia</TableHead>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Fabricante</TableHead>
                            <TableHead>Proveedor</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio Unidad</TableHead>
                            <TableHead>Importe</TableHead>
                            <TableHead>Fecha Solicitud</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pedidos.map((pedido) => {
                            const status = getStatusFromPedido(pedido)
                            const statusDetails = getStatusDetails(status)
                            const StatusIcon = statusDetails.icon
                            return (
                              <TableRow key={pedido._id} className="group">
                                <TableCell>{pedido.tipo}</TableCell>
                                <TableCell className="font-medium">{pedido.referencia}</TableCell>
                                <TableCell>{pedido.solicitante}</TableCell>
                                <TableCell>{pedido.fabricante}</TableCell>
                                <TableCell>{pedido.proveedor}</TableCell>
                                <TableCell>{pedido.cantidad}</TableCell>
                                <TableCell>{formatCurrency(pedido.precioUnidad)}</TableCell>
                                <TableCell>{formatCurrency(pedido.importePedido)}</TableCell>
                                <TableCell>{formatDate(pedido.fechaSolicitud)}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className={statusDetails.className}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusDetails.label}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100">
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedPedido(pedido)
                                          setIsDialogOpen(true)
                                        }}
                                      >
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
                              </TableRow>
                            )
                          })}

                          {pedidos.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={11} className="h-24 text-center">
                                No results found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                  <div className="flex items-center justify-between px-6 py-4 border-t">
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Complete information about order {selectedPedido?.referencia}</DialogDescription>
          </DialogHeader>
          {selectedPedido && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Type</label>
                      <p>{selectedPedido.tipo || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Reference</label>
                      <p>{selectedPedido.referencia}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Requester</label>
                      <p>{selectedPedido.solicitante}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Year</label>
                      <p>{selectedPedido.ano}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Product Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Manufacturer</label>
                      <p>{selectedPedido.fabricante}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Provider</label>
                      <p>{selectedPedido.proveedor}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Internal Description</label>
                      <p>{selectedPedido.descripcionInterna}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Provider Description</label>
                      <p>{selectedPedido.descripcionProveedor}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Order Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Quantity</label>
                      <p>{selectedPedido.cantidad}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Unit Price</label>
                      <p>{formatCurrency(selectedPedido.precioUnidad)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Total Amount</label>
                      <p>{formatCurrency(selectedPedido.importePedido)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Request Date</label>
                      <p>{formatDate(selectedPedido.fechaSolicitud)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Status Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Order</label>
                      <p>{selectedPedido.pedir}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">SAP Entry Date</label>
                      <p>{formatDate(selectedPedido.introducidaSAP)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Acceptance Date</label>
                      <p>{formatDate(selectedPedido.aceptado)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Received</label>
                      <p>{selectedPedido.recepcionado}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Address</label>
                      <p>{selectedPedido.direccion}</p>
                    </div>
                  </div>
                </div>

                {selectedPedido.comentario && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Additional Information</h4>
                    <div>
                      <label className="text-sm text-muted-foreground">Comments</label>
                      <p>{selectedPedido.comentario}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleEditClick(selectedPedido)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  )
}

export default PedidoList

