"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, Save, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import {
  getQualificationConfirmationById,
  updateQualificationConfirmation,
} from "../../apis/qualificationconfirmationapi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import MainLayout from "@/components/MainLayout"

const qualificationConfirmationFields = [
  "using_up_old_stock",
  "using_up_safety_stocks",
  "updating_version_number_mould",
  "updating_version_number_product_label",
  "management_of_manufacturing_programmes",
  "specific_spotting_of_packaging_with_label",
  "management_of_galia_identification_labels",
  "preservation_measure",
  "product_traceability_label_modification",
  "information_to_production",
  "information_to_customer_logistics",
  "information_to_customer_quality",
  "updating_customer_programme_data_sheet",
]

// Define the field labels and descriptions for better UI
const fieldConfig = {
  using_up_old_stock: {
    label: "Using Up Old Stock",
    description: "Plan for using up existing inventory",
  },
  using_up_safety_stocks: {
    label: "Using Up Safety Stocks",
    description: "Plan for using up safety stock inventory",
  },
  updating_version_number_mould: {
    label: "Updating Version Number Mould",
    description: "Update version numbers on moulds",
  },
  updating_version_number_product_label: {
    label: "Updating Version Number Product Label",
    description: "Update version numbers on product labels",
  },
  management_of_manufacturing_programmes: {
    label: "Management of Manufacturing Programmes",
    description: "Update manufacturing program schedules",
  },
  specific_spotting_of_packaging_with_label: {
    label: "Specific Spotting of Packaging with Label",
    description: "Ensure packaging is properly labeled",
  },
  management_of_galia_identification_labels: {
    label: "Management of Galia Identification Labels",
    description: "Update Galia identification labels",
  },
  preservation_measure: {
    label: "Preservation Measure",
    description: "Implement product preservation measures",
  },
  product_traceability_label_modification: {
    label: "Product Traceability Label Modification",
    description: "Update product traceability labels",
  },
  information_to_production: {
    label: "Information to Production",
    description: "Communicate changes to production team",
  },
  information_to_customer_logistics: {
    label: "Information to Customer Logistics",
    description: "Communicate changes to customer logistics",
  },
  information_to_customer_quality: {
    label: "Information to Customer Quality",
    description: "Communicate changes to customer quality team",
  },
  updating_customer_programme_data_sheet: {
    label: "Updating Customer Programme Data Sheet",
    description: "Update customer program documentation",
  },
}

