"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { getAllMassProductions, deleteMassProduction } from "../../apis/massProductionApi"
import { getAllCustomers } from "../../apis/customerApi"
import { getAllpd } from "../../apis/ProductDesignation-api"
import MainLayout from "@/components/MainLayout"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Icons
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  Loader2,
  Download,
  LayoutDashboard,
  SlidersHorizontal,
  AlertCircle,
  X,
} from "lucide-react"

// Import the AlertDialog components
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

const MassProductionList = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [massProductions, setMassProductions] = useState([])
  const [customers, setCustomers] = useState([])
  const [productDesignations, setProductDesignations] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [customerFilter, setCustomerFilter] = useState("all")
  const [productFilter, setProductFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" })
  const [viewMode, setViewMode] = useState("table")
  const [selectedItems, setSelectedItems] = useState([])
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" })
  const [progressFilter, setProgressFilter] = useState("")
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })

  const [idFilter, setIdFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [requestDateFilter, setRequestDateFilter] = useState("")

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Stats for dashboard
  const stats = useMemo(() => {
    return {
      total: pagination.total || 0,
      ongoing: massProductions.filter((item) => item.status === "on-going").length,
      standby: massProductions.filter((item) => item.status === "stand-by").length,
      closed: massProductions.filter((item) => item.status === "closed").length,
      cancelled: massProductions.filter((item) => item.status === "cancelled").length,
    }
  }, [massProductions, pagination.total])

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [customersData, productDesignationsData] = await Promise.all([getAllCustomers(), getAllpd()])

        if (Array.isArray(customersData)) {
          setCustomers(customersData)
        }

        if (Array.isArray(productDesignationsData)) {
          setProductDesignations(productDesignationsData)
        }
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
  }, [toast])

  // Fetch data with filters and pagination
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Prepare query parameters
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchTerm,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction === "asc" ? 1 : -1,
      }

      // Add filters if they exist
      if (statusFilter !== "all") params.status = statusFilter
      if (customerFilter !== "all") params.customer = customerFilter
      if (productFilter !== "all") params.product_designation = productFilter
      if (idFilter !== "all") params.id = idFilter
      if (projectFilter !== "all") params.project_n = projectFilter
      if (requestDateFilter) params.dateFrom = requestDateFilter
      if (dateFilter.to) params.dateTo = dateFilter.to

      const response = await getAllMassProductions(params)

      if (response && response.data) {
        // Add calculated completion percentage to each item
        const enhancedData = response.data.map((item) => ({
          ...item,
          completionPercentage: calculateCompletionPercentage(item),
        }))

        setMassProductions(enhancedData)

        // Update pagination info
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          })
        }
      } else {
        setError("Invalid data format received from server")
        setMassProductions([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load data. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load data. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearchTerm,
    statusFilter,
    customerFilter,
    productFilter,
    dateFilter,
    sortConfig,
    toast,
    idFilter,
    projectFilter,
    requestDateFilter,
  ])

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [
    debouncedSearchTerm,
    statusFilter,
    customerFilter,
    productFilter,
    idFilter,
    projectFilter,
    requestDateFilter,
    dateFilter,
    sortConfig,
  ])

  // Calculate completion percentage for a mass production item
  const calculateCompletionPercentage = useCallback((item) => {
    if (!item) return 0

    // Define all possible stages with their weights
    const stages = [
      { key: "feasibility", data: item.feasibility || item.feasability, weight: 1.0 },
      { key: "validation_for_offer", data: item.validation_for_offer, weight: 1.0 },
      { key: "ok_for_lunch", data: item.ok_for_lunch, weight: 1.0 },
      { key: "kick_off", data: item.kick_off, weight: 1.0 },
      { key: "design", data: item.design, weight: 1.0 },
      { key: "facilities", data: item.facilities, weight: 1.0 },
      { key: "p_p_tuning", data: item.p_p_tuning, weight: 1.0 },
      { key: "process_qualif", data: item.process_qualif, weight: 1.0 },
      { key: "qualification_confirmation", data: item.qualification_confirmation, weight: 1.0 },
    ]

    // Calculate total weight and weighted completion
    const totalWeight = stages.reduce((sum, stage) => sum + stage.weight, 0)
    let weightedCompletion = 0

    stages.forEach((stage) => {
      if (!stage.data) return

      // For completed stages
      if (isStageCompleted(stage.data)) {
        weightedCompletion += stage.weight
      }
      // For partially completed stages
      else if (typeof stage.data === "object") {
        const stagePercentage = calculateStagePercentage(stage.data)
        weightedCompletion += (stage.weight * stagePercentage) / 100
      }
    })

    return Math.round((weightedCompletion / totalWeight) * 100)
  }, [])

  // Improve stage percentage calculation for more accurate tracking
  const calculateStagePercentage = (stage) => {
    if (!stage) return 0

    // If it's a simple object with a direct check or value
    if (stage.check !== undefined || stage.value !== undefined) {
      return stage.check || stage.value ? 100 : 0
    }

    // For complex objects with tasks
    const tasks = Object.entries(stage).filter(
      ([key, value]) => typeof value === "object" && value !== null && !key.startsWith("_") && key !== "checkin",
    )

    if (tasks.length === 0) return 0

    let completedTasksCount = 0
    let totalTasksCount = 0

    // Count completed tasks with proper weighting
    tasks.forEach(([_, value]) => {
      totalTasksCount++

      if (value.value === true || value.check === true || (value.task && value.task.check === true)) {
        completedTasksCount++
      } else if (value.percentage !== undefined) {
        // If task has a percentage, add partial completion
        completedTasksCount += value.percentage / 100
      } else if (typeof value === "object" && Object.keys(value).some((k) => value[k] === true)) {
        // If any property is true, count as partially complete
        const trueProps = Object.values(value).filter((v) => v === true).length
        const totalProps = Object.keys(value).length
        completedTasksCount += trueProps / totalProps
      }
    })

    return Math.round((completedTasksCount / totalTasksCount) * 100)
  }

  // Check if a stage is completed
  const isStageCompleted = useCallback((stage) => {
    if (!stage) return false

    // Check if stage has a 'check' property that is true
    if (stage.check === true) return true

    // Check if stage has a 'value' property that is true
    if (stage.value === true) return true

    // If stage is an object with nested properties
    if (typeof stage === "object") {
      // For objects with task properties, check if all tasks are completed
      const tasks = Object.entries(stage).filter(
        ([key, value]) => typeof value === "object" && value !== null && !key.startsWith("_") && key !== "checkin",
      )

      if (tasks.length > 0) {
        // Calculate percentage of completed tasks
        const completedTasks = tasks.filter(
          ([_, value]) => value.value === true || value.check === true || (value.task && value.task.check === true),
        ).length

        // Consider completed if at least 80% of tasks are done
        return completedTasks / tasks.length >= 0.8
      }

      // Check if any property has a 'check' or 'value' that is true
      return Object.values(stage).some((prop) => {
        if (typeof prop === "object" && prop !== null) {
          return prop.check === true || prop.value === true
        }
        return false
      })
    }

    return false
  }, [])

  // Handle sort request
  const requestSort = useCallback(
    (key) => {
      let direction = "asc"
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc"
      }
      setSortConfig({ key, direction })
    },
    [sortConfig],
  )

  // Handle delete confirmation
  const handleDeleteClick = useCallback((item) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }, [])

  // Handle delete action
  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      setDeleteLoading(true)
      await deleteMassProduction(itemToDelete._id)

      // Refresh data after deletion
      fetchData()

      toast({
        title: "Success",
        description: "Mass production record deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting mass production record:", error)
      toast({
        title: "Error",
        description: "Failed to delete mass production record",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      setDeleteLoading(false)
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return

    setDeleteLoading(true)
    try {
      // Delete each selected item
      await Promise.all(selectedItems.map((id) => deleteMassProduction(id)))

      // Refresh data after deletion
      fetchData()

      toast({
        title: "Success",
        description: `${selectedItems.length} records deleted successfully.`,
      })

      // Clear selected items
      setSelectedItems([])
    } catch (error) {
      console.error("Error deleting records:", error)
      toast({
        title: "Error",
        description: "Failed to delete records. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
      setBulkActionDialogOpen(false)
    }
  }

  // Handle refresh data
  const handleRefresh = () => {
    fetchData()
    toast({
      title: "Refreshing",
      description: "Refreshing data...",
    })
  }

  // Handle checkbox selection
  const handleSelectItem = useCallback((id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id)
      } else {
        return [...prev, id]
      }
    })
  }, [])

  // Handle select all items on current page
  const handleSelectAllOnPage = useCallback(
    (checked) => {
      if (checked) {
        const currentPageIds = massProductions.map((item) => item._id)
        setSelectedItems((prev) => [...new Set([...prev, ...currentPageIds])])
      } else {
        const currentPageIds = massProductions.map((item) => item._id)
        setSelectedItems((prev) => prev.filter((id) => !currentPageIds.includes(id)))
      }
    },
    [massProductions],
  )

  // Export selected items to CSV
  const exportToCSV = () => {
    // Get items to export
    const itemsToExport =
      selectedItems.length > 0 ? massProductions.filter((item) => selectedItems.includes(item._id)) : massProductions

    if (itemsToExport.length === 0) {
      toast({
        title: "No items to export",
        description: "Please select at least one item to export.",
        variant: "destructive",
      })
      return
    }

    // Create CSV content
    const headers = ["ID", "Project", "Customer", "Request Date", "Status", "Next Review", "Completion %"]

    const rows = itemsToExport.map((item) => [
      item.id || "",
      item.project_n || "",
      item.customer ? item.customer.username : "N/A",
      formatDate(item.initial_request),
      item.status || "",
      formatDate(item.next_review),
      item.completionPercentage || 0,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `mass-productions-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export successful",
      description: `${itemsToExport.length} records exported to CSV.`,
    })

    // Clear selected items after export
    if (selectedItems.length > 0) {
      setSelectedItems([])
      setBulkActionDialogOpen(false)
    }
  }

  // Get status badge variant
  const getStatusBadge = useCallback((status) => {
    switch (status) {
      case "on-going":
        return { variant: "default", icon: <Clock className="w-3 h-3 mr-1" /> }
      case "stand-by":
        return { variant: "warning", icon: <AlertTriangle className="w-3 h-3 mr-1" /> }
      case "closed":
        return { variant: "success", icon: <CheckCircle className="w-3 h-3 mr-1" /> }
      case "cancelled":
        return { variant: "destructive", icon: <XCircle className="w-3 h-3 mr-1" /> }
      default:
        return { variant: "secondary", icon: null }
    }
  }, [])

  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }, [])

  // Get progress color based on percentage
  const getProgressColor = useCallback((percentage) => {
    if (percentage >= 90) return "bg-green-600"
    if (percentage >= 75) return "bg-green-500"
    if (percentage >= 50) return "bg-amber-500"
    if (percentage >= 25) return "bg-orange-500"
    return "bg-red-500"
  }, [])

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setCustomerFilter("all")
    setProductFilter("all")
    setIdFilter("all")
    setProjectFilter("all")
    setRequestDateFilter("")
    setDateFilter({ from: "", to: "" })
    setSortConfig({ key: "createdAt", direction: "desc" })
  }

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton className="w-4 h-4 rounded-sm" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[80px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[120px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[80px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[100px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[40px]" />
          </TableCell>
        </TableRow>
      ))
  }

  // Render card skeletons
  const renderCardSkeletons = () => {
    return Array(6)
      .fill()
      .map((_, index) => (
        <motion.div
          key={`card-skeleton-${index}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
        >
          <Card className="h-[220px]">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[140px] mb-2" />
              <Skeleton className="h-3 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-3 mb-2" />
              <Skeleton className="w-3/4 h-3 mb-2" />
              <Skeleton className="w-1/2 h-3 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-[80px]" />
                <Skeleton className="h-6 w-[40px]" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))
  }

  // Render pagination controls
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
              disabled={pagination.page === 1}
              className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
            // Show first page, last page, current page, and pages around current
            let pageToShow

            if (pagination.totalPages <= 5) {
              // If 5 or fewer pages, show all
              pageToShow = i + 1
            } else if (pagination.page <= 3) {
              // If near start, show first 5
              pageToShow = i + 1
              if (i === 4)
                return (
                  <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                  </PaginationItem>
                )
            } else if (pagination.page >= pagination.totalPages - 2) {
              // If near end, show last 5
              pageToShow = pagination.totalPages - 4 + i
              if (i === 0)
                return (
                  <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                  </PaginationItem>
                )
            } else {
              // If in middle, show current and surrounding
              pageToShow = pagination.page - 2 + i
              if (i === 0)
                return (
                  <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              if (i === 4)
                return (
                  <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                  </PaginationItem>
                )
            }

            return (
              <PaginationItem key={pageToShow}>
                <PaginationLink
                  isActive={pagination.page === pageToShow}
                  onClick={() => setPagination((prev) => ({ ...prev, page: pageToShow }))}
                >
                  {pageToShow}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(prev.page + 1, prev.totalPages) }))}
              disabled={pagination.page === pagination.totalPages}
              className={
                pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  // Render stats dashboard
  const renderStatsDashboard = () => {
    return (
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 rounded-full bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On-going</p>
                <p className="text-2xl font-bold">{stats.ongoing}</p>
              </div>
              <div className="p-2 rounded-full bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stand-by</p>
                <p className="text-2xl font-bold">{stats.standby}</p>
              </div>
              <div className="p-2 rounded-full bg-amber-100">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold">{stats.closed}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render advanced filters
  const renderAdvancedFilters = () => {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
              <CardDescription>Refine your search with additional filters</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setAdvancedFiltersOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Designation</label>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {productDesignations.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.part_name} ({product.reference})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" className="flex-1" onClick={clearFilters}>
                Reset All Filters
              </Button>
              <Button variant="default" className="flex-1" onClick={() => setAdvancedFiltersOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Enhance the table view with improved tracking visualization
  const renderTableView = () => {
    const areAllCurrentPageSelected =
      massProductions.length > 0 && massProductions.every((item) => selectedItems.includes(item._id))

    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox checked={areAllCurrentPageSelected} onCheckedChange={handleSelectAllOnPage} />
              </TableHead>
              <TableHead className="w-[100px]">
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("id")}>
                  ID
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("project_n")}>
                  Project
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("customer.username")}>
                  Customer
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("initial_request")}>
                  Request Date
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("status")}>
                  Status
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("completionPercentage")}>
                  Progress
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              renderSkeletons()
            ) : massProductions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {massProductions.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item._id)}
                        onCheckedChange={() => handleSelectItem(item._id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.project_n}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.customer ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback>{item.customer.username?.[0] || "C"}</AvatarFallback>
                          </Avatar>
                          <span>{item.customer.username}</span>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{formatDate(item.initial_request)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(item.status).variant} className="flex items-center w-fit">
                        {getStatusBadge(item.status).icon}
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <div className="relative w-20 h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                  className={`absolute top-0 left-0 h-full ${getProgressColor(item.completionPercentage || 0)}`}
                                  style={{ width: `${item.completionPercentage || 0}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium">{item.completionPercentage || 0}%</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="p-0">
                            <div className="p-2">
                              <p className="mb-1 font-medium">Progress: {item.completionPercentage || 0}%</p>
                              <div className="space-y-1 text-xs">
                                {item.feasibility && (
                                  <div className="flex justify-between">
                                    <span>Feasibility:</span> <span>{calculateStagePercentage(item.feasibility)}%</span>
                                  </div>
                                )}
                                {item.validation_for_offer && (
                                  <div className="flex justify-between">
                                    <span>Validation:</span>{" "}
                                    <span>{calculateStagePercentage(item.validation_for_offer)}%</span>
                                  </div>
                                )}
                                {item.ok_for_lunch && (
                                  <div className="flex justify-between">
                                    <span>OK for Launch:</span>{" "}
                                    <span>{calculateStagePercentage(item.ok_for_lunch)}%</span>
                                  </div>
                                )}
                                {item.kick_off && (
                                  <div className="flex justify-between">
                                    <span>Kick Off:</span> <span>{calculateStagePercentage(item.kick_off)}%</span>
                                  </div>
                                )}
                                {item.design && (
                                  <div className="flex justify-between">
                                    <span>Design:</span> <span>{calculateStagePercentage(item.design)}%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-8 h-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          <DropdownMenuItem onClick={() => navigate(`/masspd/detail/${item._id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => navigate(`/masspd/edit/${item._id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Render card view
  const renderCardView = () => {
    if (loading) {
      return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{renderCardSkeletons()}</div>
    }

    if (massProductions.length === 0) {
      return (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center h-40">
            <FileText className="w-10 h-10 mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No records found.</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {massProductions.map((item, index) => (
            <motion.div
              key={item._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2, delay: index * 0.03 }}
              whileHover={{ y: -3, transition: { duration: 0.1 } }}
              className="h-full"
            >
              <Card
                className="flex flex-col h-full border-l-4"
                style={{
                  borderLeftColor:
                    item.completionPercentage >= 80
                      ? "rgb(34, 197, 94)" // green-500
                      : item.completionPercentage >= 50
                        ? "rgb(245, 158, 11)" // amber-500
                        : item.completionPercentage >= 20
                          ? "rgb(249, 115, 22)" // orange-500
                          : "rgb(239, 68, 68)", // red-500
                }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedItems.includes(item._id)}
                          onCheckedChange={() => handleSelectItem(item._id)}
                          className="mr-1"
                        />
                        <CardTitle className="text-lg truncate">{item.project_n}</CardTitle>
                      </div>
                      <CardDescription>ID: {item.id}</CardDescription>
                    </div>
                    <Badge variant={getStatusBadge(item.status).variant} className="flex items-center">
                      {getStatusBadge(item.status).icon}
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Customer:</span>
                      <span className="font-medium">{item.customer ? item.customer.username : "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Request Date:</span>
                      <span>{formatDate(item.initial_request)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Customer Offer:</span>
                      <span>{item.customer_offer === "fulfilled" ? "Fulfilled" : "Expected/In Progress"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Customer Order:</span>
                      <span>{item.customer_order === "fulfilled" ? "Fulfilled" : "Expected/In Progress"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress:</span>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={item.completionPercentage || 0}
                          className="w-16 h-2"
                          indicatorClassName={getProgressColor(item.completionPercentage || 0)}
                        />
                        <span className="text-xs font-medium">{item.completionPercentage || 0}%</span>
                      </div>
                    </div>
                  </div>
                  {item.description && (
                    <p className="mb-2 text-sm line-clamp-2 text-muted-foreground">{item.description}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/masspd/detail/${item._id}`)}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/masspd/edit/${item._id}`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <MainLayout>
      <motion.div className="container py-6 mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold">Mass Production</h1>
              <p className="text-muted-foreground">Manage and track all mass production records.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleRefresh} variant="outline" size="icon" className="h-9 w-9">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button onClick={() => navigate("/masspd/create")} className="gap-1">
                <Plus className="w-4 h-4" />
                New Record
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Dashboard */}
          {renderStatsDashboard()}

          {/* Advanced Filters Toggle */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)} className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              {advancedFiltersOpen ? "Hide Advanced Filters" : "Show Advanced Filters"}
            </Button>
          </div>

          {/* Advanced Filters */}
          {advancedFiltersOpen && renderAdvancedFilters()}

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, project number, description or customer..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                  {/* ID Filter */}
                  <div>
                    <Select value={idFilter} onValueChange={setIdFilter}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <SelectValue placeholder="ID" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All IDs</SelectItem>
                        {massProductions
                          .map((item) => item.id)
                          .filter((value, index, self) => value && self.indexOf(value) === index)
                          .map((id) => (
                            <SelectItem key={id} value={id}>
                              {id}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Project Filter */}
                  <div>
                    <Select value={projectFilter} onValueChange={setProjectFilter}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <SelectValue placeholder="Project" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        {massProductions
                          .map((item) => item.project_n)
                          .filter((value, index, self) => value && self.indexOf(value) === index)
                          .map((project) => (
                            <SelectItem key={project} value={project}>
                              {project}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Customer Filter */}
                  <div>
                    <Select value={customerFilter} onValueChange={setCustomerFilter}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <SelectValue placeholder="Customer" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        {customers.map((customer) => (
                          <SelectItem key={customer._id} value={customer._id}>
                            {customer.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Request Date Filter */}
                  <div>
                    <Input
                      type="date"
                      placeholder="Request Date"
                      value={requestDateFilter}
                      onChange={(e) => setRequestDateFilter(e.target.value)}
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <SelectValue placeholder="Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="on-going">On-going</SelectItem>
                        <SelectItem value="stand-by">Stand-by</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={clearFilters} className="gap-2">
                    <X className="w-4 h-4" />
                    Clear Filters
                  </Button>

                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSortConfig({ key: "createdAt", direction: "desc" })}>
                        Date (Newest First)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortConfig({ key: "createdAt", direction: "asc" })}>
                        Date (Oldest First)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortConfig({ key: "project_n", direction: "asc" })}>
                        Project (A-Z)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortConfig({ key: "project_n", direction: "desc" })}>
                        Project (Z-A)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortConfig({ key: "completionPercentage", direction: "desc" })}
                      >
                        Progress (High-Low)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortConfig({ key: "completionPercentage", direction: "asc" })}
                      >
                        Progress (Low-High)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center justify-between p-2 rounded-md bg-muted">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{selectedItems.length} items selected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setBulkActionDialogOpen(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
            </span>
            {loading && (
              <div className="flex items-center gap-1 text-primary">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Loading</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="cards">Card View</TabsTrigger>
              </TabsList>

              <TabsContent value="table">{renderTableView()}</TabsContent>
              <TabsContent value="cards">{renderCardView()}</TabsContent>
            </Tabs>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">{renderPagination()}</div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the mass production record
                <span className="font-semibold"> {itemToDelete?.project_n}</span>. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Action Dialog */}
        <AlertDialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {selectedItems.length} selected records. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete All Selected"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </MainLayout>
  )
}

export default MassProductionList
