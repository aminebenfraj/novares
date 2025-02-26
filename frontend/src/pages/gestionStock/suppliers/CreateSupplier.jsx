import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupplier } from "../../../apis/gestionStockApi/supplierApi"
import { Sparkles } from 'lucide-react'
import ContactUs from "@/components/ContactUs"
import Navbar from "@/components/NavBar"

const CreateSupplier = () => {
  const navigate = useNavigate()
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setSupplier((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createSupplier(supplier)
      alert("Supplier created successfully!")
      navigate("/suppliers")
    } catch (error) {
      console.error("Failed to create supplier:", error)
      alert("Failed to create supplier. Please try again.")
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
        <Card className="w-full max-w-4xl bg-white shadow-lg dark:bg-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Create New Supplier</CardTitle>
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
            <CardFooter>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                <Button
                  type="submit"
                  className="w-full text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Supplier
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

export default CreateSupplier
