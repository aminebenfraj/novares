"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getReadinessById, deleteReadiness } from "../../apis/readiness/readinessApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Mail,
  User,
  FileText,
  AlertCircle,
  Info,
  CheckSquare,
  XSquare,
  ChevronRight,
  BarChart3,
  PieChart,
  Layers,
  Shield,
  Package,
  Truck,
  FileTextIcon as FileText2,
  PenToolIcon as Tool,
  Wrench,
  Factory,
  Users,
  GraduationCap,
  Cog,
  CheckIcon,
  XIcon,
  HelpCircle,
  MessageSquare,
} from "lucide-react"
import MainLayout from "@/components/MainLayout"
import { fieldDefinitions } from "../../components/readiness/readinessUtils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// Debug data component
const DebugData = ({ title, data }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-2 overflow-hidden border border-gray-300 border-dashed rounded-md">
      <div
        className="flex items-center justify-between p-2 bg-gray-100 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
        >
          {isOpen ? "Hide" : "Show"}
        </Button>
      </div>
      {isOpen && (
        <div className="p-2 bg-gray-50">
          <pre className="overflow-auto text-xs max-h-60">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

// Validation details component
const ValidationDetails = ({ details }) => {
  if (!details || Object.keys(details).length === 0) {
    return <div className="text-xs italic text-gray-500">No validation details available</div>
  }

  return (
    <div className="mt-2 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <h4 className="mb-1 text-xs font-semibold">Validation Status</h4>
          <div className="flex flex-wrap gap-1">
            {details.validation_check ? (
              <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                Validated
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-600 border-gray-300">
                Not Validated
              </Badge>
            )}

            {details.ok_nok && (
              <Badge
                variant="outline"
                className={
                  details.ok_nok === "OK"
                    ? "text-green-600 border-green-600 bg-green-50"
                    : "text-red-600 border-red-600 bg-red-50"
                }
              >
                {details.ok_nok}
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-1 text-xs font-semibold">Validation Types</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className={`w-3 h-3 rounded-sm mr-1 ${details.tko ? "bg-green-500" : "bg-gray-200"}`}></div>
              <span>TKO</span>
            </div>
            <div className="flex items-center text-xs">
              <div className={`w-3 h-3 rounded-sm mr-1 ${details.ot ? "bg-green-500" : "bg-gray-200"}`}></div>
              <span>OT</span>
            </div>
            <div className="flex items-center text-xs">
              <div className={`w-3 h-3 rounded-sm mr-1 ${details.ot_op ? "bg-green-500" : "bg-gray-200"}`}></div>
              <span>OT OP</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-1 text-xs font-semibold">Additional Checks</h4>
          <div className="space-y-1">
            <div className="flex items-center text-xs">
              <div className={`w-3 h-3 rounded-sm mr-1 ${details.is ? "bg-green-500" : "bg-gray-200"}`}></div>
              <span>IS</span>
            </div>
            <div className="flex items-center text-xs">
              <div className={`w-3 h-3 rounded-sm mr-1 ${details.sop ? "bg-green-500" : "bg-gray-200"}`}></div>
              <span>SOP</span>
            </div>
          </div>
        </div>
      </div>

      {(details.who || details.when) && (
        <div className="pt-2 border-t border-gray-100">
          {details.who && (
            <div className="flex items-center mb-1 text-xs">
              <User className="w-3 h-3 mr-1 text-gray-500" />
              <span className="mr-1 font-semibold">Validated by:</span>
              <span className="text-gray-700">{details.who}</span>
            </div>
          )}

          {details.when && (
            <div className="flex items-center text-xs">
              <Calendar className="w-3 h-3 mr-1 text-gray-500" />
              <span className="mr-1 font-semibold">Date:</span>
              <span className="text-gray-700">{details.when}</span>
            </div>
          )}
        </div>
      )}

      {details.comment && (
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-start text-xs">
            <MessageSquare className="w-3 h-3 mr-1 mt-0.5 text-gray-500" />
            <div>
              <span className="font-semibold">Comment:</span>
              <p className="mt-1 text-gray-700 whitespace-pre-wrap">{details.comment}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ReadinessDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [readiness, setReadiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("general")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [error, setError] = useState(null)
  const [sectionCompletions, setSectionCompletions] = useState({})
  const [dataIssues, setDataIssues] = useState([])
  const [showDebugInfo, setShowDebugInfo] = useState(false)

  // Fetch readiness details
  useEffect(() => {
    const fetchReadinessDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        setDataIssues([])

        console.log(`Fetching readiness details for ID: ${id}`)
        const response = await getReadinessById(id)
        console.log("Raw API response:", response)

        // Check if response exists
        if (!response) {
          console.error("API returned empty response")
          setError("API returned empty response")
          return
        }

        // Handle different response structures
        let data = null
        if (response.data) {
          console.log("Response has data property:", response.data)
          data = response.data
        } else {
          console.log("Response is the data:", response)
          data = response
        }

        // Validate data structure
        const issues = validateReadinessData(data)
        setDataIssues(issues)

        console.log("Setting readiness data:", data)
        setReadiness(data)

        // Calculate section completions
        const completions = {}
        const sections = [
          { name: "Documentation", data: data.Documentation, icon: <FileText2 className="w-5 h-5" /> },
          { name: "Logistics", data: data.Logistics, icon: <Truck className="w-5 h-5" /> },
          { name: "Maintenance", data: data.Maintenance, icon: <Wrench className="w-5 h-5" /> },
          { name: "Packaging", data: data.Packaging, icon: <Package className="w-5 h-5" /> },
          { name: "ProcessStatusIndustrials", data: data.ProcessStatusIndustrials, icon: <Cog className="w-5 h-5" /> },
          { name: "ProductProcess", data: data.ProductProcess, icon: <Layers className="w-5 h-5" /> },
          { name: "RunAtRateProduction", data: data.RunAtRateProduction, icon: <Factory className="w-5 h-5" /> },
          { name: "Safety", data: data.Safety, icon: <Shield className="w-5 h-5" /> },
          { name: "Supp", data: data.Supp, icon: <Users className="w-5 h-5" /> },
          { name: "ToolingStatus", data: data.ToolingStatus, icon: <Tool className="w-5 h-5" /> },
          { name: "Training", data: data.Training, icon: <GraduationCap className="w-5 h-5" /> },
        ]

        sections.forEach((section) => {
          if (section.data) {
            try {
              const completion = calculateSectionCompletion(section.data, fieldDefinitions[section.name] || {})
              completions[section.name] = {
                completion,
                icon: section.icon,
              }
            } catch (err) {
              console.error(`Error calculating completion for ${section.name}:`, err)
              completions[section.name] = {
                completion: 0,
                icon: section.icon,
                error: err.message,
              }
            }
          }
        })

        setSectionCompletions(completions)
      } catch (error) {
        console.error("Error fetching readiness details:", error)

        // Provide a more specific error message based on the error
        let errorMessage = "Failed to fetch readiness details"

        if (error.response?.status === 500) {
          if (error.response.data?.error?.includes("strictPopulate")) {
            errorMessage = "Database schema mismatch. Please contact your administrator."
          } else {
            errorMessage = `Server error: ${error.response.data?.error || error.message}`
          }
        } else if (error.response?.status === 404) {
          errorMessage = "Readiness entry not found."
        } else if (error.message) {
          errorMessage = `Error: ${error.message}`
        }

        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchReadinessDetails()
    }
  }, [id, toast])

  // Handle delete action
  const handleDelete = async () => {
    try {
      await deleteReadiness(id)
      toast({
        title: "Success",
        description: "Readiness entry deleted successfully",
      })
      navigate("/readiness")
    } catch (error) {
      console.error("Error deleting readiness entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete readiness entry",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "on-going":
        return (
          <Badge variant="default" className="bg-blue-500">
            On-going
          </Badge>
        )
      case "stand-by":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Stand-by
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="default" className="bg-green-500">
            Closed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="default" className="bg-red-500">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Validate readiness data structure
  const validateReadinessData = (data) => {
    const issues = []

    // Check required fields
    const requiredFields = ["id", "project_name", "status", "assignedEmail"]
    requiredFields.forEach((field) => {
      if (!data[field]) {
        issues.push(`Missing required field: ${field}`)
      }
    })

    // Check section references
    const sections = [
      "Documentation",
      "Logistics",
      "Maintenance",
      "Packaging",
      "ProcessStatusIndustrials",
      "ProductProcess",
      "RunAtRateProduction",
      "Safety",
      "Supp",
      "ToolingStatus",
      "Training",
    ]

    sections.forEach((section) => {
      if (!data[section]) {
        issues.push(`Missing section: ${section}`)
      } else if (typeof data[section] !== "object") {
        issues.push(`Invalid section data type for: ${section}`)
      }
    })

    // Check if field definitions exist for each section
    sections.forEach((section) => {
      if (!fieldDefinitions[section]) {
        issues.push(`Missing field definitions for section: ${section}`)
      }
    })

    return issues
  }

  // Calculate section completion
  const calculateSectionCompletion = (sectionData, sectionFields) => {
    if (!sectionData) return 0
    if (!sectionFields || Object.keys(sectionFields).length === 0) {
      console.warn(`No field definitions found for section`)
      return 0
    }

    console.log(`Calculating completion for section:`, sectionData)

    const totalFields = Object.keys(sectionFields).length
    let completedFields = 0
    const fieldErrors = []

    Object.keys(sectionFields).forEach((field) => {
      try {
        const fieldData = sectionData[field]

        // Check various ways a field might be marked as completed
        const isCompleted =
          (fieldData && fieldData.value === true) ||
          (typeof fieldData === "boolean" && fieldData === true) ||
          (fieldData && typeof fieldData === "object" && (fieldData.approved === true || fieldData.done === true))

        if (isCompleted) {
          completedFields++
          console.log(`Field ${field} is completed`)
        } else {
          console.log(`Field ${field} is NOT completed:`, fieldData)
        }
      } catch (err) {
        console.error(`Error processing field ${field}:`, err)
        fieldErrors.push(`${field}: ${err.message}`)
      }
    })

    if (fieldErrors.length > 0) {
      console.warn("Field processing errors:", fieldErrors)
    }

    const completion = Math.round((completedFields / totalFields) * 100)
    console.log(`Section completion: ${completion}% (${completedFields}/${totalFields})`)
    return completion
  }

  // Calculate overall completion
  const calculateOverallCompletion = () => {
    if (!readiness) return 0

    const sections = [
      { data: readiness.Documentation, fields: fieldDefinitions.Documentation },
      { data: readiness.Logistics, fields: fieldDefinitions.Logistics },
      { data: readiness.Maintenance, fields: fieldDefinitions.Maintenance },
      { data: readiness.Packaging, fields: fieldDefinitions.Packaging },
      { data: readiness.ProcessStatusIndustrials, fields: fieldDefinitions.ProcessStatusIndustrials },
      { data: readiness.ProductProcess, fields: fieldDefinitions.ProductProcess },
      { data: readiness.RunAtRateProduction, fields: fieldDefinitions.RunAtRateProduction },
      { data: readiness.Safety, fields: fieldDefinitions.Safety },
      { data: readiness.Supp, fields: fieldDefinitions.Supp },
      { data: readiness.ToolingStatus, fields: fieldDefinitions.ToolingStatus },
      { data: readiness.Training, fields: fieldDefinitions.Training },
    ]

    let totalCompletion = 0
    let validSections = 0

    sections.forEach((section) => {
      if (section.data) {
        totalCompletion += calculateSectionCompletion(section.data, section.fields)
        validSections++
      }
    })

    return validSections > 0 ? Math.round(totalCompletion / validSections) : 0
  }

  // Get progress color based on completion percentage
  const getProgressColor = (completion) => {
    if (completion < 30) return "bg-red-500"
    if (completion < 70) return "bg-amber-500"
    return "bg-green-500"
  }

  // Render validation section
  const renderValidationSection = (sectionData, sectionFields, sectionTitle) => {
    if (!sectionData) {
      return (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No {sectionTitle} data available</p>
        </div>
      )
    }

    if (!sectionFields || Object.keys(sectionFields).length === 0) {
      return (
        <div className="py-8 text-center">
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription>No field definitions found for {sectionTitle}</AlertDescription>
          </Alert>
        </div>
      )
    }

    console.log(`Rendering ${sectionTitle} section:`, sectionData)
    console.log(`Fields definition for ${sectionTitle}:`, sectionFields)

    let completion
    try {
      completion = calculateSectionCompletion(sectionData, sectionFields)
    } catch (err) {
      console.error(`Error calculating completion for ${sectionTitle}:`, err)
      completion = 0
    }

    const progressColor = getProgressColor(completion)

    return (
      <div className="space-y-6">
        {showDebugInfo && <DebugData title={`${sectionTitle} Data`} data={sectionData} />}

        <div className="p-4 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Completion Status</span>
            <span className="text-sm font-medium">{completion}%</span>
          </div>
          <Progress value={completion} className={`h-2 ${progressColor}`} />

          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1 bg-green-500 rounded-full"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1 bg-gray-300 rounded-full"></div>
              <span>Pending</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(sectionFields).map((field) => {
            try {
              const fieldData = sectionData[field] || {}

              // Handle different data structures for determining if a field is completed
              let isCompleted = false
              let validationDetails = null

              if (sectionTitle.toLowerCase() === "supp") {
                // Special handling for Supp fields which might have a different structure
                isCompleted =
                  (fieldData && fieldData.value === true) || (typeof fieldData === "boolean" && fieldData === true)

                // Get validation details from the details field
                validationDetails = fieldData.details || null
              } else {
                // Standard handling for other sections
                isCompleted =
                  (fieldData && fieldData.value === true) ||
                  (typeof fieldData === "boolean" && fieldData === true) ||
                  (fieldData &&
                    typeof fieldData === "object" &&
                    (fieldData.approved === true || fieldData.done === true))

                // For other sections, validation details might be directly in the field data
                validationDetails = fieldData.details || null
              }

              // Check if we have validation details
              const hasValidationDetails = validationDetails && Object.keys(validationDetails).length > 0

              return (
                <Collapsible
                  key={field}
                  className={`border rounded-lg transition-all duration-300 hover:shadow-md ${
                    isCompleted ? "border-green-200 bg-green-50" : "border-gray-200"
                  }`}
                >
                  <div className="p-4">
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                      <div className="flex items-center">
                        {isCompleted ? (
                          <CheckCircle2 className="flex-shrink-0 w-4 h-4 mr-2 text-green-500" />
                        ) : (
                          <XCircle className="flex-shrink-0 w-4 h-4 mr-2 text-gray-400" />
                        )}
                        <span className="text-sm font-medium">{sectionFields[field]}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </CollapsibleTrigger>

                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span className="mr-1 font-medium">Status:</span>
                      {isCompleted ? (
                        <span className="flex items-center text-green-600">
                          <CheckIcon className="w-3 h-3 mr-1" /> Completed
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500">
                          <XIcon className="w-3 h-3 mr-1" /> Pending
                        </span>
                      )}

                      {hasValidationDetails && (
                        <Badge variant="outline" className="ml-2 text-blue-600 border-blue-200 bg-blue-50">
                          Validation Details
                        </Badge>
                      )}
                    </div>

                    <CollapsibleContent className="pt-3 mt-3 border-t border-gray-100">
                      {showDebugInfo && (
                        <div className="p-2 mb-3 text-xs bg-gray-100 rounded">
                          <pre className="overflow-auto max-h-20">{JSON.stringify(fieldData, null, 2)}</pre>
                        </div>
                      )}

                      {hasValidationDetails ? (
                        <ValidationDetails details={validationDetails} />
                      ) : (
                        <div className="flex items-center text-xs text-gray-500">
                          <HelpCircle className="w-3 h-3 mr-1" />
                          <span>No validation details available for this field</span>
                        </div>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )
            } catch (err) {
              console.error(`Error rendering field ${field}:`, err)
              return (
                <Card key={field} className="border-red-200 bg-red-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-sm font-medium">
                      <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                      {sectionFields[field] || field}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-xs text-red-600">Error rendering field: {err.message}</CardContent>
                </Card>
              )
            }
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-6 mx-auto">
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
            <span className="text-lg">Loading readiness details...</span>
            <p className="mt-2 text-sm text-gray-500">This may take a moment</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container py-6 mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-12 h-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">Could not load readiness entry</h3>
            <p className="mt-1 mb-4 text-muted-foreground">There was a problem loading this readiness entry</p>
            <Button onClick={() => navigate("/readiness")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Readiness List
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!readiness) {
    return (
      <MainLayout>
        <div className="container py-6 mx-auto">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-12 h-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">Readiness entry not found</h3>
            <p className="mt-1 mb-4 text-muted-foreground">
              The readiness entry you're looking for doesn't exist or has been deleted
            </p>
            <Button onClick={() => navigate("/readiness")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Readiness List
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const overallCompletion = calculateOverallCompletion()
  const progressColor = getProgressColor(overallCompletion)

  return (
    <MainLayout>
      <motion.div className="container py-6 mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        {/* Header Section */}
        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/readiness")} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="flex items-center text-2xl font-bold">
                {readiness.project_name}
                <span className="ml-3">{getStatusBadge(readiness.status)}</span>
              </h1>
              <p className="text-muted-foreground">ID: {readiness.id}</p>
            </div>
          </div>
          <div className="flex mt-4 space-x-2 md:mt-0">
            <Button variant="outline" onClick={() => navigate(`/readiness/${id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {dataIssues.length > 0 && (
          <Alert variant="warning" className="mb-6 bg-amber-50 border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Data Validation Issues</AlertTitle>
            <AlertDescription>
              <ul className="pl-5 mt-2 text-sm list-disc">
                {dataIssues.map((issue, index) => (
                  <li key={index} className="text-amber-700">
                    {issue}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={() => setShowDebugInfo(!showDebugInfo)} className="text-xs">
            {showDebugInfo ? "Hide Debug Info" : "Show Debug Info"}
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 bg-gray-50">
              <CardTitle className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                Assigned To
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="font-medium">{readiness.assignedEmail || "N/A"}</p>
              <p className="mt-1 text-xs text-gray-500">{readiness.assignedRole || "No role specified"}</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2 bg-gray-50">
              <CardTitle className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-green-500" />
                Created
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="font-medium">{formatDate(readiness.createdAt)}</p>
              <p className="mt-1 text-xs text-gray-500">Creation date</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2 bg-gray-50">
              <CardTitle className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-amber-500" />
                Last Updated
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="font-medium">{formatDate(readiness.updatedAt)}</p>
              <p className="mt-1 text-xs text-gray-500">Last modification</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2 bg-gray-50">
              <CardTitle className="flex items-center text-sm">
                <BarChart3 className="w-4 h-4 mr-2 text-purple-500" />
                Overall Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{overallCompletion}%</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average completion across all sections</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Progress value={overallCompletion} className={`h-2 ${progressColor}`} />
            </CardContent>
          </Card>
        </div>

        {showDebugInfo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Debug Information
              </CardTitle>
              <CardDescription>Raw data for troubleshooting</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                  <TabsTrigger value="completions">Completions</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <DebugData
                    title="Readiness Data"
                    data={{
                      id: readiness.id,
                      project_name: readiness.project_name,
                      status: readiness.status,
                      assignedEmail: readiness.assignedEmail,
                      createdAt: readiness.createdAt,
                      updatedAt: readiness.updatedAt,
                    }}
                  />
                </TabsContent>
                <TabsContent value="sections">
                  <div className="space-y-2">
                    {[
                      "Documentation",
                      "Logistics",
                      "Maintenance",
                      "Packaging",
                      "ProcessStatusIndustrials",
                      "ProductProcess",
                      "RunAtRateProduction",
                      "Safety",
                      "Supp",
                      "ToolingStatus",
                      "Training",
                    ].map((section) => (
                      <div key={section}>
                        <h3 className="mb-1 text-sm font-medium">{section}</h3>
                        {readiness[section] ? (
                          <DebugData title={`${section} Data`} data={readiness[section]} />
                        ) : (
                          <div className="p-2 text-sm text-red-600 rounded bg-red-50">No data available</div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="completions">
                  <DebugData title="Section Completions" data={sectionCompletions} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Section Completion Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Section Completion Overview
            </CardTitle>
            <CardDescription>Progress across all readiness sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(sectionCompletions).map(([section, data]) => (
                <div
                  key={section}
                  className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${
                    data.completion === 100
                      ? "border-green-200 bg-green-50"
                      : data.completion > 0
                        ? "border-amber-200 bg-amber-50"
                        : "border-gray-200"
                  }`}
                  onClick={() => setActiveTab(section.toLowerCase())}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {data.icon}
                      <span className="ml-2 font-medium">{section}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{data.completion}% Complete</span>
                    {data.completion === 100 ? (
                      <CheckSquare className="w-4 h-4 text-green-500" />
                    ) : data.completion > 0 ? (
                      <Clock className="w-4 h-4 text-amber-500" />
                    ) : (
                      <XSquare className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <Progress value={data.completion} className={`h-2 ${getProgressColor(data.completion)}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        {readiness.description && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Project Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{readiness.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="flex flex-wrap mb-6 bg-gray-100">
            <TabsTrigger value="general" className="flex-grow data-[state=active]:bg-white">
              General
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex-grow data-[state=active]:bg-white">
              Documentation
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex-grow data-[state=active]:bg-white">
              Logistics
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex-grow data-[state=active]:bg-white">
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="packaging" className="flex-grow data-[state=active]:bg-white">
              Packaging
            </TabsTrigger>
            <TabsTrigger value="processstatus" className="flex-grow data-[state=active]:bg-white">
              Process Status
            </TabsTrigger>
            <TabsTrigger value="productprocess" className="flex-grow data-[state=active]:bg-white">
              Product Process
            </TabsTrigger>
            <TabsTrigger value="production" className="flex-grow data-[state=active]:bg-white">
              Production
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex-grow data-[state=active]:bg-white">
              Safety
            </TabsTrigger>
            <TabsTrigger value="supp" className="flex-grow data-[state=active]:bg-white">
              Supp
            </TabsTrigger>
            <TabsTrigger value="tooling" className="flex-grow data-[state=active]:bg-white">
              Tooling Status
            </TabsTrigger>
            <TabsTrigger value="training" className="flex-grow data-[state=active]:bg-white">
              Training
            </TabsTrigger>
          </TabsList>

          <motion.div key={activeTab} initial="hidden" animate="visible" variants={slideUp} exit={{ opacity: 0 }}>
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    General Information
                  </CardTitle>
                  <CardDescription>Basic information about this readiness entry</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {readiness.description ? (
                    <div className="space-y-2">
                      <h3 className="font-medium">Description</h3>
                      <p className="text-muted-foreground">{readiness.description}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No description provided</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentation">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText2 className="w-5 h-5 mr-2" />
                    Documentation
                  </CardTitle>
                  <CardDescription>Documentation requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Documentation, fieldDefinitions.Documentation, "documentation")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logistics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Logistics
                  </CardTitle>
                  <CardDescription>Logistics requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Logistics, fieldDefinitions.Logistics, "logistics")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Maintenance
                  </CardTitle>
                  <CardDescription>Maintenance requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Maintenance, fieldDefinitions.Maintenance, "maintenance")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="packaging">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Packaging
                  </CardTitle>
                  <CardDescription>Packaging requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Packaging, fieldDefinitions.Packaging, "packaging")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processstatus">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cog className="w-5 h-5 mr-2" />
                    Process Status Industrials
                  </CardTitle>
                  <CardDescription>Process status requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(
                    readiness.ProcessStatusIndustrials,
                    fieldDefinitions.ProcessStatusIndustrials,
                    "process status",
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="productprocess">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="w-5 h-5 mr-2" />
                    Product Process
                  </CardTitle>
                  <CardDescription>Product process requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(
                    readiness.ProductProcess,
                    fieldDefinitions.ProductProcess,
                    "product process",
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="production">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Factory className="w-5 h-5 mr-2" />
                    Run At Rate Production
                  </CardTitle>
                  <CardDescription>Production requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(
                    readiness.RunAtRateProduction,
                    fieldDefinitions.RunAtRateProduction,
                    "production",
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Safety
                  </CardTitle>
                  <CardDescription>Safety requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Safety, fieldDefinitions.Safety, "safety")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="supp">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Supp
                  </CardTitle>
                  <CardDescription>Supp requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>{renderValidationSection(readiness.Supp, fieldDefinitions.Supp, "supp")}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tooling">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tool className="w-5 h-5 mr-2" />
                    Tooling Status
                  </CardTitle>
                  <CardDescription>Tooling requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.ToolingStatus, fieldDefinitions.ToolingStatus, "tooling status")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="training">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Training
                  </CardTitle>
                  <CardDescription>Training requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Training, fieldDefinitions.Training, "training")}
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the readiness entry
                <span className="font-semibold"> {readiness.project_name}</span>. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </MainLayout>
  )
}

export default ReadinessDetails

