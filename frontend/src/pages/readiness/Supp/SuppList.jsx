"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import MainLayout from "@/components/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { getAllSuppliers, deleteSupplier } from "@/apis/gestionStockApi/supplierApi"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Building,
  Phone,
  Mail,
  User,
  Loader2,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

const SupplierList = () => {
  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("table")
  const { toast } = useToast()

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllSuppliers()
      setSuppliers(data)
    } catch (error) {
      console.error("Failed to fetch suppliers:", error)
      setError("Failed to fetch suppliers. Please try again.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch suppliers. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDelete = (supplier) => {
    setSupplierToDelete(supplier)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!supplierToDelete) return

    try {
      await deleteSupplier(supplierToDelete._id)
      setSuppliers(suppliers.filter((supplier) => supplier._id !== supplierToDelete._id))
      toast({
        title: "Success",
        description: "Supplier deleted successfully!",
      })
    } catch (error) {
      console.error("Failed to delete supplier:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete supplier. Please try again.",
      })
    } finally {
      setDeleteDialogOpen(false)
      setSupplierToDelete(null)
    }
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.businessEmail?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <MainLayout>
      <motion.div className="container py-6 mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Supplier Management</h1>
            <p className="text-muted-foreground">Manage your suppliers and their contact information</p>
          </div>
          <Button onClick={() => navigate("/suppliers/create")} className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Add New Supplier
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
                  placeholder="Search suppliers..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Tabs value={viewMode} onValueChange={setViewMode} className="w-full md:w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading suppliers...</span>
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Building className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">No suppliers found</h3>
                <p className="mt-1 mb-4 text-muted-foreground">
                  {searchTerm ? "Try adjusting your search" : "Create your first supplier to get started"}
                </p>
                {searchTerm ? (
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/suppliers/create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Supplier
                  </Button>
                )}
              </div>
            ) : (
              <TabsContent value="table" className="m-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-medium">Company Name</TableHead>
                        <TableHead className="font-medium">Contact Name</TableHead>
                        <TableHead className="font-medium">Business Phone</TableHead>
                        <TableHead className="font-medium">Business Email</TableHead>
                        <TableHead className="font-medium text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence initial={false} mode="popLayout">
                        {filteredSuppliers.map((supplier) => (
                          <motion.tr
                            key={supplier._id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="border-b hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                                {supplier.companyName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-2 text-muted-foreground" />
                                {supplier.name || "—"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                                {supplier.businessPhone || "—"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                                {supplier.businessEmail || "—"}
                              </div>
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
                                  <DropdownMenuItem onClick={() => setSelectedSupplier(supplier)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigate(`/suppliers/edit/${supplier._id}`)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => confirmDelete(supplier)}
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
              </TabsContent>
            )}

            <TabsContent value="grid" className="p-6 m-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-lg">Loading suppliers...</span>
                </div>
              ) : filteredSuppliers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <Building className="w-12 h-12 mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No suppliers found</h3>
                  <p className="mt-1 mb-4 text-muted-foreground">
                    {searchTerm ? "Try adjusting your search" : "Create your first supplier to get started"}
                  </p>
                  {searchTerm ? (
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Clear Search
                    </Button>
                  ) : (
                    <Button onClick={() => navigate("/suppliers/create")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Supplier
                    </Button>
                  )}
                </div>
              ) : (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    {filteredSuppliers.map((supplier, index) => (
                      <motion.div
                        key={supplier._id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card className="h-full">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{supplier.companyName}</CardTitle>
                            <CardDescription>{supplier.name || "No contact name"}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">{supplier.businessPhone || "No phone number"}</span>
                              </div>
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">{supplier.businessEmail || "No email address"}</span>
                              </div>
                              <div className="flex justify-end pt-2 mt-4 space-x-2 border-t">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedSupplier(supplier)}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate(`/suppliers/edit/${supplier._id}`)}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => confirmDelete(supplier)}>
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </TabsContent>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the supplier
                <span className="font-semibold"> {supplierToDelete?.companyName}</span>. This action cannot be undone.
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

        {/* Supplier Details Dialog */}
        {selectedSupplier && (
          <AlertDialog open={selectedSupplier !== null} onOpenChange={(open) => !open && setSelectedSupplier(null)}>
            <AlertDialogContent className="max-w-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>{selectedSupplier.companyName}</AlertDialogTitle>
                <AlertDialogDescription>Supplier details and contact information</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start">
                      <Building className="w-4 h-4 mt-1 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Company Name</p>
                        <p>{selectedSupplier.companyName || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="w-4 h-4 mt-1 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Contact Name</p>
                        <p>{selectedSupplier.name || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-4 h-4 mt-1 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Business Phone</p>
                        <p>{selectedSupplier.businessPhone || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-4 h-4 mt-1 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Business Email</p>
                        <p>{selectedSupplier.businessEmail || "—"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start">
                      <User className="w-4 h-4 mt-1 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Technical Contact</p>
                        <p>{selectedSupplier.technicalContact || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-4 h-4 mt-1 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Technical Phone</p>
                        <p>{selectedSupplier.technicalPhone || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-4 h-4 mt-1 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Technical Email</p>
                        <p>{selectedSupplier.technicalEmail || "—"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <AlertDialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate(`/suppliers/edit/${selectedSupplier._id}`)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Supplier
                </Button>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </motion.div>
    </MainLayout>
  )
}

export default SupplierList
