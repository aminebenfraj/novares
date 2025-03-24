"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getAllReadiness, deleteReadiness } from "../../apis/readiness/readinessApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Loader2, FileText } from "lucide-react"
import MainLayout from "@/components/MainLayout"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const ReadinessList = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [readinessEntries, setReadinessEntries] = useState([])
  const [filteredEntries, setFilteredEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState(null)

  // Fetch readiness entries
  useEffect(() => {
    const fetchReadinessEntries = async () => {
      try {
        setLoading(true)
        const response = await getAllReadiness()
        setReadinessEntries(response.data || [])
        setFilteredEntries(response.data || [])
      } catch (error) {
        console.error("Error fetching readiness entries:", error)

        // Provide a more specific error message based on the error
        let errorMessage = "Failed to fetch readiness entries"

        if (error.response?.status === 500) {
          if (error.response.data?.error?.includes("strictPopulate")) {
            errorMessage = "Database schema mismatch. Please contact your administrator."
          } else {
            errorMessage = "Server error. Please try again later."
          }
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReadinessEntries()
  }, [toast])

  // Filter entries based on search term and status
  useEffect(() => {
    let filtered = readinessEntries

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((entry) => entry.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.project_name.toLowerCase().includes(term) ||
          entry.id.toLowerCase().includes(term) ||
          (entry.assignedEmail && entry.assignedEmail.toLowerCase().includes(term)),
      )
    }

    setFilteredEntries(filtered)
  }, [searchTerm, statusFilter, readinessEntries])

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
      setReadinessEntries(readinessEntries.filter((entry) => entry._id !== entryToDelete._id))
      toast({
        title: "Success",
        description: "Readiness entry deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting readiness entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete readiness entry",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setEntryToDelete(null)
    }
  }

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "on-going":
        return (
          <Badge variant="default" className="bg-blue-500">
            On-going
          </Badge>
        )
      case "stand-by":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Stand-by
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="default" className="bg-green-500">
            Closed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="default" className="bg-red-500">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
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

  return (
    <MainLayout>
      <motion.div className="container py-6 mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Readiness Management</h1>
            <p className="text-muted-foreground">Manage and track readiness entries</p>
          </div>
          <Button onClick={() => navigate("/readiness/new")} className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            New Readiness Entry
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by project name, ID or email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
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
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading readiness entries...</span>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <FileText className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">No readiness entries found</h3>
                <p className="mt-1 mb-4 text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first readiness entry to get started"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button onClick={() => navigate("/readiness/new")}>
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
                      <TableHead>ID</TableHead>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry._id}>
                        <TableCell className="font-medium">{entry.id}</TableCell>
                        <TableCell>{entry.project_name}</TableCell>
                        <TableCell>{getStatusBadge(entry.status)}</TableCell>
                        <TableCell>{entry.assignedEmail || "N/A"}</TableCell>
                        <TableCell>{formatDate(entry.createdAt)}</TableCell>
                        <TableCell>{formatDate(entry.updatedAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/readiness/${entry._id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/readiness/${entry._id}/edit`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <span className="font-semibold"> {entryToDelete?.project_name}</span>. This action cannot be undone.
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

