"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, Save, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import MainLayout from "@/components/MainLayout"

// Import API functions
import { getReadinessById, updateReadiness } from "../../apis/readiness/readinessApi"
import { updateDocumentation } from "../../apis/readiness/documentationApi"
import { updateLogistics } from "../../apis/readiness/logisticsApi"
import { updateMaintenance } from "../../apis/readiness/maintenanceApi"
import { updatePackaging } from "../../apis/readiness/packagingApi"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// Field definitions for each module
const fieldDefinitions = {
  Documentation: {
    workStandardsInPlace: "Work Standards In Place",
    polyvalenceMatrixUpdated: "Polyvalence Matrix Updated",
    gaugesAvailable: "Gauges Available",
    qualityFileApproved: "Quality File Approved",
    drpUpdated: "DRP Updated",
  },
  Logistics: {
    loopsFlowsDefined: "Loops & Flows Defined",
    storageDefined: "Storage Defined",
    labelsCreated: "Labels Created",
    sapReferenced: "SAP Referenced",
    safetyStockReady: "Safety Stock Ready",
  },
  Maintenance: {
    sparePartsIdentifiedAndAvailable: "Spare Parts Available",
    processIntegratedInPlantMaintenance: "Process Integrated",
    maintenanceStaffTrained: "Staff Trained",
  },
  Packaging: {
    customerDefined: "Customer Defined",
    returnableLoops: "Returnable Loops",
    smallBatchSubstitute: "Small Batch Substitute",
    rampUpReady: "Ramp-Up Ready",
  },
}

// Create initial state for each module
const createInitialState = (fields) => {
  const initialState = {}
  Object.keys(fields).forEach((field) => {
    initialState[field] = {
      value: false,
      details: {
        tko: false,
        ot: false,
        ot_op: false,
        is: false,
        sop: false,
        ok_nok: "",
        who: "",
        when: "",
        validation_check: false,
        comment: "",
      },
    }
  })
  return initialState
}

