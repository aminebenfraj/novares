"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { getAllReadiness, deleteReadiness, getFilterOptions } from "../../apis/readiness/readinessApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Loader2,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  BarChart3,
  Filter,
} from "lucide-react"
import MainLayout from "@/components/MainLayout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

// Enhanced tracking calculation functions
const calculateCompletionPercentage = (data) => {
  if (!data) return 0

  const stages = [
    { key: "documentation", data: data.Documentation, weight: 1.0 },
    { key: "logistics", data: data.Logistics, weight: 1.0 },
    { key: "maintenance", data: data.Maintenance, weight: 1.0 },
    { key: "packaging", data: data.Packaging, weight: 1.0 },
    { key: "processStatusIndustrials", data: data.ProcessStatusIndustrials, weight: 1.0 },
    { key: "productProcess", data: data.ProductProcess, weight: 1.0 },
    { key: "runAtRateProduction", data: data.RunAtRateProduction, weight: 1.0 },
    { key: "safety", data: data.Safety, weight: 1.0 },
    { key: "supp", data: data.Suppliers, weight: 1.0 },
    { key: "toolingStatus", data: data.ToolingStatus, weight: 1.0 },
    { key: "training", data: data.Training, weight: 1.0 },
  ]

  const totalWeight = stages.reduce((sum, stage) => sum + stage.weight, 0)
  let weightedCompletion = 0

  stages.forEach((stage) => {
    if (!stage.data) return

    if (isStageCompleted(stage.data)) {
      weightedCompletion += stage.weight
    } else if (typeof stage.data === "object") {
      const stagePercentage = calculateStagePercentage(stage.data)
      weightedCompletion += (stage.weight * stagePercentage) / 100
    }
  })

  return Math.round((weightedCompletion / totalWeight) * 100)
}

const isStageCompleted = (stage) => {
  if (!stage) return false
  if (stage.check === true || stage.value === true) return true

  if (typeof stage === "object") {
    const tasks = Object.entries(stage).filter(
      ([key, value]) => typeof value === "object" && value !== null && !key.startsWith("_") && key !== "checkin",
    )

    if (tasks.length > 0) {
      const completedTasks = tasks.filter(
        ([_, value]) => value.value === true || value.check === true || (value.task && value.task.check === true),
      ).length
      // Increased threshold to 90% for more accurate completion detection
      return completedTasks / tasks.length >= 0.9
    }

    return Object.values(stage).some((prop) => {
      if (typeof prop === "object" && prop !== null) {
        return prop.check === true || prop.value === true
      }
      return false
    })
  }
  return false
}

const calculateStagePercentage = (stage) => {
  if (!stage) return 0

  if (stage.check !== undefined || stage.value !== undefined) {
    return stage.check || stage.value ? 100 : 0
  }

  const tasks = Object.entries(stage).filter(
    ([key, value]) => typeof value === "object" && value !== null && !key.startsWith("_") && key !== "checkin",
  )

  if (tasks.length === 0) return 0

  let completedTasksCount = 0
  let totalTasksCount = 0

  tasks.forEach(([_, value]) => {
    totalTasksCount++

    if (value.value === true || value.check === true || (value.task && value.task.check === true)) {
      completedTasksCount++
    } else if (value.percentage !== undefined) {
      completedTasksCount += value.percentage / 100
    } else if (typeof value === "object" && Object.keys(value).some((k) => value[k] === true)) {
      const trueProps = Object.values(value).filter((v) => v === true).length
      const totalProps = Object.keys(value).length
      completedTasksCount += trueProps / totalProps
    }
  })

  return Math.round((completedTasksCount / totalTasksCount) * 100)
}

const getProgressColor = (percentage) => {
  if (percentage >= 90) return "bg-green-600"
  if (percentage >= 75) return "bg-green-500"
  if (percentage >= 50) return "bg-amber-500"
  if (percentage >= 25) return "bg-orange-500"
  return "bg-red-500"
}

const getProgressLabel = (percentage) => {
  if (percentage >= 90) return "Almost Complete"
  if (percentage >= 75) return "Nearly Done"
  if (percentage >= 50) return "Halfway"
  if (percentage >= 25) return "In Progress"
  if (percentage > 0) return "Started"
  return "Not Started"
}

