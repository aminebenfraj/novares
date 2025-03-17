"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { getAllMassProductions, deleteMassProduction } from "../../apis/massProductionApi"
import { getAllCustomers } from "../../apis/customerApi"
import { getAllpd } from "../../apis/ProductDesignation-api"

// shadcn components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

// Lucide icons
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  FileText,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowUpDown,
  Loader2,
} from "lucide-react"


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
  const itemsPerPage = 10

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [massProductionsData, customersData, productDesignationsData] = await Promise.all([
          getAllMassProductions(),
          getAllCustomers(),
          getAllpd(),
        ])

        // Process and set mass productions data
        if (Array.isArray(massProductionsData)) {
          setMassProductions(massProductionsData)
          setFilteredProductions(massProductionsData)
          setTotalPages(Math.ceil(massProductionsData.length / itemsPerPage))
        } else {
          console.error("Invalid mass productions data format:", massProductionsData)
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
          (item.description && item.description.toLowerCase().includes(lowerCaseSearchTerm)),
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

        // Handle regular string/number properties
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    setFilteredProductions(result)
    setTotalPages(Math.ceil(result.length / itemsPerPage))
    setCurrentPage(1) // Reset to first page when filters change
  }, [massProductions, searchTerm, statusFilter, customerFilter, sortConfig])

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredProductions.slice(startIndex, endIndex)
  }

  // Handle sort request
  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Handle delete confirmation
  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  // Handle delete action
  const handleDelete = async () => {
    if (!itemToDelete) return

    setDeleteLoading(true)
    try {
      await deleteMassProduction(itemToDelete._id)

      // Update local state
      setMassProductions((prevState) => prevState.filter((item) => item._id !== itemToDelete._id))

      toast({
        title: "Success",
        description: "Mass production record deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting record:", error)
      toast({
        title: "Error",
        description: "Failed to delete record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  // Handle refresh data
  const handleRefresh = async () => {
    try {
      setLoading(true)
      const massProductionsData = await getAllMassProductions()

      if (Array.isArray(massProductionsData)) {
        setMassProductions(massProductionsData)
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

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "on-going":
        return { variant: "default", icon: <Clock className="w-3 h-3 mr-1" /> }
      case "stand-by":
        return { variant: "warning", icon: <AlertCircle className="w-3 h-3 mr-1" /> }
      case "closed":
        return { variant: "success", icon: <CheckCircle2 className="w-3 h-3 mr-1" /> }
      case "cancelled":
        return { variant: "destructive", icon: <XCircle className="w-3 h-3 mr-1" /> }
      default:
        return { variant: "secondary", icon: null }
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  // Get customer name
  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c._id === customerId)
    return customer ? customer.username : "N/A"
  }

  // Get product designation names
  const getProductDesignationNames = (designationIds) => {
    if (!designationIds || !Array.isArray(designationIds) || designationIds.length === 0) {
      return "N/A"
    }

    const names = designationIds.map((id) => {
      const designation = productDesignations.find((pd) => pd._id === id)
      return designation ? designation.part_name : "Unknown"
    })

    return names.join(", ")
  }

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
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

  // Render table view
  const renderTableView = () => {
    const currentItems = getCurrentPageItems()

    return (
        <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
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
                <div className="flex items-center cursor-pointer" onClick={() => requestSort("next_review")}>
                  Next Review
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
                <TableCell colSpan={7} className="h-24 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {currentItems.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.project_n}</TableCell>
                    <TableCell>{item.customer ? item.customer.username : "N/A"}</TableCell>
                    <TableCell>{formatDate(item.initial_request)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(item.status).variant} className="flex items-center w-fit">
                        {getStatusBadge(item.status).icon}
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(item.next_review)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="w-8 h-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="w-4 h-4" />
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
        <AnimatePresence>
          {currentItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.project_n}</CardTitle>
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
                      <span className="text-muted-foreground">Next Review:</span>
                      <span>{formatDate(item.next_review)}</span>
                    </div>
                  </div>
                  {item.description && (
                    <p className="mb-2 text-sm line-clamp-2 text-muted-foreground">{item.description}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/masspd/detail/${item._id}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
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
    <div className="min-h-screen bg-background">
      <div className="container py-8 mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mass Production</h1>
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
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the mass production record for project{" "}
              <span className="font-medium">{itemToDelete?.project_n}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MassProductionList