// Validation section component
const ValidationSection = ({ title, fields, data, setData }) => {
  const [activeField, setActiveField] = useState(Object.keys(fields)[0])

  const handleValueChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
      },
    }))
  }

  const handleValidationChange = (field, validationField, value) => {
    setData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        details: {
          ...prev[field].details,
          [validationField]: value,
        },
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{title} Fields</CardTitle>
            <CardDescription>Select a field to edit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              {Object.keys(fields).map((field) => (
                <Button
                  key={field}
                  variant={activeField === field ? "default" : "outline"}
                  className="relative justify-start text-left pl-9"
                  onClick={() => setActiveField(field)}
                >
                  <span className="absolute left-2">
                    {data[field]?.value ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </span>
                  {fields[field]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>{fields[activeField]}</CardTitle>
            <CardDescription>Configure validation details for this field</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="status" className="w-full">
              <TabsList>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="validation">Validation Details</TabsTrigger>
              </TabsList>
              <TabsContent value="status" className="pt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${activeField}-value`}
                    checked={data[activeField]?.value || false}
                    onCheckedChange={(checked) => handleValueChange(activeField, checked === true)}
                  />
                  <Label htmlFor={`${activeField}-value`}>Mark as completed</Label>
                </div>
              </TabsContent>
              <TabsContent value="validation" className="pt-4 space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`${activeField}-tko`}>TKO</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeField}-tko`}
                          checked={data[activeField]?.details?.tko || false}
                          onCheckedChange={(checked) => handleValidationChange(activeField, "tko", checked === true)}
                        />
                        <Label htmlFor={`${activeField}-tko`}>Completed</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${activeField}-ot`}>OT</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeField}-ot`}
                          checked={data[activeField]?.details?.ot || false}
                          onCheckedChange={(checked) => handleValidationChange(activeField, "ot", checked === true)}
                        />
                        <Label htmlFor={`${activeField}-ot`}>Completed</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${activeField}-ot_op`}>OT OP</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeField}-ot_op`}
                          checked={data[activeField]?.details?.ot_op || false}
                          onCheckedChange={(checked) => handleValidationChange(activeField, "ot_op", checked === true)}
                        />
                        <Label htmlFor={`${activeField}-ot_op`}>Completed</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${activeField}-is`}>IS</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeField}-is`}
                          checked={data[activeField]?.details?.is || false}
                          onCheckedChange={(checked) => handleValidationChange(activeField, "is", checked === true)}
                        />
                        <Label htmlFor={`${activeField}-is`}>Completed</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${activeField}-sop`}>SOP</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeField}-sop`}
                          checked={data[activeField]?.details?.sop || false}
                          onCheckedChange={(checked) => handleValidationChange(activeField, "sop", checked === true)}
                        />
                        <Label htmlFor={`${activeField}-sop`}>Completed</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${activeField}-validation_check`}>Validation Check</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeField}-validation_check`}
                          checked={data[activeField]?.details?.validation_check || false}
                          onCheckedChange={(checked) =>
                            handleValidationChange(activeField, "validation_check", checked === true)
                          }
                        />
                        <Label htmlFor={`${activeField}-validation_check`}>Completed</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${activeField}-ok_nok`}>Status</Label>
                      <RadioGroup
                        value={data[activeField]?.details?.ok_nok || ""}
                        onValueChange={(value) => handleValidationChange(activeField, "ok_nok", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="OK" id={`${activeField}-ok`} />
                          <Label htmlFor={`${activeField}-ok`}>OK</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="NOK" id={`${activeField}-nok`} />
                          <Label htmlFor={`${activeField}-nok`}>NOK</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="" id={`${activeField}-none`} />
                          <Label htmlFor={`${activeField}-none`}>Not Set</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`${activeField}-who`}>Responsible Person</Label>
                        <Input
                          id={`${activeField}-who`}
                          value={data[activeField]?.details?.who || ""}
                          onChange={(e) => handleValidationChange(activeField, "who", e.target.value)}
                          placeholder="Enter name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${activeField}-when`}>Date</Label>
                        <Input
                          id={`${activeField}-when`}
                          value={data[activeField]?.details?.when || ""}
                          onChange={(e) => handleValidationChange(activeField, "when", e.target.value)}
                          placeholder="YYYY-MM-DD"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${activeField}-comment`}>Comments</Label>
                      <Textarea
                        id={`${activeField}-comment`}
                        value={data[activeField]?.details?.comment || ""}
                        onChange={(e) => handleValidationChange(activeField, "comment", e.target.value)}
                        placeholder="Add any additional comments here"
                        rows={4}
                      />
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ReadinessEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    project_name: "",
    description: "",
    status: "on-going",
    assignedEmail: "",
    assignedRole: "",
  })

  // Module data states
  const [documentationData, setDocumentationData] = useState(createInitialState(fieldDefinitions.Documentation))
  const [logisticsData, setLogisticsData] = useState(createInitialState(fieldDefinitions.Logistics))
  const [maintenanceData, setMaintenanceData] = useState(createInitialState(fieldDefinitions.Maintenance))
  const [packagingData, setPackagingData] = useState(createInitialState(fieldDefinitions.Packaging))

  // Store module IDs for updates
  const [moduleIds, setModuleIds] = useState({
    Documentation: "",
    Logistics: "",
    Maintenance: "",
    Packaging: "",
  })

  // Fetch readiness data
  useEffect(() => {
    const fetchReadinessData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getReadinessById(id)
        const data = response.data || response

        // Set form data
        setFormData({
          id: data.id || "",
          project_name: data.project_name || "",
          description: data.description || "",
          status: data.status || "on-going",
          assignedEmail: data.assignedEmail || "",
          assignedRole: data.assignedRole || "",
        })

        // Store module IDs
        setModuleIds({
          Documentation: data.Documentation?._id || "",
          Logistics: data.Logistics?._id || "",
          Maintenance: data.Maintenance?._id || "",
          Packaging: data.Packaging?._id || "",
        })

        // Set module data
        if (data.Documentation) setDocumentationData(data.Documentation)
        if (data.Logistics) setLogisticsData(data.Logistics)
        if (data.Maintenance) setMaintenanceData(data.Maintenance)
        if (data.Packaging) setPackagingData(data.Packaging)
      } catch (error) {
        console.error("Error fetching readiness data:", error)
        setError(`Failed to fetch readiness data: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to fetch readiness data: ${error.message}`,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchReadinessData()
    }
  }, [id, toast])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Calculate completion percentage
  const calculateProgress = () => {
    const totalFields = Object.keys(formData).length
    const filledFields = Object.keys(formData).filter(
      (key) => formData[key] !== "" && formData[key] !== null && formData[key] !== undefined,
    ).length

    return Math.round((filledFields / totalFields) * 100)
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

      // Update each module
      try {
        setProgress(20)

        // Update Documentation
        if (moduleIds.Documentation) {
          await updateDocumentation(moduleIds.Documentation, documentationData)
          readinessData.Documentation = moduleIds.Documentation
        }
        setProgress(35)

        // Update Logistics
        if (moduleIds.Logistics) {
          await updateLogistics(moduleIds.Logistics, logisticsData)
          readinessData.Logistics = moduleIds.Logistics
        }
        setProgress(50)

        // Update Maintenance
        if (moduleIds.Maintenance) {
          await updateMaintenance(moduleIds.Maintenance, maintenanceData)
          readinessData.Maintenance = moduleIds.Maintenance
        }
        setProgress(65)

        // Update Packaging
        if (moduleIds.Packaging) {
          await updatePackaging(moduleIds.Packaging, packagingData)
          readinessData.Packaging = moduleIds.Packaging
        }
        setProgress(80)
      } catch (error) {
        console.error("Error updating module:", error)
        setError(`Failed to update module: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to update module: ${error.message}`,
          variant: "destructive",
        })
        setSaving(false)
        setProgress(0)
        return
      }

      // Update the readiness entry
      try {
        await updateReadiness(id, readinessData)
        setProgress(100)
        setSuccessMessage("Readiness entry updated successfully!")
        toast({
          title: "Success",
          description: "Readiness entry updated successfully",
        })

        // Navigate after a short delay
        setTimeout(() => {
          navigate(`/readiness/detail/${id}`)
        }, 2000)
      } catch (error) {
        console.error("Error updating readiness entry:", error)
        setError(`Failed to update readiness entry: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to update readiness entry: ${error.message}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setError(`An unexpected error occurred: ${error.message}`)
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading readiness data...</span>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div className="container py-6 mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(`/readiness/detail/${id}`)} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Readiness Entry</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 text-green-800 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {saving && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Updating readiness entry...</span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
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
                        <Label htmlFor="id">ID</Label>
                        <Input
                          id="id"
                          name="id"
                          value={formData.id}
                          onChange={handleInputChange}
                          disabled
                          className="bg-gray-100"
                        />
                        <p className="text-xs text-muted-foreground">Auto-generated ID</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                          <SelectTrigger>
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
                      <Label htmlFor="project_name" className="flex items-center">
                        Project Name <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <Input
                        id="project_name"
                        name="project_name"
                        value={formData.project_name}
                        onChange={handleInputChange}
                        required
                      />
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedRole">Assigned Role</Label>
                      <Input
                        id="assignedRole"
                        name="assignedRole"
                        value={formData.assignedRole}
                        onChange={handleInputChange}
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
                      title="Documentation"
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
                      title="Logistics"
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
                      title="Maintenance"
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
                      title="Packaging"
                      fields={fieldDefinitions.Packaging}
                      data={packagingData}
                      setData={setPackagingData}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </Tabs>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <span className="mr-2 text-sm text-muted-foreground">Form completion:</span>
              <Progress value={calculateProgress()} className="w-32 h-2" />
              <span className="ml-2 text-sm text-muted-foreground">{calculateProgress()}%</span>
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate(`/readiness/detail/${id}`)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
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
            </div>
          </div>
        </form>
      </motion.div>
    </MainLayout>
  )
}

export default ReadinessEdit
