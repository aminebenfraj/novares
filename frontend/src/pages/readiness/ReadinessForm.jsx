"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { createDocumentation } from "../../apis/readiness/documentationApi"
import { createLogistics } from "../../apis/readiness/logisticsApi"
import { createMaintenance } from "../../apis/readiness/maintenanceApi"
import { createPackaging } from "../../apis/readiness/packagingApi"
import { createProcessStatusIndustrials } from "../../apis/readiness/processStatusIndustrialsApi"
import { createProductProcesses } from "../../apis/readiness/productProcessesApi"
import { createRunAtRateProduction } from "../../apis/readiness/runAtRateProductionApi"
import { createSafety } from "../../apis/readiness/safetyApi"
import { createSupp } from "../../apis/readiness/suppApi"
import { createToolingStatus } from "../../apis/readiness/toolingStatusApi"
import { createTraining } from "../../apis/readiness/trainingApi"
import { createReadiness } from "../../apis/readiness/readinessApi"
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
import { createInitialState, fieldDefinitions } from "../../components/readiness/readinessUtils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Animation variants for Framer Motion
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const ReadinessForm = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Initial form state with all required fields
  const [formData, setFormData] = useState({
    id: "",
    status: "on-going",
    project_name: "",
    description: "",
    assignedRole: "",
    assignedEmail: "",
  })

  // Initialize all domain data states
  const [documentationData, setDocumentationData] = useState(createInitialState(fieldDefinitions.Documentation))
  const [logisticsData, setLogisticsData] = useState(createInitialState(fieldDefinitions.Logistics))
  const [maintenanceData, setMaintenanceData] = useState(createInitialState(fieldDefinitions.Maintenance))
  const [packagingData, setPackagingData] = useState(createInitialState(fieldDefinitions.Packaging))
  const [processStatusIndustrialsData, setProcessStatusIndustrialsData] = useState(
    createInitialState(fieldDefinitions.ProcessStatusIndustrials),
  )
  const [productProcessData, setProductProcessData] = useState(createInitialState(fieldDefinitions.ProductProcess))
  const [runAtRateProductionData, setRunAtRateProductionData] = useState(
    createInitialState(fieldDefinitions.RunAtRateProduction),
  )
  const [safetyData, setSafetyData] = useState(createInitialState(fieldDefinitions.Safety))
  const [suppData, setSuppData] = useState(createInitialState(fieldDefinitions.Supp))
  const [toolingStatusData, setToolingStatusData] = useState(createInitialState(fieldDefinitions.ToolingStatus))
  const [trainingData, setTrainingData] = useState(createInitialState(fieldDefinitions.Training))

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
  const safeApiCall = async (apiFunction, data, entityName) => {
    try {
      setProgress((prev) => prev + 5) // Increment progress for each API call

      // For supp specifically, we need to handle the data differently
      if (entityName === "Supp") {
        // Create a formatted version of the data that matches what the server expects
        const formattedData = Object.keys(data).reduce((acc, field) => {
          acc[field] = {
            value: data[field]?.value || false,
            details: {
              tko: data[field]?.validation?.tko || false,
              ot: data[field]?.validation?.ot || false,
              ot_op: data[field]?.validation?.ot_op || false,
              is: data[field]?.validation?.is || false,
              sop: data[field]?.validation?.sop || false,
              ok_nok: data[field]?.validation?.ok_nok || "",
              who: data[field]?.validation?.who || "",
              when: data[field]?.validation?.when || "",
              validation_check: data[field]?.validation?.validation_check || false,
              comment: data[field]?.validation?.comment || "",
            },
          }
          return acc
        }, {})

        const response = await apiFunction(formattedData)
        if (response && response.data && response.data._id) {
          return response.data._id
        } else {
          throw new Error(`Invalid response from ${entityName} API`)
        }
      } else {
        // For other entities, use the original data format
        const response = await apiFunction(data)
        if (response && response.data && response.data._id) {
          return response.data._id
        } else {
          throw new Error(`Invalid response from ${entityName} API`)
        }
      }
    } catch (error) {
      console.error(`Error creating ${entityName}:`, error)
      // Check if this is the companyName validation error
      if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.message &&
        error.response.data.error.message.includes("companyName")
      ) {
        throw new Error(
          `The server is expecting a 'companyName' field that is not in your schema. Please check your server configuration.`,
        )
      }
      throw new Error(`Failed to create ${entityName}: ${error.message}`)
    }
  }

  // Helper function to format data for the Supp API
  const formatDataForApi = (data, entityName) => {
    if (entityName === "Supp") {
      return Object.keys(data).reduce((acc, field) => {
        acc[field] = {
          value: data[field]?.value || false,
          details: {
            tko: data[field]?.validation?.tko || false,
            ot: data[field]?.validation?.ot || false,
            ot_op: data[field]?.validation?.ot_op || false,
            is: data[field]?.validation?.is || false,
            sop: data[field]?.validation?.sop || false,
            ok_nok: data[field]?.validation?.ok_nok || "",
            who: data[field]?.validation?.who || "",
            when: data[field]?.validation?.when || "",
            validation_check: data[field]?.validation?.validation_check || false,
            comment: data[field]?.validation?.comment || "",
          },
        }
        return acc
      }, {})
    }
    return data
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
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
        setLoading(false)
        setProgress(0)
        return
      }

      // Create readiness data object
      const readinessData = { ...formData }

      // Create validation objects for each domain with proper error handling
      try {
        readinessData.Documentation = await safeApiCall(createDocumentation, documentationData, "Documentation")
        readinessData.Logistics = await safeApiCall(createLogistics, logisticsData, "Logistics")
        readinessData.Maintenance = await safeApiCall(createMaintenance, maintenanceData, "Maintenance")
        readinessData.Packaging = await safeApiCall(createPackaging, packagingData, "Packaging")
        readinessData.ProcessStatusIndustrials = await safeApiCall(
          createProcessStatusIndustrials,
          processStatusIndustrialsData,
          "Process Status Industrials",
        )
        readinessData.ProductProcess = await safeApiCall(createProductProcesses, productProcessData, "Product Process")
        readinessData.RunAtRateProduction = await safeApiCall(
          createRunAtRateProduction,
          runAtRateProductionData,
          "Run At Rate Production",
        )
        readinessData.Safety = await safeApiCall(createSafety, safetyData, "Safety")
        readinessData.Supp = await safeApiCall(createSupp, formatDataForApi(suppData, "Supp"), "Supp")
        readinessData.ToolingStatus = await safeApiCall(createToolingStatus, toolingStatusData, "Tooling Status")
        readinessData.Training = await safeApiCall(createTraining, trainingData, "Training")
      } catch (error) {
        setError(`API Error: ${error.message}`)
        toast({
          title: "API Error",
          description: error.message,
          variant: "destructive",
        })
        setLoading(false)
        setProgress(0)
        return
      }

      setProgress(90) // Almost done

      // Create the readiness entry
      try {
        const response = await createReadiness(readinessData)
        setProgress(100)
        setSuccessMessage("Readiness entry created successfully!")
        toast({
          title: "Success",
          description: "Readiness entry created successfully",
        })

        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate("/readiness")
        }, 2000)
      } catch (error) {
        setError(`Failed to create readiness entry: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to create readiness entry: ${error.message}`,
          variant: "destructive",
        })
        setProgress(0)
      }
    } catch (error) {
      console.error("Error creating readiness entry:", error)
      setError(`An unexpected error occurred: ${error.message}`)
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      })
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <motion.div className="container py-6 mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Create New Readiness Entry</h1>
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

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Submitting form...</span>
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
                    <CardDescription>Enter the basic information for this readiness entry.</CardDescription>
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
                    <CardDescription>Manage documentation requirements for this readiness entry.</CardDescription>
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
                    <CardDescription>Manage logistics requirements for this readiness entry.</CardDescription>
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
                    <CardDescription>Manage maintenance requirements for this readiness entry.</CardDescription>
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
                    <CardDescription>Manage packaging requirements for this readiness entry.</CardDescription>
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
                    <CardDescription>Manage process status requirements for this readiness entry.</CardDescription>
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
                    <CardDescription>Manage product process requirements for this readiness entry.</CardDescription>
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
                    <CardDescription>Manage production requirements for this readiness entry.</CardDescription>
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
                    <CardDescription>Manage safety requirements for this readiness entry.</CardDescription>
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
                    <CardDescription>Manage supp requirements for this readiness entry.</CardDescription>
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
                    <CardDescription>Manage tooling requirements for this readiness entry.</CardDescription>
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
                    <CardDescription>Manage training requirements for this readiness entry.</CardDescription>
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
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="relative overflow-hidden">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Create Readiness Entry"
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </MainLayout>
  )
}

export default ReadinessForm