const ReadinessList = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [readinessEntries, setReadinessEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState(null)
  const [error, setError] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filter states
  const [statusFilter, setStatusFilter] = useState("")
  const [projectNumberFilter, setProjectNumberFilter] = useState("")
  const [partNumberFilter, setPartNumberFilter] = useState("")
  const [partDesignationFilter, setPartDesignationFilter] = useState("")
  const [progressFilter, setProgressFilter] = useState("all")

  // Filter options for dropdowns
  const [filterOptions, setFilterOptions] = useState({
    status: [],
    project_number: [],
    part_number: [],
    part_designation: [],
  })

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  // Sort state
  const [sortConfig, setSortConfig] = useState({
    field: "createdAt",
    order: -1,
  })

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Load filter options
  const loadFilterOptions = useCallback(async () => {
    try {
      const options = {}
      const fields = ["status", "project_number", "part_number", "part_designation"]

      // Use Promise.all for parallel requests
      const results = await Promise.all(fields.map((field) => getFilterOptions(field)))

      // Map results to their respective fields
      fields.forEach((field, index) => {
        options[field] = results[index]
      })

      setFilterOptions(options)
    } catch (error) {
      console.error("Error loading filter options:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load filter options",
      })
    }
  }, [toast])

  useEffect(() => {
    loadFilterOptions()
  }, [loadFilterOptions])

  // Handle filter change
  const handleFilterChange = (field, value) => {
    // If value is "all", set to empty string
    if (value === "all") {
      switch (field) {
        case "status":
          setStatusFilter("")
          break
        case "project_number":
          setProjectNumberFilter("")
          break
        case "part_number":
          setPartNumberFilter("")
          break
        case "part_designation":
          setPartDesignationFilter("")
          break
        case "progress":
          setProgressFilter("all")
          break
        default:
          break
      }
      return
    }

    // For all other fields
    switch (field) {
      case "status":
        setStatusFilter(value)
        break
      case "project_number":
        setProjectNumberFilter(value)
        break
      case "part_number":
        setPartNumberFilter(value)
        break
      case "part_designation":
        setPartDesignationFilter(value)
        break
      case "progress":
        setProgressFilter(value)
        break
      default:
        break
    }
  }

  // Fetch readiness entries with filters and pagination
  const fetchReadinessEntries = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Create a clean copy of filters for API
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchTerm,
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order,
      }

      // Add filters if they exist
      if (statusFilter) params.status = statusFilter
      if (projectNumberFilter) params.project_number = projectNumberFilter
      if (partNumberFilter) params.part_number = partNumberFilter
      if (partDesignationFilter) params.part_designation = partDesignationFilter

      const response = await getAllReadiness(params)

      if (response && response.data) {
        let filteredData = response.data

        // Apply client-side progress filtering if needed
        if (progressFilter !== "all") {
          filteredData = filteredData.filter((entry) => {
            const percentage = calculateCompletionPercentage(entry)
            switch (progressFilter) {
              case "completed":
                return percentage >= 90
              case "inProgress":
                return percentage >= 25 && percentage < 90
              case "started":
                return percentage > 0 && percentage < 25
              case "notStarted":
                return percentage === 0
              default:
                return true
            }
          })
        }

        setReadinessEntries(filteredData)

        // Update pagination info
        if (response.pagination) {
          setPagination({
            ...pagination,
            page: response.pagination.page || 1,
            total: response.pagination.total || 0,
            totalPages: response.pagination.totalPages || 0,
          })
        }
      } else {
        setError("Invalid data format received from server")
        setReadinessEntries([])
      }
    } catch (error) {
      console.error("Error fetching readiness entries:", error)
      setError("Failed to load readiness entries. Please try again later.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load readiness entries. Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearchTerm,
    statusFilter,
    projectNumberFilter,
    partNumberFilter,
    partDesignationFilter,
    progressFilter,
    sortConfig,
    toast,
  ])

  // Fetch data when dependencies change
  useEffect(() => {
    fetchReadinessEntries()
  }, [fetchReadinessEntries])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [debouncedSearchTerm, statusFilter, projectNumberFilter, partNumberFilter, partDesignationFilter, progressFilter])

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  // Handle sort change
  const handleSortChange = (field) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        // Toggle order if same field
        return { field, order: prev.order === 1 ? -1 : 1 }
      }
      // Default to descending for new field
      return { field, order: -1 }
    })
  }

  // Handle delete confirmation
  const confirmDelete = (entry) => {
    setEntryToDelete(entry)
    setDeleteDialogOpen(true)
  }

  // Handle delete action
  const handleDelete = async () => {
    if (!entryToDelete) return

    try {
      await deleteReadiness(entryToDelete._id)

      // Refresh data after deletion
      fetchReadinessEntries()

      toast({
        title: "Success",
        description: "Readiness entry deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting readiness entry:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete readiness entry",
      })
    } finally {
      setDeleteDialogOpen(false)
      setEntryToDelete(null)
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("")
    setProjectNumberFilter("")
    setPartNumberFilter("")
    setPartDesignationFilter("")
    setProgressFilter("all")
  }

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "on-going":
        return "default"
      case "stand-by":
        return "warning"
      case "closed":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Count active filters
  const activeFilterCount = [
    statusFilter,
    projectNumberFilter,
    partNumberFilter,
    partDesignationFilter,
    progressFilter !== "all" ? progressFilter : "",
  ].filter((filter) => filter !== "").length

  return (
    <MainLayout>
      <motion.div className="container py-6 mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Readiness Management</h1>
            <p className="text-muted-foreground">Manage and track readiness entries</p>
          </div>
          <Button onClick={() => navigate("/readiness/create")} className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            New Readiness Entry
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tracking Summary Card */}
        {!loading && readinessEntries.length > 0 && (
          <Card className="mb-6 border-2 shadow-sm">
            <CardHeader className="pb-2 bg-slate-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
                Tracking Summary
              </CardTitle>
              <CardDescription>Overview of readiness progress across all entries</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="p-4 transition-all border rounded-lg shadow-sm bg-slate-50 hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Total Projects</span>
                    <Target className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="text-2xl font-bold">{pagination.total}</div>
                  <div className="mt-2 text-xs text-muted-foreground">All readiness entries</div>
                </div>

                <div className="p-4 transition-all border rounded-lg shadow-sm bg-green-50 hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Completed</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {readinessEntries.filter((entry) => calculateCompletionPercentage(entry) >= 90).length}
                  </div>
                  <div className="mt-2 text-xs text-green-600">
                    {Math.round(
                      (readinessEntries.filter((entry) => calculateCompletionPercentage(entry) >= 90).length /
                        readinessEntries.length) *
                        100,
                    )}
                    % of total
                  </div>
                </div>

                <div className="p-4 transition-all border rounded-lg shadow-sm bg-amber-50 hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">In Progress</span>
                    <Activity className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-amber-600">
                    {
                      readinessEntries.filter((entry) => {
                        const percentage = calculateCompletionPercentage(entry)
                        return percentage > 0 && percentage < 90
                      }).length
                    }
                  </div>
                  <div className="mt-2 text-xs text-amber-600">
                    {Math.round(
                      (readinessEntries.filter((entry) => {
                        const percentage = calculateCompletionPercentage(entry)
                        return percentage > 0 && percentage < 90
                      }).length /
                        readinessEntries.length) *
                        100,
                    )}
                    % of total
                  </div>
                </div>

                <div className="p-4 transition-all border rounded-lg shadow-sm bg-red-50 hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Not Started</span>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {readinessEntries.filter((entry) => calculateCompletionPercentage(entry) === 0).length}
                  </div>
                  <div className="mt-2 text-xs text-red-600">
                    {Math.round(
                      (readinessEntries.filter((entry) => calculateCompletionPercentage(entry) === 0).length /
                        readinessEntries.length) *
                        100,
                    )}
                    % of total
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 border-2 shadow-sm">
          <CardHeader className="pb-3 bg-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Filters
              </CardTitle>
              <Badge variant="outline">{activeFilterCount} active</Badge>
            </div>
            <CardDescription>Filter and search readiness entries</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, project number, part number..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                {/* Status Filter */}
                <div>
                  <Select value={statusFilter || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {filterOptions.status.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Project Number Filter */}
                <div>
                  <Select
                    value={projectNumberFilter || "all"}
                    onValueChange={(value) => handleFilterChange("project_number", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Project Number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {filterOptions.project_number.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Part Number Filter */}
                <div>
                  <Select
                    value={partNumberFilter || "all"}
                    onValueChange={(value) => handleFilterChange("part_number", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Part Number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Part Numbers</SelectItem>
                      {filterOptions.part_number.map((partNumber) => (
                        <SelectItem key={partNumber} value={partNumber}>
                          {partNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Part Designation Filter */}
                <div>
                  <Select
                    value={partDesignationFilter || "all"}
                    onValueChange={(value) => handleFilterChange("part_designation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Part Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Designations</SelectItem>
                      {filterOptions.part_designation.map((designation) => (
                        <SelectItem key={designation} value={designation}>
                          {designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Progress Filter */}
                <div>
                  <Select value={progressFilter} onValueChange={(value) => handleFilterChange("progress", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Progress" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Progress</SelectItem>
                      <SelectItem value="completed">Completed (≥90%)</SelectItem>
                      <SelectItem value="inProgress">In Progress (25-89%)</SelectItem>
                      <SelectItem value="started">Just Started (1-24%)</SelectItem>
                      <SelectItem value="notStarted">Not Started (0%)</SelectItem>
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
                    <DropdownMenuRadioGroup
                      value={`${sortConfig.field}-${sortConfig.order}`}
                      onValueChange={(value) => {
                        const [field, order] = value.split("-")
                        setSortConfig({ field, order: Number.parseInt(order) })
                      }}
                    >
                      <DropdownMenuRadioItem value="createdAt-1">Date (Oldest First)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="createdAt--1">Date (Newest First)</DropdownMenuRadioItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioItem value="project_number-1">Project Number (A-Z)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="project_number--1">Project Number (Z-A)</DropdownMenuRadioItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioItem value="part_number-1">Part Number (A-Z)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="part_number--1">Part Number (Z-A)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading readiness entries...</span>
              </div>
            ) : readinessEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <FileText className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">No readiness entries found</h3>
                <p className="mt-1 mb-4 text-muted-foreground">
                  {debouncedSearchTerm || activeFilterCount > 0
                    ? "Try adjusting your filters"
                    : "Create your first readiness entry to get started"}
                </p>
                {!debouncedSearchTerm && activeFilterCount === 0 && (
                  <Button onClick={() => navigate("/readiness/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Readiness Entry
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer hover:text-primary" onClick={() => handleSortChange("id")}>
                        ID
                        {sortConfig.field === "id" && (
                          <span className="ml-1">{sortConfig.order === 1 ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange("project_number")}
                      >
                        Project Number
                        {sortConfig.field === "project_number" && (
                          <span className="ml-1">{sortConfig.order === 1 ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange("part_number")}
                      >
                        Part Number
                        {sortConfig.field === "part_number" && (
                          <span className="ml-1">{sortConfig.order === 1 ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange("part_designation")}
                      >
                        Part Designation
                        {sortConfig.field === "part_designation" && (
                          <span className="ml-1">{sortConfig.order === 1 ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange("status")}
                      >
                        Status
                        {sortConfig.field === "status" && (
                          <span className="ml-1">{sortConfig.order === 1 ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:text-primary">Progress</TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-primary"
                        onClick={() => handleSortChange("createdAt")}
                      >
                        Created
                        {sortConfig.field === "createdAt" && (
                          <span className="ml-1">{sortConfig.order === 1 ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence initial={false} mode="popLayout">
                      {readinessEntries.map((entry, index) => (
                        <motion.tr
                          key={entry._id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">{entry.id}</TableCell>
                          <TableCell>{entry.project_number}</TableCell>
                          <TableCell>{entry.part_number}</TableCell>
                          <TableCell>{entry.part_designation || "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadge(entry.status)}>{entry.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                      <div className="relative w-full h-2 overflow-hidden rounded-full bg-muted">
                                        <div
                                          className={`absolute top-0 left-0 h-full ${getProgressColor(
                                            calculateCompletionPercentage(entry),
                                          )}`}
                                          style={{ width: `${calculateCompletionPercentage(entry)}%` }}
                                        />
                                      </div>
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground min-w-[3rem]">
                                      {calculateCompletionPercentage(entry)}%
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-sm">
                                    <p className="font-medium">
                                      {getProgressLabel(calculateCompletionPercentage(entry))}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {calculateCompletionPercentage(entry)}% of tasks completed
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <div className="mt-1">
                              <Badge
                                variant={
                                  calculateCompletionPercentage(entry) >= 90
                                    ? "success"
                                    : calculateCompletionPercentage(entry) >= 50
                                      ? "warning"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {getProgressLabel(calculateCompletionPercentage(entry))}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(entry.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/readiness/detail/${entry._id}`)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/readiness/edit/${entry._id}`)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => confirmDelete(entry)}
                                  className="text-red-600 focus:text-red-600"
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
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {!loading && readinessEntries.length > 0 && (
              <div className="flex items-center justify-between px-2 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {readinessEntries.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{" "}
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
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the readiness entry
                <span className="font-semibold"> {entryToDelete?.project_number || entryToDelete?.id}</span>. This
                action cannot be undone.
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

export default ReadinessList