const EditQualificationConfirmation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("using_up_old_stock")
  const [formData, setFormData] = useState({})
  const [massProductionId, setMassProductionId] = useState(null)

  // Enhanced useEffect to extract massProductionId from multiple sources
  useEffect(() => {
    const extractMassProductionId = async () => {
      // Try to get massProductionId from URL query parameters
      const queryParams = new URLSearchParams(window.location.search)
      const mpId = queryParams.get("massProductionId")

      if (mpId) {
        console.log("Extracted massProductionId from URL query:", mpId)
        setMassProductionId(mpId)
        // Store in localStorage for fallback
        localStorage.setItem("lastMassProductionId", mpId)
        return
      }

      // If not found in query params, check if it's in the URL path
      const pathParts = window.location.pathname.split("/")
      const editIndex = pathParts.indexOf("edit")
      if (editIndex > 0 && editIndex < pathParts.length - 1) {
        const pathMpId = pathParts[editIndex + 1]
        if (pathMpId && pathMpId !== "masspd_idAttachment") {
          console.log("Extracted massProductionId from URL path:", pathMpId)
          setMassProductionId(pathMpId)
          localStorage.setItem("lastMassProductionId", pathMpId)
          return
        }
      }

      // Try to get from localStorage as a fallback
      const storedMpId = localStorage.getItem("lastMassProductionId")
      if (storedMpId) {
        console.log("Retrieved massProductionId from localStorage:", storedMpId)
        setMassProductionId(storedMpId)
        return
      }
    }

    extractMassProductionId()
  }, [])

  // Fetch qualification confirmation data
  useEffect(() => {
    const fetchQualificationConfirmation = async () => {
      try {
        setIsLoading(true)
        const data = await getQualificationConfirmationById(id)

        // Initialize form data with fetched data
        const initialFormData = {}
        qualificationConfirmationFields.forEach((field) => {
          initialFormData[field] = {
            value: data[field]?.value || false,
            task: {
              check: data[field]?.task?.check || false,
              responsible: data[field]?.task?.responsible || "",
              planned: data[field]?.task?.planned || "",
              done: data[field]?.task?.done || "",
              comments: data[field]?.task?.comments || "",
              filePath: data[field]?.task?.filePath || null,
            },
          }
        })

        setFormData(initialFormData)

        // Check for possible massProduction reference fields
        if (data._massProductionId) {
          console.log("Found massProductionId in _massProductionId:", data._massProductionId)
          setMassProductionId(data._massProductionId)
        } else if (data.massProductionId) {
          console.log("Found massProductionId in massProductionId:", data.massProductionId)
          setMassProductionId(data.massProductionId)
        } else if (data.massProduction) {
          const mpRef = typeof data.massProduction === "object" ? data.massProduction._id : data.massProduction
          console.log("Found massProductionId in massProduction:", mpRef)
          setMassProductionId(mpRef)
        }
      } catch (error) {
        console.error("Error fetching qualification confirmation:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load qualification confirmation data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchQualificationConfirmation()
    }
  }, [id, toast])

  // Handle checkbox change for main value
  const handleValueChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
      },
    }))
  }

  // Handle task field changes
  const handleTaskChange = (field, taskField, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        task: {
          ...prev[field].task,
          [taskField]: value,
        },
      },
    }))
  }

  // Handle file upload
  const handleFileChange = (field, file) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        task: {
          ...prev[field].task,
          filePath: file,
        },
      },
    }))
  }

  // Handle navigation back to the mass production details page
  const handleBack = () => {
    if (massProductionId && massProductionId !== "masspd_idAttachment") {
      console.log("Navigating back to mass production detail with ID:", massProductionId)
      // Ensure we're using the correct URL format
      navigate(`/masspd/detail/${massProductionId}`)
    } else {
      console.log("No valid massProductionId found, navigating to qualification confirmation list")
      navigate("/qualification-confirmation")
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Process file paths for submission
      const submissionData = { ...formData }
      Object.keys(submissionData).forEach((field) => {
        if (submissionData[field].task.filePath instanceof File) {
          submissionData[field].task.filePath = submissionData[field].task.filePath.name
        }
      })

      await updateQualificationConfirmation(id, submissionData)

      toast({
        title: "Success",
        description: "Qualification confirmation updated successfully",
      })

      // Navigate back to mass production details page if massProductionId is available
      handleBack()
    } catch (error) {
      console.error("Error updating qualification confirmation:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update qualification confirmation",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="container px-4 py-8 mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Qualification Confirmation</h1>
                <p className="text-muted-foreground">
                  Update qualification confirmation details and validation information
                </p>
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Qualification Confirmation Fields</CardTitle>
                  <CardDescription>Select a field to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto">
                      {qualificationConfirmationFields.map((field) => (
                        <TabsTrigger key={field} value={field} className="relative justify-start mb-1 text-left pl-9">
                          <span className="absolute left-2">
                            {formData[field]?.value ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </span>
                          {fieldConfig[field].label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>{fieldConfig[activeTab].label}</CardTitle>
                  <CardDescription>{fieldConfig[activeTab].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="status" className="w-full">
                    <TabsList>
                      <TabsTrigger value="status">Status</TabsTrigger>
                      <TabsTrigger value="details">Task Details</TabsTrigger>
                    </TabsList>
                    <TabsContent value="status" className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeTab}-value`}
                          checked={formData[activeTab]?.value || false}
                          onCheckedChange={(checked) => handleValueChange(activeTab, checked === true)}
                        />
                        <Label htmlFor={`${activeTab}-value`}>Mark as completed</Label>
                      </div>
                    </TabsContent>
                    <TabsContent value="details" className="pt-4 space-y-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-responsible`}>Responsible Person</Label>
                            <Input
                              id={`${activeTab}-responsible`}
                              value={formData[activeTab]?.task?.responsible || ""}
                              onChange={(e) => handleTaskChange(activeTab, "responsible", e.target.value)}
                              placeholder="Enter name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-planned`}>Planned Date</Label>
                            <Input
                              id={`${activeTab}-planned`}
                              type="date"
                              value={formData[activeTab]?.task?.planned || ""}
                              onChange={(e) => handleTaskChange(activeTab, "planned", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-done`}>Completion Date</Label>
                            <Input
                              id={`${activeTab}-done`}
                              type="date"
                              value={formData[activeTab]?.task?.done || ""}
                              onChange={(e) => handleTaskChange(activeTab, "done", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-file`}>Upload Document</Label>
                            <Input
                              id={`${activeTab}-file`}
                              type="file"
                              onChange={(e) => handleFileChange(activeTab, e.target.files[0])}
                            />
                            {formData[activeTab]?.task?.filePath && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {typeof formData[activeTab].task.filePath === "string"
                                  ? formData[activeTab].task.filePath
                                  : formData[activeTab].task.filePath.name}
                              </p>
                            )}
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-comments`}>Comments</Label>
                            <Textarea
                              id={`${activeTab}-comments`}
                              value={formData[activeTab]?.task?.comments || ""}
                              onChange={(e) => handleTaskChange(activeTab, "comments", e.target.value)}
                              placeholder="Add any additional comments here"
                              rows={4}
                            />
                          </div>

                          <div className="flex items-center pt-2 space-x-2">
                            <Checkbox
                              id={`${activeTab}-check`}
                              checked={formData[activeTab]?.task?.check || false}
                              onCheckedChange={(checked) => handleTaskChange(activeTab, "check", checked === true)}
                            />
                            <Label htmlFor={`${activeTab}-check`}>Mark task as completed</Label>
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default EditQualificationConfirmation
