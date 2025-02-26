"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllSuppliers, deleteSupplier } from "../../../apis/gestionStockApi/supplierApi"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import ContactUs from "@/components/ContactUs"
import Navbar from "@/components/NavBar"

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState(null)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const data = await getAllSuppliers()
      setSuppliers(data)
    } catch (error) {
      console.error("Failed to fetch suppliers:", error)
      alert("Failed to fetch suppliers. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplier(id)
        fetchSuppliers()
        alert("Supplier deleted successfully!")
      } catch (error) {
        console.error("Failed to delete supplier:", error)
        alert("Failed to delete supplier. Please try again.")
      }
    }
  }

  const openDetailsModal = (supplier) => {
    setSelectedSupplier(supplier)
  }

  const closeDetailsModal = () => {
    setSelectedSupplier(null)
  }

  return (
    <div>
      <Navbar />
      <div className="container p-4 mx-auto">
        <Card className="bg-white shadow-lg dark:bg-zinc-800">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Suppliers</CardTitle>
            <Link to="/suppliers/create">
              <Button className="text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                <Plus className="w-4 h-4 mr-2" />
                Add New Supplier
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Business Phone</TableHead>
                  <TableHead>Business Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier._id}>
                    <TableCell>{supplier.companyName}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.businessPhone}</TableCell>
                    <TableCell>{supplier.businessEmail}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openDetailsModal(supplier)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Link to={`/suppliers/edit/${supplier._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(supplier._id)}>
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
        {selectedSupplier && <SupplierDetailsModal supplier={selectedSupplier} onClose={closeDetailsModal} />}
      </AnimatePresence>
    </div>
  )
}

const SupplierDetailsModal = ({ supplier, onClose }) => {
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
        className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl dark:bg-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{supplier.companyName}</h2>
        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Contact Name" value={supplier.name} />
          <DetailItem label="Business Phone" value={supplier.businessPhone} />
          <DetailItem label="Business Email" value={supplier.businessEmail} />
          <DetailItem label="Commercial Contact" value={supplier.commercialContact} />
          <DetailItem label="Company Contact" value={supplier.companyContact} />
          <DetailItem label="Technical Contact" value={supplier.technicalContact} />
          <DetailItem label="Office Phone" value={supplier.officePhone} />
          <DetailItem label="Technical Phone" value={supplier.technicalPhone} />
          <DetailItem label="Company Email" value={supplier.companyEmail} />
          <DetailItem label="Technical Email" value={supplier.technicalEmail} />
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

export default SupplierList

