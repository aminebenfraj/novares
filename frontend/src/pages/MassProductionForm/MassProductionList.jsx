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
  Filter,
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
  const [filteredProductions, setFilteredProductions] = useState([])
  const [customers, setCustomers] = useState([])
  const [productDesignations, setProductDesignations] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [customerFilter, setCustomerFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" })
  const [viewMode, setViewMode] = useState("table")
  const [selectedItems, setSelectedItems] = useState([])
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" })
  const [progressFilter, setProgressFilter] = useState("all")
  const [error, setError] = useState(null)
  const itemsPerPage = 10

  // Stats for dashboard
  const stats = useMemo(() => {
    return {
      total: massProductions.length,
      ongoing: massProductions.filter((item) => item.status === "on-going").length,
      standby: massProductions.filter((item) => item.status === "stand-by").length,
      closed: massProductions.filter((item) => item.status === "closed").length,
      cancelled: massProductions.filter((item) => item.status === "cancelled").length,
    }
  }, [massProductions])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [massProductionsData, customersData, productDesignationsData] = await Promise.all([
          getAllMassProductions(),
          getAllCustomers(),
          getAllpd(),
        ])

        // Process and set mass productions data
        if (Array.isArray(massProductionsData)) {
          // Add calculated completion percentage to each item
          const enhancedData = massProductionsData.map((item) => ({
            ...item,
            completionPercentage: calculateCompletionPercentage(item),
          }))

          setMassProductions(enhancedData)
          setFilteredProductions(enhancedData)
          setTotalPages(Math.ceil(enhancedData.length / itemsPerPage))
        } else {
          console.error("Invalid mass productions data format:", massProductionsData)
          setError("Invalid data format received from server")
          setMassProductions([])
          setFilteredProductions([])
        }

        // Process and set customers data
        if (Array.isArray(customersData)) {
          setCustomers(customersData)
        } else {
          console.error("Invalid customers data format:", customersData)
          setCustomers([])
        }

        // Process and set product designations data
        if (Array.isArray(productDesignationsData)) {
          setProductDesignations(productDesignationsData)
        } else {
          console.error("Invalid product designations data format:", productDesignationsData)
          setProductDesignations([])
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
    }

    fetchData()
  }, [toast])

  // Calculate completion percentage for a mass production item
  const calculateCompletionPercentage = useCallback((item) => {
    if (!item) return 0

    const stages = [
      item.feasibility || item.feasability,
      item.validation_for_offer,
      item.ok_for_lunch,
      item.kick_off,
      item.design,
      item.facilities,
      item.p_p_tuning,
      item.process_qualif,
      item.qualification_confirmation,
    ]

    // Count total stages and completed stages
    const totalStages = stages.length
    const completedStages = stages.filter((stage) => isStageCompleted(stage)).length

    return Math.round((completedStages / totalStages) * 100)
  }, [])

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

  // Apply filters and sorting
  useEffect(() => {
    let result = [...massProductions]

    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        (item) =>
          (item.id && item.id.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (item.project_n && item.project_n.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (item.description && item.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (item.customer &&
            item.customer.username &&
            item.customer.username.toLowerCase().includes(lowerCaseSearchTerm)),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter)
    }

    // Apply customer filter
    if (customerFilter !== "all") {
      result = result.filter((item) => item.customer && item.customer._id === customerFilter)
    }

    // Apply date range filter
    if (dateFilter.from || dateFilter.to) {
      result = result.filter((item) => {
        const itemDate = item.initial_request ? new Date(item.initial_request) : null
        if (!itemDate) return false

        if (dateFilter.from && dateFilter.to) {
          const fromDate = new Date(dateFilter.from)
          const toDate = new Date(dateFilter.to)
          toDate.setHours(23, 59, 59, 999) // Include the entire end day
          return itemDate >= fromDate && itemDate <= toDate
        } else if (dateFilter.from) {
          const fromDate = new Date(dateFilter.from)
          return itemDate >= fromDate
        } else if (dateFilter.to) {
          const toDate = new Date(dateFilter.to)
          toDate.setHours(23, 59, 59, 999) // Include the entire end day
          return itemDate <= toDate
        }

        return true
      })
    }

    // Apply progress filter
    if (progressFilter !== "all") {
      result = result.filter((item) => {
        const percentage = item.completionPercentage || 0

        switch (progressFilter) {
          case "not-started":
            return percentage === 0
          case "in-progress":
            return percentage > 0 && percentage < 100
          case "completed":
            return percentage === 100
          default:
            return true
        }
      })
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Handle nested properties like customer.username
        if (sortConfig.key.includes(".")) {
          const keys = sortConfig.key.split(".")
          let aValue = a
          let bValue = b

          for (const key of keys) {
            aValue = aValue?.[key]
            bValue = bValue?.[key]
          }

          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
          return 0
        }

        // Handle dates
        if (
          sortConfig.key === "createdAt" ||
          sortConfig.key === "initial_request" ||
          sortConfig.key === "ppap_submission_date" ||
          sortConfig.key === "next_review"
        ) {
          const dateA = a[sortConfig.key] ? new Date(a[sortConfig.key]) : new Date(0)
          const dateB = b[sortConfig.key] ? new Date(b[sortConfig.key]) : new Date(0)

          return sortConfig.direction === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
        }

        // Handle completion percentage
        if (sortConfig.key === "completionPercentage") {
          const percentA = a.completionPercentage || 0
          const percentB = b.completionPercentage || 0

          return sortConfig.direction === "asc" ? percentA - percentB : percentB - percentA
        }

        // Handle regular string/number properties
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    setFilteredProductions(result)
    setTotalPages(Math.ceil(result.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change

    // Clear selected items when filters change
    setSelectedItems([])
  }, [massProductions, searchTerm, statusFilter, customerFilter, sortConfig, dateFilter, progressFilter])

  // Get current page items
  const getCurrentPageItems = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredProductions.slice(startIndex, endIndex)
  }, [currentPage, filteredProductions, itemsPerPage])

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
      setMassProductions(massProductions.filter((item) => item._id !== itemToDelete._id))
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

      // Update local state
      setMassProductions((prevState) => prevState.filter((item) => !selectedItems.includes(item._id)))

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
  const handleRefresh = async () => {
    try {
      setLoading(true)
      const massProductionsData = await getAllMassProductions()

      if (Array.isArray(massProductionsData)) {
        // Add calculated completion percentage to each item
        const enhancedData = massProductionsData.map((item) => ({
          ...item,
          completionPercentage: calculateCompletionPercentage(item),
        }))

        setMassProductions(enhancedData)
        toast({
          title: "Success",
          description: "Data refreshed successfully.",
        })
      }
    } catch (error) {
      console.error("Error refreshing data:", error)
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
        const currentPageIds = getCurrentPageItems().map((item) => item._id)
        setSelectedItems((prev) => [...new Set([...prev, ...currentPageIds])])
      } else {
        const currentPageIds = getCurrentPageItems().map((item) => item._id)
        setSelectedItems((prev) => prev.filter((id) => !currentPageIds.includes(id)))
      }
    },
    [getCurrentPageItems],
  )

  // Export selected items to CSV
  const exportToCSV = () => {
    // Get items to export
    const itemsToExport =
      selectedItems.length > 0
        ? massProductions.filter((item) => selectedItems.includes(item._id))
        : filteredProductions

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
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 50) return "bg-amber-500"
    if (percentage >= 20) return "bg-orange-500"
    return "bg-red-500"
  }, [])

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
    if (totalPages <= 1) return null

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            // Show first page, last page, current page, and pages around current
            let pageToShow

            if (totalPages <= 5) {
              // If 5 or fewer pages, show all
              pageToShow = i + 1
            } else if (currentPage <= 3) {
              // If near start, show first 5
              pageToShow = i + 1
              if (i === 4)
                return (
                  <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                  </PaginationItem>
                )
            } else if (currentPage >= totalPages - 2) {
              // If near end, show last 5
              pageToShow = totalPages - 4 + i
              if (i === 0)
                return (
                  <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                  </PaginationItem>
                )
            } else {
              // If in middle, show current and surrounding
              pageToShow = currentPage - 2 + i
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
                <PaginationLink isActive={currentPage === pageToShow} onClick={() => setCurrentPage(pageToShow)}>
                  {pageToShow}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
          <CardTitle className="text-lg">Advanced Filters</CardTitle>
          <CardDescription>Refine your search with additional filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="date"
                    value={dateFilter.from}
                    onChange={(e) => setDateFilter((prev) => ({ ...prev, from: e.target.value }))}
                    placeholder="From"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="date"
                    value={dateFilter.to}
                    onChange={(e) => setDateFilter((prev) => ({ ...prev, to: e.target.value }))}
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Progress</label>
              <Select value={progressFilter} onValueChange={setProgressFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by progress" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Progress Levels</SelectItem>
                  <SelectItem value="not-started">Not Started (0%)</SelectItem>
                  <SelectItem value="in-progress">In Progress (1-99%)</SelectItem>
                  <SelectItem value="completed">Completed (100%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setDateFilter({ from: "", to: "" })
                  setProgressFilter("all")
                }}
              >
                Reset Filters
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

  // Render table view
  const renderTableView = () => {
    const currentItems = getCurrentPageItems()
    const areAllCurrentPageSelected =
      currentItems.length > 0 && currentItems.every((item) => selectedItems.includes(item._id))

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
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence initial={false} mode="popLayout">
                {currentItems.map((item, index) => (
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
                              <Progress
                                value={item.completionPercentage || 0}
                                className="w-16 h-2"
                                indicatorClassName={getProgressColor(item.completionPercentage || 0)}
                              />
                              <span className="text-xs font-medium">{item.completionPercentage || 0}%</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Completion: {item.completionPercentage || 0}%</p>
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
    const currentItems = getCurrentPageItems()

    if (loading) {
      return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">{renderCardSkeletons()}</div>
    }

    if (currentItems.length === 0) {
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
          {currentItems.map((item, index) => (
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, project number or description..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter by status" />
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
            <div>
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter by customer" />
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
          </div>

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
              Showing {filteredProductions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, filteredProductions.length)} of {filteredProductions.length} records
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
