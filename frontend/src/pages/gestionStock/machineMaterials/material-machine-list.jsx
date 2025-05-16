"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { getAllAllocations, deleteAllocation } from "@/apis/gestionStockApi/materialMachineApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Loader2, FileText, AlertCircle } from "lucide-react"
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

const MaterialMachineList = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAllocations, setFilteredAllocations] = useState([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [allocationToDelete, setAllocationToDelete] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllocations()
  }, [])

  useEffect(() => {
    if (allocations.length > 0) {
      filterAllocations()
    }
  }, [searchTerm, allocations])

  const fetchAllocations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllAllocations()
      setAllocations(data)
      setFilteredAllocations(data)
    } catch (error) {
      console.error("Error fetching allocations:", error)
      setError("Failed to fetch allocations. Please try again.")
      toast({
        title: "Error",
        description: "Failed to fetch allocations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAllocations = () => {
    const filtered = allocations.filter((allocation) => {
      const materialName = allocation.material?.reference || ""
      const materialDesc = allocation.material?.description || ""
      const machineName = allocation.machine?.name || ""

      return (
        materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materialDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machineName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

    setFilteredAllocations(filtered)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const confirmDelete = (allocation) => {
    setAllocationToDelete(allocation)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!allocationToDelete) return

    try {
      await deleteAllocation(allocationToDelete._id)
      setAllocations(allocations.filter((allocation) => allocation._id !== allocationToDelete._id))
      toast({
        title: "Success",
        description: "Allocation deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting allocation:", error)
      toast({
        title: "Error",
        description: "Failed to delete allocation",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setAllocationToDelete(null)
    }
  }

  return (
    <MainLayout>
      <motion.div className="container py-6 mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Material-Machine Allocations</h1>
            <p className="text-muted-foreground">View and manage material stock allocations to machines</p>
          </div>
          <Button onClick={() => navigate("/machinematerial/create")} className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            New Allocation
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
                  placeholder="Search by material or machine..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading allocations...</span>
              </div>
            ) : filteredAllocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <FileText className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">No allocations found</h3>
                <p className="mt-1 mb-4 text-muted-foreground">
                  {searchTerm ? "Try adjusting your search" : "Create your first allocation to get started"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => navigate("/machinematerial/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Allocation
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Machine</TableHead>
                      <TableHead className="text-right">Allocated Stock</TableHead>
                      <TableHead className="text-right">Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence initial={false} mode="popLayout">
                      {filteredAllocations.map((allocation) => (
                        <motion.tr
                          key={allocation._id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="hover:bg-muted/50"
                        >
                          <TableCell>
                            <div className="font-medium">{allocation.material?.reference}</div>
                            <div className="text-sm text-muted-foreground">{allocation.material?.description}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{allocation.machine?.name}</div>
                            <Badge variant={allocation.machine?.status === "active" ? "outline" : "secondary"}>
                              {allocation.machine?.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-right">{allocation.allocatedStock}</TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {new Date(allocation.updatedAt).toLocaleDateString()}
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
                                <DropdownMenuItem onClick={() => navigate(`/machinematerial/detail/${allocation._id}`)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate(`/machinematerial/edit/${allocation._id}`)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => confirmDelete(allocation)}
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
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the allocation between
                <span className="font-semibold"> {allocationToDelete?.material?.reference}</span> and
                <span className="font-semibold"> {allocationToDelete?.machine?.name}</span>. This action cannot be
                undone.
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

export default MaterialMachineList
