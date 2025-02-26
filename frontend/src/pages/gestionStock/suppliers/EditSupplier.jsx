import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupplierById, updateSupplier } from "../../../apis/gestionStockApi/supplierApi"
import { Save, ArrowLeft } from 'lucide-react'
import ContactUs from "@/components/ContactUs"
import Navbar from "@/components/NavBar"

const EditSupplier = () => {
  const [supplier, setSupplier] = useState({
    companyName: "",
    name: "",
    businessPhone: "",
    businessEmail: "",
    commercialContact: "",
    companyContact: "",
    technicalContact: "",
    officePhone: "",
    technicalPhone: "",
    companyEmail: "",
    technicalEmail: "",
  })
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchSupplier()
    }
  }, [id])

  const fetchSupplier = async () => {
    try {
      const data = await getSupplierById(id)
      setSupplier(data)
    } catch (error) {
      console.error("Failed to fetch supplier:", error)
      alert("Failed to fetch supplier. Redirecting to suppliers list.")
      navigate("/suppliers")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSupplier((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateSupplier(id, supplier)
      alert("Supplier updated successfully!")
      navigate("/suppliers")
    } catch (error) {
      console.error("Failed to update supplier:", error)
      alert("Failed to update supplier. Please try again.")
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
        <Card className="w-full max-w-4xl bg-white shadow-lg dark:bg-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Edit Supplier</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="companyName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={supplier.companyName}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Contact Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={supplier.name}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="businessPhone" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Business Phone
                  </label>
                  <Input
                    id="businessPhone"
                    name="businessPhone"
                    value={supplier.businessPhone}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter business phone"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="businessEmail" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Business Email
                  </label>
                  <Input
                    id="businessEmail"
                    name="businessEmail"
                    value={supplier.businessEmail}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter business email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="commercialContact" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Commercial Contact
                  </label>
                  <Input
                    id="commercialContact"
                    name="commercialContact"
                    value={supplier.commercialContact}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter commercial contact"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="companyContact" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Company Contact
                  </label>
                  <Input
                    id="companyContact"
                    name="companyContact"
                    value={supplier.companyContact}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter company contact"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="technicalContact" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Technical Contact
                  </label>
                  <Input
                    id="technicalContact"
                    name="technicalContact"
                    value={supplier.technicalContact}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter technical contact"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="officePhone" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Office Phone
                  </label>
                  <Input
                    id="officePhone"
                    name="officePhone"
                    value={supplier.officePhone}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter office phone"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="technicalPhone" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Technical Phone
                  </label>
                  <Input
                    id="technicalPhone"
                    name="technicalPhone"
                    value={supplier.technicalPhone}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter technical phone"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="companyEmail" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Company Email
                  </label>
                  <Input
                    id="companyEmail"
                    name="companyEmail"
                    value={supplier.companyEmail}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter company email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="technicalEmail" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Technical Email
                  </label>
                  <Input
                    id="technicalEmail"
                    name="technicalEmail"
                    value={supplier.technicalEmail}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter technical email"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="button" variant="outline" onClick={() => navigate("/suppliers")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update Supplier
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </div>
      <ContactUs />
    </div>
  )
}

export default EditSupplier
