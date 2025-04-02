"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"

// Import API functions
import { createDocumentation } from "../../apis/readiness/documentationApi"
import { createLogistics } from "../../apis/readiness/logisticsApi"
import { createMaintenance } from "../../apis/readiness/maintenanceApi"
import { createPackaging } from "../../apis/readiness/packagingApi"
import { createProcessStatusIndustrials } from "../../apis/readiness/processStatusIndustrialsApi"
import { createProductProcesses } from "../../apis/readiness/productProcessesApi"
import { createReadiness } from "../../apis/readiness/readinessApi"
import { createRunAtRateProduction } from "../../apis/readiness/runAtRateProductionApi"
import { createSafety } from "../../apis/readiness/safetyApi"
import { createSupp } from "../../apis/readiness/suppApi"
import { createToolingStatus } from "../../apis/readiness/toolingStatusApi"
import { createTraining } from "../../apis/readiness/trainingApi"

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
  Documentation: [
    "workStandardsInPlace",
    "polyvalenceMatrixUpdated",
    "gaugesAvailable",
    "qualityFileApproved",
    "drpUpdated",
  ],
  Logistics: ["loopsFlowsDefined", "storageDefined", "labelsCreated", "sapReferenced", "safetyStockReady"],
  Maintenance: ["sparePartsIdentifiedAndAvailable", "processIntegratedInPlantMaintenance", "maintenanceStaffTrained"],
  Packaging: ["customerDefined", "returnableLoops", "smallBatchSubstitute", "rampUpReady"],
  ProcessStatusIndustrials: [
    "processComplete",
    "processParametersIdentified",
    "pokaYokesIdentifiedAndEffective",
    "specificBoundaryPartsSamples",
    "gaugesAcceptedByPlant",
    "processCapabilitiesPerformed",
    "pfmeaIssuesAddressed",
    "reversePfmeaPerformed",
    "industrialMeansAccepted",
  ],
  ProductProcess: [
    "technicalReview",
    "dfmea",
    "pfmea",
    "injectionTools",
    "paintingProcess",
    "assyMachine",
    "checkingFixture",
    "industrialCapacity",
    "skillsDeployment",
  ],
  RunAtRateProduction: [
    "qualityWallInPlace",
    "selfRunRatePerformed",
    "dimensionalInspectionsConform",
    "rampUpDefined",
    "mppAuditCompleted",
    "reversePFMEACompleted",
    "paceBoardFollowUp",
  ],
  Safety: ["industrialMeansCompliance", "teamTraining", "safetyOfficerInformed"],
  Supp: [
    "componentsRawMaterialAvailable",
    "packagingDefined",
    "partsAccepted",
    "purchasingRedFilesTransferred",
    "automaticProcurementEnabled",
  ],
  ToolingStatus: [
    "manufacturedPartsAtLastRelease",
    "specificationsConformity",
    "partsGrainedAndValidated",
    "noBreakOrIncidentDuringInjectionTrials",
    "toolsAccepted",
    "preSerialInjectionParametersDefined",
    "serialProductionInjectionParametersDefined",
    "incompletePartsProduced",
    "toolmakerIssuesEradicated",
    "checkingFixturesAvailable",
  ],
  Training: ["visualControlQualification", "dojoTrainingCompleted", "trainingPlanDefined"],
}

// Helper function to format field names for display
const formatFieldName = (fieldName) => {
  return fieldName
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
}

