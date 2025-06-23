"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { getAllpd, deletePD } from "../../apis/ProductDesignation-api"
import { Trash2, Edit, Plus, Search, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import MainLayout from "../../components/MainLayout"

export default function ProductDesignationTable() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.reference && product.reference.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredProducts(filtered)
  }, [products, searchTerm])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await getAllpd()
      setProducts(response || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setErrorMessage("Failed to load products. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deletePD(id)
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      setErrorMessage("Failed to delete product. Please try again.")
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/masspd">Mass Production</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Product Designations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Designations</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your product designations and references</p>
          </div>
          <Link to="/pd/create">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by part name or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {filteredProducts.length} of {products.length} products
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Part Name</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <TableCell className="font-medium">#{product.id}</TableCell>
                          <TableCell className="font-medium">{product.part_name}</TableCell>
                          <TableCell>
                            {product.reference ? (
                              <Badge variant="outline">{product.reference}</Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/pd/edit/${product.id}`} className="flex items-center">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Product Designation</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{product.part_name}"? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(product.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <Plus className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500">No products found</p>
                            <Link to="/pd/create">
                              <Button size="sm">Create your first product</Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
