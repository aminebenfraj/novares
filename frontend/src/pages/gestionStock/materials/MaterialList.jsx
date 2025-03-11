"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Eye, Download, Filter, ArrowUpDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"
import { getAllMaterials, deleteMaterial } from "../../../apis/gestionStockApi/materialApi"

const MaterialList = () => {
  const [materials, setMaterials] = useState([])
  const [filteredMaterials, setFilteredMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "updatedAt", direction: "desc" })

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      setIsLoading(true)
      const data = await getAllMaterials()
      setMaterials(data)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch materials:", error)
      setError("Failed to fetch materials. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const filterMaterials = useCallback(() => {
    let filtered = materials.filter(
      (material) =>
        material.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (activeTab !== "all") {
      filtered = filtered.filter((material) => getStockStatus(material).toLowerCase() === activeTab)
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredMaterials(filtered)
  }, [searchTerm, materials, activeTab, sortConfig])

  useEffect(() => {
    filterMaterials()
  }, [filterMaterials])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await deleteMaterial(id)
        fetchMaterials()
      } catch (error) {
        console.error("Failed to delete material:", error)
      }
    }
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const exportToCSV = () => {
    const headers = [
      "Reference",
      "Manufacturer",
      "Description",
      "Current Stock",
      "Minimum Stock",
      "Price",
      "Critical",
      "Consumable",
      "Supplier",
      "Location",
      "Category",
    ]

    const rows = filteredMaterials.map((material) => [
      material.reference,
      material.manufacturer,
      material.description,
      material.currentStock,
      material.minimumStock,
      material.price,
      material.critical ? "Yes" : "No",
      material.consumable ? "Yes" : "No",
      material.supplier ? material.supplier.companyName : "N/A",
      material.location ? material.location.location : "N/A",
      material.category ? material.category.name : "N/A",
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `materials-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 rounded-full border-t-primary animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Materials</h1>
            <p className="text-muted-foreground">Manage your inventory materials</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/materials/create">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" /> Add New Material
              </Button>
            </Link>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" /> Export to CSV
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="grid gap-6 mb-6 md:grid-cols-3"
        >
          <div className="relative col-span-3 md:col-span-2">
            <Search className="absolute transform -translate-y-1/2 text-muted-foreground left-3 top-1/2" size={20} />
            <Input
              type="text"
              placeholder="Search by reference, manufacturer, or description..."
              className="w-full py-2 pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-span-3 md:col-span-1">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="in stock">In Stock</TabsTrigger>
                <TabsTrigger value="low stock">Low Stock</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Materials</CardTitle>
                  <CardDescription>
                    {filteredMaterials.length} {filteredMaterials.length === 1 ? "item" : "items"}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortConfig({ key: "reference", direction: "asc" })}>
                      Reference (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortConfig({ key: "reference", direction: "desc" })}>
                      Reference (Z-A)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortConfig({ key: "currentStock", direction: "asc" })}>
                      Stock (Low to High)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortConfig({ key: "currentStock", direction: "desc" })}>
                      Stock (High to Low)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortConfig({ key: "price", direction: "asc" })}>
                      Price (Low to High)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortConfig({ key: "price", direction: "desc" })}>
                      Price (High to Low)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-350px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent"
                          onClick={() => handleSort("reference")}
                        >
                          Reference
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent"
                          onClick={() => handleSort("manufacturer")}
                        >
                          Manufacturer
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent"
                          onClick={() => handleSort("currentStock")}
                        >
                          Stock
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="p-0 hover:bg-transparent"
                          onClick={() => handleSort("price")}
                        >
                          Price
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </Button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.length > 0 ? (
                      filteredMaterials.map((material, index) => (
                        <motion.tr
                          key={material._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03, duration: 0.2 }}
                          className="group"
                        >
                          <TableCell className="font-medium">{material.reference}</TableCell>
                          <TableCell>{material.manufacturer}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{material.description}</TableCell>
                          <TableCell>{material.currentStock}</TableCell>
                          <TableCell>${material.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={getStockStatusVariant(material)}>{getStockStatus(material)}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/materials/details/${material._id}`}>
                                <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link to={`/materials/edit/${material._id}`}>
                                <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-8 h-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900"
                                onClick={() => handleDelete(material._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No materials found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <ContactUs />
    </div>
  )
}

const getStockStatusVariant = (material) => {
  if (material.currentStock <= 0) return "destructive"
  if (material.currentStock <= material.minimumStock) return "warning"
  return "success"
}

const getStockStatus = (material) => {
  if (material.currentStock <= 0) return "Out of Stock"
  if (material.currentStock <= material.minimumStock) return "Low Stock"
  return "In Stock"
}

export default MaterialList

