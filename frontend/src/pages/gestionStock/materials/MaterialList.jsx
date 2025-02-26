"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllMaterials, deleteMaterial } from "../../../apis/gestionStockApi/materialApi"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import ContactUs from "@/components/ContactUs"
import Navbar from "@/components/NavBar"

const MaterialList = () => {
  const [materials, setMaterials] = useState([])
  const [selectedMaterial, setSelectedMaterial] = useState(null)

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const data = await getAllMaterials()
      setMaterials(data)
    } catch (error) {
      console.error("Failed to fetch materials:", error)
      alert("Failed to fetch materials. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await deleteMaterial(id)
        fetchMaterials()
        alert("Material deleted successfully!")
      } catch (error) {
        console.error("Failed to delete material:", error)
        alert("Failed to delete material. Please try again.")
      }
    }
  }

  const openDetailsModal = (material) => {
    setSelectedMaterial(material)
  }

  const closeDetailsModal = () => {
    setSelectedMaterial(null)
  }

  return (
    <div>
      <Navbar />
      <div className="container p-4 mx-auto">
        <Card className="bg-white shadow-lg dark:bg-zinc-800">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Materials</CardTitle>
            <Link to="/materials/create">
              <Button className="text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                <Plus className="w-4 h-4 mr-2" />
                Add New Material
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Minimum Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Critical</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material._id}>
                    <TableCell>{material.reference}</TableCell>
                    <TableCell>{material.manufacturer}</TableCell>
                    <TableCell>{material.description}</TableCell>
                    <TableCell>{material.currentStock}</TableCell>
                    <TableCell>{material.minimumStock}</TableCell>
                    <TableCell>${material.price.toFixed(2)}</TableCell>
                    <TableCell>{material.critical ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openDetailsModal(material)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Link to={`/materials/edit/${material._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(material._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
        className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl dark:bg-zinc-800 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{material.reference}</h2>
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
    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{label}:</span>
    <span className="ml-2 text-zinc-600 dark:text-zinc-400">{value}</span>
  </div>
)

export default MaterialList

