
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getReadinessById, updateReadiness } from "../../apis/readiness/readinessApi"
import { updateDocumentation } from "../../apis/readiness/documentationApi"
import { updateLogistics } from "../../apis/readiness/logisticsApi"
import { updateMaintenance } from "../../apis/readiness/maintenanceApi"
import { updatePackaging } from "../../apis/readiness/packagingApi"
import { updateProcessStatusIndustrials } from "../../apis/readiness/processStatusIndustrialsApi"
import { updateProductProcesses } from "../../apis/readiness/productProcessesApi"
import { updateRunAtRateProduction } from "../../apis/readiness/runAtRateProductionApi"
import { updateSafety } from "../../apis/readiness/safetyApi"
import { updateSupp } from "../../apis/readiness/suppApi"
import { updateToolingStatus } from "../../apis/readiness/toolingStatusApi"
import { updateTraining } from "../../apis/readiness/trainingApi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import MainLayout from "@/components/MainLayout"
import { ValidationSection } from "../../components/readiness/ValidationSection"
import { fieldDefinitions } from "../../components/readiness/readinessUtils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const ReadinessEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    status: "on-going",
    project_name: "",
    description: "",
    assignedRole: "",
    assignedEmail: "",
  })

  // Domain data states
  const [documentationData, setDocumentationData] = useState({})
  const [logisticsData, setLogisticsData] = useState({})
  const [maintenanceData, setMaintenanceData] = useState({})
  const [packagingData, setPackagingData] = useState({})
  const [processStatusIndustrialsData, setProcessStatusIndustrialsData] = useState({})
  const [productProcessData, setProductProcessData] = useState({})
  const [runAtRateProductionData, setRunAtRateProductionData] = useState({})
  const [safetyData, setSafetyData] = useState({})
  const [suppData, setSuppData] = useState({})
  const [toolingStatusData, setToolingStatusData] = useState({})
  const [trainingData, setTrainingData] = useState({})

  // Store original IDs for updates
  const [entityIds, setEntityIds] = useState({
    Documentation: "",
    Logistics: "",
    Maintenance: "",
    Packaging: "",
    ProcessStatusIndustrials: "",
    ProductProcess: "",
    RunAtRateProduction: "",
    Safety: "",
    Supp: "",
    ToolingStatus: "",
    Training: "",
  })

  // Fetch readiness details
  useEffect(() => {
    const fetchReadinessDetails = async () => {
      try {
        setLoading(true)
        const response = await getReadinessById(id)
        const data = response.data

        // Set main form data
        setFormData({
          id: data.id || "",
          status: data.status || "on-going",
          project_name: data.project_name || "",
          description: data.description || "",
          assignedRole: data.assignedRole || "",
          assignedEmail: data.assignedEmail || "",
        })

        // Store entity IDs for updates
        const ids = {
          Documentation: data.Documentation?._id || "",
          Logistics: data.Logistics?._id || "",
          Maintenance: data.Maintenance?._id || "",
          Packaging: data.Packaging?._id || "",
          ProcessStatusIndustrials: data.ProcessStatusIndustrials?._id || "",
          ProductProcess: data.ProductProcess?._id || "",
          RunAtRateProduction: data.RunAtRateProduction?._id || "",
          Safety: data.Safety?._id || "",
          Supp: data.Supp?._id || "",
          ToolingStatus: data.ToolingStatus?._id || "",
          Training: data.Training?._id || "",
        }
        setEntityIds(ids)

        // Set domain data
        if (data.Documentation) setDocumentationData(data.Documentation)
        if (data.Logistics) setLogisticsData(data.Logistics)
        if (data.Maintenance) setMaintenanceData(data.Maintenance)
        if (data.Packaging) setPackagingData(data.Packaging)
        if (data.ProcessStatusIndustrials) setProcessStatusIndustrialsData(data.ProcessStatusIndustrials)
        if (data.ProductProcess) setProductProcessData(data.ProductProcess)
        if (data.RunAtRateProduction) setRunAtRateProductionData(data.RunAtRateProduction)
        if (data.Safety) setSafetyData(data.Safety)
        if (data.Supp) setSuppData(data.Supp)
        if (data.ToolingStatus) setToolingStatusData(data.ToolingStatus)
        if (data.Training) setTrainingData(data.Training)
      } catch (error) {
        console.error("Error fetching readiness details:", error)
        toast({
          title: "Error",
          description: "Failed to fetch readiness details",
          variant: "destructive",
        })
        setError("Failed to fetch readiness details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchReadinessDetails()
    }
  }, [id, toast])

  // Handle input changes for main form
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes for main form
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Calculate completion percentage for progress bar
  const calculateProgress = () => {
    const totalFields = Object.keys(formData).length
    const filledFields = Object.keys(formData).filter(
      (key) => formData[key] !== "" && formData[key] !== null && formData[key] !== undefined,
    ).length

    return Math.round((filledFields / totalFields) * 100)
  }

  // Safe API call function with error handling
  const safeApiCall = async (apiFunction, id, data, entityName) => {
    try {
      setProgress((prev) => prev + 5) // Increment progress for each API call

      // For supp specifically, we need to handle the data differently
      if (entityName === "Supp") {
        // Create a formatted version of the data that matches what the server expects
        const formattedData = Object.keys(data).reduce((acc, field) => {
          acc[field] = {
            value: data[field]?.value || false,
            details: {
              tko: data[field]?.details?.tko || false,
              ot: data[field]?.details?.ot || false,
              ot_op: data[field]?.details?.ot_op || false,
              is: data[field]?.details?.is || false,
              sop: data[field]?.details?.sop || false,
              ok_nok: data[field]?.details?.ok_nok || "",
              who: data[field]?.details?.who || "",
              when: data[field]?.details?.when || "",
              validation_check: data[field]?.details?.validation_check || false,
              comment: data[field]?.details?.comment || "",
            },
          }
          return acc
        }, {})

        const response = await apiFunction(id, formattedData)
        if (response && response.data && response.data._id) {
          return response.data._id
        } else {
          throw new Error(`Invalid response from ${entityName} API`)
        }
      } else {
        // For other entities, use the original data format
        const response = await apiFunction(id, data)
        if (response && response.data && response.data._id) {
          return response.data._id
        } else {
          throw new Error(`Invalid response from ${entityName} API`)
        }
      }
    } catch (error) {
      console.error(`Error updating ${entityName}:`, error)
      throw new Error(`Failed to update ${entityName}: ${error.message}`)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccessMessage(null)
    setProgress(10) // Start progress

    try {
      // Validate required fields
      if (!formData.project_name || !formData.assignedEmail) {
        setError("Please fill in all required fields.")
        toast({
          title: "Warning",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        setSaving(false)
        setProgress(0)
        return
      }

      // Create readiness data object
      const readinessData = { ...formData }

      // Update validation objects for each domain with proper error handling
      try {
        if (entityIds.Documentation) {
          await safeApiCall(updateDocumentation, entityIds.Documentation, documentationData, "Documentation")
        }
        if (entityIds.Logistics) {
          await safeApiCall(updateLogistics, entityIds.Logistics, logisticsData, "Logistics")
        }
        if (entityIds.Maintenance) {
          await safeApiCall(updateMaintenance, entityIds.Maintenance, maintenanceData, "Maintenance")
        }
        if (entityIds.Packaging) {
          await safeApiCall(updatePackaging, entityIds.Packaging, packagingData, "Packaging")
        }
        if (entityIds.ProcessStatusIndustrials) {
          await safeApiCall(
            updateProcessStatusIndustrials,
            entityIds.ProcessStatusIndustrials,
            processStatusIndustrialsData,
            "Process Status Industrials",
          )
        }
        if (entityIds.ProductProcess) {
          await safeApiCall(updateProductProcesses, entityIds.ProductProcess, productProcessData, "Product Process")
        }
        if (entityIds.RunAtRateProduction) {
          await safeApiCall(
            updateRunAtRateProduction,
            entityIds.RunAtRateProduction,
            runAtRateProductionData,
            "Run At Rate Production",
          )
        }
        if (entityIds.Safety) {
          await safeApiCall(updateSafety, entityIds.Safety, safetyData, "Safety")
        }
        if (entityIds.Supp) {
          await safeApiCall(updateSupp, entityIds.Supp, suppData, "Supp")
        }
        if (entityIds.ToolingStatus) {
          await safeApiCall(updateToolingStatus, entityIds.ToolingStatus, toolingStatusData, "Tooling Status")
        }
        if (entityIds.Training) {
          await safeApiCall(updateTraining, entityIds.Training, trainingData, "Training")
        }
      } catch (error) {
        setError(`API Error: ${error.message}`)
        toast({
          title: "API Error",
          description: error.message,
          variant: "destructive",
        })
        setSaving(false)
        setProgress(0)
        return
      }

      setProgress(90) // Almost done

      // Update the readiness entry
      try {
        const response = await updateReadiness(id, readinessData)
        setProgress(100)
        setSuccessMessage("Readiness entry updated successfully!")
        toast({
          title: "Success",
          description: "Readiness entry updated successfully",
        })

        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate(`/readiness/${id}`)
        }, 2000)
      } catch (error) {
        setError(`Failed to update readiness entry: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to update readiness entry: ${error.message}`,
          variant: "destructive",
        })
        setProgress(0)
      }
    } catch (error) {
      console.error("Error updating readiness entry:", error)
      setError(`An unexpected error occurred: ${error.message}`)
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      })
      setProgress(0)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-6 mx-auto">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading readiness details...</span>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div className="container py-6 mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(`/readiness/${id}`)} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Readiness Entry</h1>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Alert variant="success" className="text-green-800 border-green-200 bg-green-50">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {saving && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Saving changes...</span>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap mb-6">
              <TabsTrigger value="general" className="flex-grow">
                General Information
              </TabsTrigger>
              <TabsTrigger value="documentation" className="flex-grow">
                Documentation
              </TabsTrigger>
              <TabsTrigger value="logistics" className="flex-grow">
                Logistics
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="flex-grow">
                Maintenance
              </TabsTrigger>
              <TabsTrigger value="packaging" className="flex-grow">
                Packaging
              </TabsTrigger>
              <TabsTrigger value="process" className="flex-grow">
                Process Status
              </TabsTrigger>
              <TabsTrigger value="product" className="flex-grow">
                Product Process
              </TabsTrigger>
              <TabsTrigger value="production" className="flex-grow">
                Production
              </TabsTrigger>
              <TabsTrigger value="safety" className="flex-grow">
                Safety
              </TabsTrigger>
              <TabsTrigger value="supp" className="flex-grow">
                Supp
              </TabsTrigger>
              <TabsTrigger value="tooling" className="flex-grow">
                Tooling Status
              </TabsTrigger>
              <TabsTrigger value="training" className="flex-grow">
                Training
              </TabsTrigger>
            </TabsList>

            <motion.div key={activeTab} initial="hidden" animate="visible" variants={slideUp} exit={{ opacity: 0 }}>
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Edit the basic information for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="project_name" className="flex items-center">
                          Project Name <span className="ml-1 text-red-500">*</span>
                        </Label>
                        <Input
                          id="project_name"
                          name="project_name"
                          value={formData.project_name}
                          onChange={handleInputChange}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                          <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="on-going">On-going</SelectItem>
                            <SelectItem value="stand-by">Stand-by</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedEmail" className="flex items-center">
                        Assigned Email <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <Input
                        id="assignedEmail"
                        name="assignedEmail"
                        type="email"
                        value={formData.assignedEmail}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedRole">Assigned Role</Label>
                      <Input
                        id="assignedRole"
                        name="assignedRole"
                        value={formData.assignedRole}
                        onChange={handleInputChange}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentation">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>Edit documentation requirements for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ValidationSection
                      title="documentation"
                      fields={fieldDefinitions.Documentation}
                      data={documentationData}
                      setData={setDocumentationData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logistics">
                <Card>
                  <CardHeader>
                    <CardTitle>Logistics</CardTitle>
                    <CardDescription>Edit logistics requirements for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ValidationSection
                      title="logistics"
                      fields={fieldDefinitions.Logistics}
                      data={logisticsData}
                      setData={setLogisticsData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="maintenance">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance</CardTitle>
                    <CardDescription>Edit maintenance requirements for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ValidationSection
                      title="maintenance"
                      fields={fieldDefinitions.Maintenance}
                      data={maintenanceData}
                      setData={setMaintenanceData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="packaging">
                <Card>
                  <CardHeader>
                    <CardTitle>Packaging</CardTitle>
                    <CardDescription>Edit packaging requirements for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ValidationSection
                      title="packaging"
                      fields={fieldDefinitions.Packaging}
                      data={packagingData}
                      setData={setPackagingData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="process">
                <Card>
                  <CardHeader>
                    <CardTitle>Process Status Industrials</CardTitle>
                    <CardDescription>Edit process status requirements for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ValidationSection
                      title="process"
                      fields={fieldDefinitions.ProcessStatusIndustrials}
                      data={processStatusIndustrialsData}
                      setData={setProcessStatusIndustrialsData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="product">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Process</CardTitle>
                    <CardDescription>Edit product process requirements for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ValidationSection
                      title="product"
                      fields={fieldDefinitions.ProductProcess}
                      data={productProcessData}
                      setData={setProductProcessData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="production">
                <Card>
                  <CardHeader>
                    <CardTitle>Run At Rate Production</CardTitle>
                    <CardDescription>Edit production requirements for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ValidationSection
                      title="production"
                      fields={fieldDefinitions.RunAtRateProduction}
                      data={runAtRateProductionData}
                      setData={setRunAtRateProductionData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="safety">
                <Card>
                  <CardHeader>
                    <CardTitle>Safety</CardTitle>
                    <CardDescription>Edit safety requirements for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ValidationSection
                      title="safety"
                      fields={fieldDefinitions.Safety}
                      data={safetyData}
                      setData={setSafetyData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="supp">
                <Card>
                  <CardHeader>
                    <CardTitle>Supp</CardTitle>
                    <CardDescription>Edit supp requirements for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ValidationSection
                      title="supp"
                      fields={fieldDefinitions.Supp}
                      data={suppData}
                      setData={setSuppData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tooling">
                <Card>
                  <CardHeader>
                    <CardTitle>Tooling Status</CardTitle>
                    <CardDescription>Edit tooling requirements for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ValidationSection
                      title="tooling"
                      fields={fieldDefinitions.ToolingStatus}
                      data={toolingStatusData}
                      setData={setToolingStatusData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="training">
                <Card>
                  <CardHeader>
                    <CardTitle>Training</CardTitle>
                    <CardDescription>Edit training requirements for this readiness entry.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ValidationSection
                      title="training"
                      fields={fieldDefinitions.Training}
                      data={trainingData}
                      setData={setTrainingData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </Tabs>

          <motion.div
            className="flex items-center justify-between mt-6"
            variants={slideUp}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center">
              <span className="mr-2 text-sm text-muted-foreground">Form completion:</span>
              <Progress value={calculateProgress()} className="w-32 h-2" />
              <span className="ml-2 text-sm text-muted-foreground">{calculateProgress()}%</span>
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate(`/readiness/${id}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="relative overflow-hidden">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </MainLayout>
  )
}

export default ReadinessEdit