// Create initial state for each module
const createInitialState = (fields) => {
  const initialState = {}
  fields.forEach((field) => {
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

function ReadinessForm() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [sectionTab, setSectionTab] = useState("documentation")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    id: `RDN-${Date.now()}-${Math.floor(Math.random() * 100)}`,
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle field value change
  const handleFieldValueChange = (section, field, checked) => {
    const setterFunction = getSectionSetter(section)
    if (setterFunction) {
      setterFunction((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          value: checked,
        },
      }))
    }
  }

  // Handle field detail change
  const handleFieldDetailChange = (section, field, detailKey, value) => {
    const setterFunction = getSectionSetter(section)
    if (setterFunction) {
      setterFunction((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          details: {
            ...prev[field].details,
            [detailKey]: value,
          },
        },
      }))
    }
  }

  // Get the appropriate setter function for a section
  const getSectionSetter = (section) => {
    switch (section) {
      case "Documentation":
        return setDocumentationData
      case "Logistics":
        return setLogisticsData
      case "Maintenance":
        return setMaintenanceData
      case "Packaging":
        return setPackagingData
      case "ProcessStatusIndustrials":
        return setProcessStatusIndustrialsData
      case "ProductProcess":
        return setProductProcessData
      case "RunAtRateProduction":
        return setRunAtRateProductionData
      case "Safety":
        return setSafetyData
      case "Supp":
        return setSuppData
      case "ToolingStatus":
        return setToolingStatusData
      case "Training":
        return setTrainingData
      default:
        return null
    }
  }

  // Get the appropriate data for a section
  const getSectionData = (section) => {
    switch (section) {
      case "Documentation":
        return documentationData
      case "Logistics":
        return logisticsData
      case "Maintenance":
        return maintenanceData
      case "Packaging":
        return packagingData
      case "ProcessStatusIndustrials":
        return processStatusIndustrialsData
      case "ProductProcess":
        return productProcessData
      case "RunAtRateProduction":
        return runAtRateProductionData
      case "Safety":
        return safetyData
      case "Supp":
        return suppData
      case "ToolingStatus":
        return toolingStatusData
      case "Training":
        return trainingData
      default:
        return {}
    }
  }

  // Format validation data for API
  const formatValidationData = (data) => {
    const formattedData = {}

    Object.keys(data).forEach((field) => {
      formattedData[field] = {
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
    })

    return formattedData
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // All fields are optional, no validation needed

      // Create readiness data object
      const readinessData = { ...formData }

      // Create each module and get their IDs
      try {
        // Format data for API calls
        const formattedDocumentationData = formatValidationData(documentationData)
        const formattedLogisticsData = formatValidationData(logisticsData)
        const formattedMaintenanceData = formatValidationData(maintenanceData)
        const formattedPackagingData = formatValidationData(packagingData)
        const formattedProcessStatusIndustrialsData = formatValidationData(processStatusIndustrialsData)
        const formattedProductProcessData = formatValidationData(productProcessData)
        const formattedRunAtRateProductionData = formatValidationData(runAtRateProductionData)
        const formattedSafetyData = formatValidationData(safetyData)
        const formattedSuppData = formatValidationData(suppData)
        const formattedToolingStatusData = formatValidationData(toolingStatusData)
        const formattedTrainingData = formatValidationData(trainingData)

        // Create Documentation
        const documentationResponse = await createDocumentation(formattedDocumentationData)
        readinessData.Documentation = documentationResponse.data._id

        // Create Logistics
        const logisticsResponse = await createLogistics(formattedLogisticsData)
        readinessData.Logistics = logisticsResponse.data._id

        // Create Maintenance
        const maintenanceResponse = await createMaintenance(formattedMaintenanceData)
        readinessData.Maintenance = maintenanceResponse.data._id

        // Create Packaging
        const packagingResponse = await createPackaging(formattedPackagingData)
        readinessData.Packaging = packagingResponse.data._id

        // Create ProcessStatusIndustrials
        const processStatusIndustrialsResponse = await createProcessStatusIndustrials(
          formattedProcessStatusIndustrialsData,
        )
        readinessData.ProcessStatusIndustrials = processStatusIndustrialsResponse.data._id

        // Create ProductProcess
        const productProcessResponse = await createProductProcesses(formattedProductProcessData)
        readinessData.ProductProcess = productProcessResponse.data._id

        // Create RunAtRateProduction
        const runAtRateProductionResponse = await createRunAtRateProduction(formattedRunAtRateProductionData)
        readinessData.RunAtRateProduction = runAtRateProductionResponse.data._id

        // Create Safety
        const safetyResponse = await createSafety(formattedSafetyData)
        readinessData.Safety = safetyResponse.data._id

        // Create Supp
        const suppResponse = await createSupp(formattedSuppData)
        readinessData.Suppliers = suppResponse.data._id

        // Create ToolingStatus
        const toolingStatusResponse = await createToolingStatus(formattedToolingStatusData)
        readinessData.ToolingStatus = toolingStatusResponse.data._id

        // Create Training
        const trainingResponse = await createTraining(formattedTrainingData)
        readinessData.Training = trainingResponse.data._id
      } catch (error) {
        console.error("Error creating module:", error)
        setError(`Failed to create module: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to create module: ${error.message}`,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Create the readiness entry
      try {
        const response = await createReadiness(readinessData)
        setSuccessMessage("Readiness entry created successfully!")
        toast({
          title: "Success",
          description: "Readiness entry created successfully",
        })

        // Navigate after a short delay
        setTimeout(() => {
          navigate("/readiness")
        }, 2000)
      } catch (error) {
        console.error("Error creating readiness entry:", error)
        setError(`Failed to create readiness entry: ${error.message}`)
        toast({
          title: "Error",
          description: `Failed to create readiness entry: ${error.message}`,
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
      setLoading(false)
    }
  }

  // Render fields for a section using Accordion
  const renderSectionFields = (section) => {
    const fields = fieldDefinitions[section]
    const sectionData = getSectionData(section)

    return (
      <Accordion type="single" collapsible className="w-full">
        {fields.map((field, index) => (
          <AccordionItem key={field} value={`item-${index}`}>
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field}
                  checked={sectionData[field]?.value || false}
                  onCheckedChange={(checked) => handleFieldValueChange(section, field, checked)}
                />
                <Label htmlFor={field} className="text-left">
                  {formatFieldName(field)}
                </Label>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`${field}-status`}>Status</Label>
                  <div className="flex items-center space-x-2">
                    {sectionData[field]?.value ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm">{sectionData[field]?.value ? "Completed" : "Pending"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Validation Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${section}-${field}-tko`}
                        checked={sectionData[field]?.details?.tko || false}
                        onCheckedChange={(checked) => handleFieldDetailChange(section, field, "tko", checked)}
                      />
                      <Label htmlFor={`${section}-${field}-tko`} className="text-sm">
                        TKO
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${section}-${field}-ot`}
                        checked={sectionData[field]?.details?.ot || false}
                        onCheckedChange={(checked) => handleFieldDetailChange(section, field, "ot", checked)}
                      />
                      <Label htmlFor={`${section}-${field}-ot`} className="text-sm">
                        OT
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${section}-${field}-ot_op`}
                        checked={sectionData[field]?.details?.ot_op || false}
                        onCheckedChange={(checked) => handleFieldDetailChange(section, field, "ot_op", checked)}
                      />
                      <Label htmlFor={`${section}-${field}-ot_op`} className="text-sm">
                        OT OP
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${section}-${field}-is`}
                        checked={sectionData[field]?.details?.is || false}
                        onCheckedChange={(checked) => handleFieldDetailChange(section, field, "is", checked)}
                      />
                      <Label htmlFor={`${section}-${field}-is`} className="text-sm">
                        IS
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${section}-${field}-sop`}
                        checked={sectionData[field]?.details?.sop || false}
                        onCheckedChange={(checked) => handleFieldDetailChange(section, field, "sop", checked)}
                      />
                      <Label htmlFor={`${section}-${field}-sop`} className="text-sm">
                        SOP
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${section}-${field}-validation_check`}
                        checked={sectionData[field]?.details?.validation_check || false}
                        onCheckedChange={(checked) =>
                          handleFieldDetailChange(section, field, "validation_check", checked)
                        }
                      />
                      <Label htmlFor={`${section}-${field}-validation_check`} className="text-sm">
                        Validation Check
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${section}-${field}-ok_nok`}>Status</Label>
                  <RadioGroup
                    value={sectionData[field]?.details?.ok_nok || ""}
                    onValueChange={(value) => handleFieldDetailChange(section, field, "ok_nok", value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="OK" id={`${section}-${field}-ok`} />
                      <Label htmlFor={`${section}-${field}-ok`} className="text-sm">
                        OK
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="NOK" id={`${section}-${field}-nok`} />
                      <Label htmlFor={`${section}-${field}-nok`} className="text-sm">
                        NOK
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id={`${section}-${field}-none`} />
                      <Label htmlFor={`${section}-${field}-none`} className="text-sm">
                        Not Set
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${section}-${field}-who`}>Responsible Person</Label>
                  <Input
                    id={`${section}-${field}-who`}
                    value={sectionData[field]?.details?.who || ""}
                    onChange={(e) => handleFieldDetailChange(section, field, "who", e.target.value)}
                    placeholder="Enter name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${section}-${field}-when`}>Date</Label>
                  <Input
                    id={`${section}-${field}-when`}
                    value={sectionData[field]?.details?.when || ""}
                    onChange={(e) => handleFieldDetailChange(section, field, "when", e.target.value)}
                    placeholder="YYYY-MM-DD"
                    type="date"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`${section}-${field}-comment`}>Comments</Label>
                  <Textarea
                    id={`${section}-${field}-comment`}
                    value={sectionData[field]?.details?.comment || ""}
                    onChange={(e) => handleFieldDetailChange(section, field, "comment", e.target.value)}
                    placeholder="Add any additional comments here"
                    rows={3}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/readiness")} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
          <h1 className="text-3xl font-bold">Create Readiness Entry</h1>
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

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="sections">Validation Sections</TabsTrigger>
              <TabsTrigger value="details">Additional Details</TabsTrigger>
              <TabsTrigger value="submit">Review & Submit</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic information for the readiness entry.</CardDescription>
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
                    <Label htmlFor="project_name">Project Name</Label>
                    <Input
                      id="project_name"
                      name="project_name"
                      value={formData.project_name}
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
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="assignedEmail">Assigned Email</Label>
                      <Input
                        id="assignedEmail"
                        name="assignedEmail"
                        type="email"
                        value={formData.assignedEmail}
                        onChange={handleInputChange}
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Validation Sections Tab */}
            <TabsContent value="sections">
              <Card>
                <CardHeader>
                  <CardTitle>Validation Sections</CardTitle>
                  <CardDescription>Configure validation requirements for this readiness entry.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={sectionTab} onValueChange={setSectionTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                      <TabsTrigger value="documentation">Documentation</TabsTrigger>
                      <TabsTrigger value="logistics">Logistics</TabsTrigger>
                      <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                      <TabsTrigger value="packaging">Packaging</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                      <TabsTrigger value="process">Process Status</TabsTrigger>
                      <TabsTrigger value="product">Product Process</TabsTrigger>
                      <TabsTrigger value="production">Production</TabsTrigger>
                      <TabsTrigger value="safety">Safety</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                      <TabsTrigger value="tooling">Tooling Status</TabsTrigger>
                      <TabsTrigger value="training">Training</TabsTrigger>
                    </TabsList>

                    <TabsContent value="documentation">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Documentation</CardTitle>
                          <CardDescription>
                            Configure documentation requirements for this readiness entry.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>{renderSectionFields("Documentation")}</CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="logistics">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Logistics</CardTitle>
                          <CardDescription>Configure logistics requirements for this readiness entry.</CardDescription>
                        </CardHeader>
                        <CardContent>{renderSectionFields("Logistics")}</CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="maintenance">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Maintenance</CardTitle>
                          <CardDescription>
                            Configure maintenance requirements for this readiness entry.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>{renderSectionFields("Maintenance")}</CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="packaging">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Packaging</CardTitle>
                          <CardDescription>Configure packaging requirements for this readiness entry.</CardDescription>
                        </CardHeader>
                        <CardContent>{renderSectionFields("Packaging")}</CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="process">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Process Status Industrials</CardTitle>
                          <CardDescription>
                            Configure process status requirements for this readiness entry.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>{renderSectionFields("ProcessStatusIndustrials")}</CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="product">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Product Process</CardTitle>
                          <CardDescription>
                            Configure product process requirements for this readiness entry.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>{renderSectionFields("ProductProcess")}</CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="production">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Run At Rate Production</CardTitle>
                          <CardDescription>Configure production requirements for this readiness entry.</CardDescription>
                        </CardHeader>
                        <CardContent>{renderSectionFields("RunAtRateProduction")}</CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="safety">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Safety</CardTitle>
                          <CardDescription>Configure safety requirements for this readiness entry.</CardDescription>
                        </CardHeader>
                        <CardContent>{renderSectionFields("Safety")}</CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="suppliers">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Suppliers</CardTitle>
                          <CardDescription>Configure supplier requirements for this readiness entry.</CardDescription>
                        </CardHeader>
                        <CardContent>{renderSectionFields("Supp")}</CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="tooling">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Tooling Status</CardTitle>
                          <CardDescription>Configure tooling requirements for this readiness entry.</CardDescription>
                        </CardHeader>
                        <CardContent>{renderSectionFields("ToolingStatus")}</CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="training">
                      <Card className="border-none shadow-sm">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Training</CardTitle>
                          <CardDescription>Configure training requirements for this readiness entry.</CardDescription>
                        </CardHeader>
                        <CardContent>{renderSectionFields("Training")}</CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Additional Details Tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                  <CardDescription>Add any additional information for this readiness entry.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="additional-notes">Additional Notes</Label>
                    <Textarea
                      id="additional-notes"
                      placeholder="Enter any additional notes or comments here..."
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Review & Submit Tab */}
            <TabsContent value="submit">
              <Card>
                <CardHeader>
                  <CardTitle>Review & Submit</CardTitle>
                  <CardDescription>Review your readiness entry before submission.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="mb-2 text-lg font-medium">Basic Information</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">ID</p>
                        <p>{formData.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p>{formData.status}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Project Name</p>
                        <p>{formData.project_name || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Assigned To</p>
                        <p>{formData.assignedEmail || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="mb-2 text-lg font-medium">Validation Sections Summary</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {Object.keys(fieldDefinitions).map((section) => {
                        const sectionData = getSectionData(section)
                        const totalFields = Object.keys(fieldDefinitions[section]).length
                        const completedFields = Object.values(sectionData).filter((field) => field.value).length
                        const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0

                        return (
                          <div key={section} className="p-3 border rounded-md">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium">{section}</p>
                              <span className="text-sm">{percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div
                                className={`h-2 rounded-full ${
                                  percentage > 70 ? "bg-green-500" : percentage > 30 ? "bg-amber-500" : "bg-red-500"
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                    Back to Edit
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Readiness Entry"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  )
}

export default ReadinessForm

