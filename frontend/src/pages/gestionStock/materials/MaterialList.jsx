"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Eye, Download } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const [selectedMaterial, setSelectedMaterial] = useState(null)

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

  const openDetailsModal = (material) => {
    setSelectedMaterial(material)
  }

  const closeDetailsModal = () => {
    setSelectedMaterial(null)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Materials</h1>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to="/materials/create">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" /> Add New Material
              </Button>
            </Link>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" /> Export to CSV
            </Button>
          </div>
        </div>

        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <div className="relative col-span-3 md:col-span-2">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Materials</span>
              <span className="text-sm font-normal text-gray-500">
                {filteredMaterials.length} {filteredMaterials.length === 1 ? "item" : "items"}
              </span>
            </CardTitle>
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
                        Reference {sortConfig.key === "reference" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent"
                        onClick={() => handleSort("manufacturer")}
                      >
                        Manufacturer {sortConfig.key === "manufacturer" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent"
                        onClick={() => handleSort("currentStock")}
                      >
                        Current Stock{" "}
                        {sortConfig.key === "currentStock" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort("price")}>
                        Price {sortConfig.key === "price" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.length > 0 ? (
                    filteredMaterials.map((material) => (
                      <TableRow key={material._id}>
                        <TableCell className="font-medium">{material.reference}</TableCell>
                        <TableCell>{material.manufacturer}</TableCell>
                        <TableCell>{material.description}</TableCell>
                        <TableCell>{material.currentStock}</TableCell>
                        <TableCell>${material.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={getStockStatusVariant(material)}>{getStockStatus(material)}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => openDetailsModal(material)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Link to={`/materials/edit/${material._id}`}>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(material._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
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
      </div>
      <ContactUs />
      <AnimatePresence>
        {selectedMaterial && <MaterialDetailsModal material={selectedMaterial} onClose={closeDetailsModal} />}
      </AnimatePresence>
    </div>
  )
}

const MaterialDetailsModal = ({ material, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{material.reference}</h2>
        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Manufacturer" value={material.manufacturer} />
          <DetailItem label="Description" value={material.description} />
          <DetailItem label="Current Stock" value={material.currentStock} />
          <DetailItem label="Minimum Stock" value={material.minimumStock} />
          <DetailItem label="Order Lot" value={material.orderLot} />
          <DetailItem label="Price" value={`$${material.price.toFixed(2)}`} />
          <DetailItem label="Critical" value={material.critical ? "Yes" : "No"} />
          <DetailItem label="Consumable" value={material.consumable ? "Yes" : "No"} />
          <DetailItem label="Supplier" value={material.supplier ? material.supplier.companyName : "N/A"} />
          <DetailItem label="Location" value={material.location ? material.location.location : "N/A"} />
          <DetailItem label="Category" value={material.category ? material.category.name : "N/A"} />
          <DetailItem label="Comment" value={material.comment || "No comment"} />
          {material.photo && (
            <div className="col-span-2">
              <img
                src={material.photo || "/placeholder.svg"}
                alt={material.reference}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">Associated Machines</h3>
          {material.machines && material.machines.length > 0 ? (
            <ul className="list-disc list-inside">
              {material.machines.map((machine) => (
                <li key={machine._id}>{machine.name}</li>
              ))}
            </ul>
          ) : (
            <p>No associated machines</p>
          )}
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">Material History</h3>
          {material.materialHistory && material.materialHistory.length > 0 ? (
            <ul className="space-y-2">
              {material.materialHistory.map((history, index) => (
                <li key={index} className="pb-2 border-b">
                  <p>
                    <strong>Date:</strong> {new Date(history.changeDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Changed By:</strong> {history.changedBy ? history.changedBy.name : "Unknown"}
                  </p>
                  <p>
                    <strong>Description:</strong> {history.description}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No history available</p>
          )}
        </div>
        <Button className="mt-6" onClick={onClose}>
          Close
        </Button>
      </motion.div>
    </motion.div>
  )
}

const DetailItem = ({ label, value }) => (
  <div>
    <span className="font-semibold text-gray-700 dark:text-gray-300">{label}:</span>
    <span className="ml-2 text-gray-600 dark:text-gray-400">{value}</span>
  </div>
)

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

