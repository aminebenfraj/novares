"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupplierById, updateSupplier } from "../../../apis/gestionStockApi/supplierApi"
import { Save, ArrowLeft, Building, User, Phone, Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import ContactUs from "@/components/ContactUs"
import Navbar from "@/components/NavBar"
import MainLayout from "@/components/MainLayout"

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const formItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

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
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [activeTab, setActiveTab] = useState("company")
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchSupplier()
    }
  }, [id])

  const fetchSupplier = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getSupplierById(id)
      setSupplier(data)
    } catch (error) {
      console.error("Failed to fetch supplier:", error)
      setError("Failed to fetch supplier details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSupplier((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await updateSupplier(id, supplier)
      setSuccess("Supplier updated successfully!")

      // Navigate after a short delay
      setTimeout(() => {
        navigate("/suppliers")
      }, 1500)
    } catch (error) {
      console.error("Failed to update supplier:", error)
      setError("Failed to update supplier. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-zinc-900 dark:text-zinc-100 animate-spin" />
              <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading supplier details...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
        <Navbar />
        <div className="container p-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/suppliers")}
              className="mb-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Suppliers
            </Button>

            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Edit Supplier</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Update supplier information and contact details</p>
              </div>
            </div>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Alert className="text-green-800 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <Card className="overflow-hidden border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-zinc-800/80">
            <CardHeader className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
              <CardTitle className="flex items-center text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                <Building className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
                {supplier.companyName || "Edit Supplier"}
              </CardTitle>
              <CardDescription className="text-zinc-500 dark:text-zinc-400">
                Fill in the form below to update the supplier information
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 border-b">
                  <TabsList className="justify-start w-full h-auto p-0 bg-transparent">
                    <TabsTrigger
                      value="company"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 dark:data-[state=active]:border-zinc-100 rounded-none px-4 py-3 data-[state=active]:shadow-none"
                    >
                      Company Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="contacts"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 dark:data-[state=active]:border-zinc-100 rounded-none px-4 py-3 data-[state=active]:shadow-none"
                    >
                      Contact Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="technical"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 dark:data-[state=active]:border-zinc-100 rounded-none px-4 py-3 data-[state=active]:shadow-none"
                    >
                      Technical Info
                    </TabsTrigger>
                  </TabsList>
                </div>

                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="company" className="p-6 m-0">
                    <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-6">
                      <motion.div variants={formItemVariants} className="space-y-2">
                        <Label htmlFor="companyName" className="text-zinc-700 dark:text-zinc-300">
                          Company Name <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Building className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
                          <Input
                            id="companyName"
                            name="companyName"
                            value={supplier.companyName}
                            onChange={handleChange}
                            required
                            className="pl-10"
                            placeholder="Enter company name"
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={formItemVariants} className="space-y-2">
                        <Label htmlFor="name" className="text-zinc-700 dark:text-zinc-300">
                          Primary Contact Name
                        </Label>
                        <div className="relative">
                          <User className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
                          <Input
                            id="name"
                            name="name"
                            value={supplier.name}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="Enter primary contact name"
                          />
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <motion.div variants={formItemVariants} className="space-y-2">
                          <Label htmlFor="businessPhone" className="text-zinc-700 dark:text-zinc-300">
                            Business Phone
                          </Label>
                          <div className="relative">
                            <Phone className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
                            <Input
                              id="businessPhone"
                              name="businessPhone"
                              value={supplier.businessPhone}
                              onChange={handleChange}
                              className="pl-10"
                              placeholder="Enter business phone"
                            />
                          </div>
                        </motion.div>

                        <motion.div variants={formItemVariants} className="space-y-2">
                          <Label htmlFor="businessEmail" className="text-zinc-700 dark:text-zinc-300">
                            Business Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
                            <Input
                              id="businessEmail"
                              name="businessEmail"
                              type="email"
                              value={supplier.businessEmail}
                              onChange={handleChange}
                              className="pl-10"
                              placeholder="Enter business email"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="contacts" className="p-6 m-0">
                    <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-6">
                      <motion.div variants={formItemVariants} className="space-y-2">
                        <Label htmlFor="commercialContact" className="text-zinc-700 dark:text-zinc-300">
                          Commercial Contact
                        </Label>
                        <div className="relative">
                          <User className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
                          <Input
                            id="commercialContact"
                            name="commercialContact"
                            value={supplier.commercialContact}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="Enter commercial contact name"
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={formItemVariants} className="space-y-2">
                        <Label htmlFor="companyContact" className="text-zinc-700 dark:text-zinc-300">
                          Company Contact
                        </Label>
                        <div className="relative">
                          <User className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
                          <Input
                            id="companyContact"
                            name="companyContact"
                            value={supplier.companyContact}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="Enter company contact name"
                          />
                        </div>
                      </motion.div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <motion.div variants={formItemVariants} className="space-y-2">
                          <Label htmlFor="officePhone" className="text-zinc-700 dark:text-zinc-300">
                            Office Phone
                          </Label>
                          <div className="relative">
                            <Phone className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
                            <Input
                              id="officePhone"
                              name="officePhone"
                              value={supplier.officePhone}
                              onChange={handleChange}
                              className="pl-10"
                              placeholder="Enter office phone"
                            />
                          </div>
                        </motion.div>

                        <motion.div variants={formItemVariants} className="space-y-2">
                          <Label htmlFor="companyEmail" className="text-zinc-700 dark:text-zinc-300">
                            Company Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
                            <Input
                              id="companyEmail"
                              name="companyEmail"
                              type="email"
                              value={supplier.companyEmail}
                              onChange={handleChange}
                              className="pl-10"
                              placeholder="Enter company email"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="technical" className="p-6 m-0">
                    <motion.div variants={formVariants} initial="hidden" animate="visible" className="space-y-6">
                      <motion.div variants={formItemVariants} className="space-y-2">
                        <Label htmlFor="technicalContact" className="text-zinc-700 dark:text-zinc-300">
                          Technical Contact
                        </Label>
                        <div className="relative">
                          <User className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
                          <Input
                            id="technicalContact"
                            name="technicalContact"
                            value={supplier.technicalContact}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="Enter technical contact name"
                          />
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <motion.div variants={formItemVariants} className="space-y-2">
                          <Label htmlFor="technicalPhone" className="text-zinc-700 dark:text-zinc-300">
                            Technical Phone
                          </Label>
                          <div className="relative">
                            <Phone className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
                            <Input
                              id="technicalPhone"
                              name="technicalPhone"
                              value={supplier.technicalPhone}
                              onChange={handleChange}
                              className="pl-10"
                              placeholder="Enter technical phone"
                            />
                          </div>
                        </motion.div>

                        <motion.div variants={formItemVariants} className="space-y-2">
                          <Label htmlFor="technicalEmail" className="text-zinc-700 dark:text-zinc-300">
                            Technical Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
                            <Input
                              id="technicalEmail"
                              name="technicalEmail"
                              type="email"
                              value={supplier.technicalEmail}
                              onChange={handleChange}
                              className="pl-10"
                              placeholder="Enter technical email"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </TabsContent>
                </motion.div>
              </Tabs>

              <CardFooter className="flex justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/suppliers")}
                  className="border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="text-white bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 dark:from-zinc-200 dark:to-white dark:text-zinc-900 dark:hover:from-zinc-100 dark:hover:to-zinc-300"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        <ContactUs />
      </div>
    </MainLayout>
  )
}

export default EditSupplier
