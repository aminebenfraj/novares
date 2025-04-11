"use client"

import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Loader2,
  Save,
  ArrowLeft,
  CheckCircle,
  XCircle,
  PenToolIcon as Tool,
  AlertTriangle,
  Info,
  Calendar,
  User,
  MessageSquare,
  Check,
  Wrench,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  getToolingStatusById,
  updateToolingStatus,
  createToolingStatus,
} from "../../../apis/readiness/toolingStatusApi"
import { getAllReadiness } from "../../../apis/readiness/readinessApi"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import MainLayout from "@/components/MainLayout"

// Define the field labels and descriptions for better UI
const fieldConfig = {
  manufacturedPartsAtLastRelease: {
    label: "Manufactured Parts At Last Release",
    description: "Parts manufactured according to the last release specifications",
    icon: <Tool className="w-5 h-5 text-blue-500" />,
  },
  specificationsConformity: {
    label: "Specifications Conformity",
    description: "Parts conform to specifications",
    icon: <Check className="w-5 h-5 text-blue-500" />,
  },
  partsGrainedAndValidated: {
    label: "Parts Grained And Validated",
    description: "Parts have been grained and validated",
    icon: <Check className="w-5 h-5 text-blue-500" />,
  },
  noBreakOrIncidentDuringInjectionTrials: {
    label: "No Break During Injection Trials",
    description: "No breaks or incidents occurred during injection trials",
    icon: <Check className="w-5 h-5 text-blue-500" />,
  },
  toolsAccepted: {
    label: "Tools Accepted",
    description: "Tools have been accepted",
    icon: <Wrench className="w-5 h-5 text-blue-500" />,
  },
  preSerialInjectionParametersDefined: {
    label: "Pre-Serial Injection Parameters",
    description: "Pre-serial injection parameters have been defined",
    icon: <Settings className="w-5 h-5 text-blue-500" />,
  },
  serialProductionInjectionParametersDefined: {
    label: "Serial Production Parameters",
    description: "Serial production injection parameters have been defined",
    icon: <Settings className="w-5 h-5 text-blue-500" />,
  },
  incompletePartsProduced: {
    label: "Incomplete Parts Produced",
    description: "Incomplete parts have been produced",
    icon: <Tool className="w-5 h-5 text-blue-500" />,
  },
  toolmakerIssuesEradicated: {
    label: "Toolmaker Issues Eradicated",
    description: "All toolmaker issues have been eradicated",
    icon: <Wrench className="w-5 h-5 text-blue-500" />,
  },
  checkingFixturesAvailable: {
    label: "Checking Fixtures Available",
    description: "Checking fixtures are available",
    icon: <Tool className="w-5 h-5 text-blue-500" />,
  },
}

// Define the validation field labels
const validationFieldLabels = {
  tko: "TKO",
  ot: "OT",
  ot_op: "OT OP",
  is: "IS",
  sop: "SOP",
  ok_nok: "Status",
  who: "Responsible Person",
  when: "Date",
  validation_check: "Validation Check",
  comment: "Comments",
}

function EditToolingStatusPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("manufacturedPartsAtLastRelease")
  const [toolingStatus, setToolingStatus] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [navigationPath, setNavigationPath] = useState("")
  const isNewRecord = params.id === "new"

  const [readinessId, setReadinessId] = useState(null)

  useEffect(() => {
    // Get the readinessId from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search)
    const id = queryParams.get("readinessId")
    console.log("Extracted readinessId from URL:", id)
    setReadinessId(id)
  }, [])

  // Initialize new tooling status record
  const initializeNewToolingStatus = () => {
    const newToolingStatus = {
      createdAt: new Date(),
    }

    // Initialize each field with default values
    Object.keys(fieldConfig).forEach((field) => {
      newToolingStatus[field] = {
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

    return newToolingStatus
  }

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!toolingStatus) return 0

    const fields = Object.keys(fieldConfig)
    const completedFields = fields.filter((field) => toolingStatus[field]?.value === true)
    return Math.round((completedFields.length / fields.length) * 100)
  }

  // Fetch tooling status data or initialize new record
  useEffect(() => {
    const fetchToolingStatus = async () => {
      try {
        setIsLoading(true)
        if (isNewRecord) {
          setToolingStatus(initializeNewToolingStatus())
        } else {
          const data = await getToolingStatusById(params.id)
          setToolingStatus(data)

          // Extract readinessId from the tooling status object
          console.log("Tooling status data:", data)

          // Check for possible readiness reference fields
          if (data._readinessId) {
            console.log("Found readinessId in _readinessId:", data._readinessId)
            setReadinessId(data._readinessId)
          } else if (data.readinessId) {
            console.log("Found readinessId in readinessId:", data.readinessId)
            setReadinessId(data.readinessId)
          } else if (data.readiness) {
            const readinessRef = typeof data.readiness === "object" ? data.readiness._id : data.readiness
            console.log("Found readinessId in readiness:", readinessRef)
            setReadinessId(readinessRef)
          }
        }
      } catch (error) {
        console.error("Error fetching tooling status record:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tooling status data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchToolingStatus()
  }, [params.id, toast, isNewRecord])

  // Handle navigation with unsaved changes check
  const handleNavigation = (path) => {
    if (hasChanges) {
      setNavigationPath(path)
      setShowUnsavedDialog(true)
    } else {
      if (readinessId) {
        navigate(`/readiness/detail/${readinessId}`)
      } else {
        // If no readinessId is available, try to find it from all readiness entries
        getAllReadiness()
          .then((readinessEntries) => {
            const readinessEntry = readinessEntries.find(
              (entry) =>
                entry.ToolingStatus === params.id || (entry.ToolingStatus && entry.ToolingStatus._id === params.id),
            )
            if (readinessEntry) {
              console.log("Found matching readiness entry:", readinessEntry._id)
              navigate(`/readiness/detail/${readinessEntry._id}`)
            } else {
              navigate(path)
            }
          })
          .catch((error) => {
            console.error("Error finding readiness entry:", error)
            navigate(path)
          })
      }
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isNewRecord) {
        const newRecord = await createToolingStatus(toolingStatus)
        toast({
          title: "Success",
          description: "Tooling status record created successfully",
          variant: "success",
        })

        // If we have a readinessId from URL params, use it for navigation
        if (params.readinessId) {
          navigate(`/readiness/detail/${params.readinessId}`)
        }
        // Otherwise use the readinessId from the new record
        else if (newRecord && newRecord.data) {
          const newId = newRecord.data._id
          // Extract the readiness ID from the record ID if possible
          const extractedReadinessId = newId.split("-")[0]
          navigate(`/readiness/detail/${extractedReadinessId}`)
        }
        // Fallback to tooling status list
        else {
          navigate("/tooling-status")
        }
      } else {
        await updateToolingStatus(params.id, toolingStatus)
        toast({
          title: "Success",
          description: "Tooling status record updated successfully",
          variant: "success",
        })

        // Navigate back to readiness details page if readinessId is available
        if (readinessId) {
          console.log("Navigating to readiness detail:", readinessId)
          navigate(`/readiness/detail/${readinessId}`)
        } else {
          // If we couldn't extract the readinessId, try to get it from the API response
          try {
            // Make an API call to get all readiness entries
            const readinessEntries = await getAllReadiness()

            // Find the readiness entry that references this tooling status
            const readinessEntry = readinessEntries.find(
              (entry) =>
                entry.ToolingStatus === params.id || (entry.ToolingStatus && entry.ToolingStatus._id === params.id),
            )

            if (readinessEntry) {
              console.log("Found readiness entry:", readinessEntry)
              navigate(`/readiness/detail/${readinessEntry._id}`)
              return
            }
          } catch (error) {
            console.error("Error finding readiness entry:", error)
          }

          // Fallback to tooling status details page if readinessId is not available
          console.log("No readinessId found, navigating to tooling status detail")
          navigate(`/tooling-status/${params.id}`)
        }
      }

      setHasChanges(false)
    } catch (error) {
      console.error("Error saving tooling status record:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isNewRecord ? "create" : "update"} tooling status record`,
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle field value change
  const handleValueChange = (field, value) => {
    setToolingStatus((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
      },
    }))
    setHasChanges(true)
  }

  // Handle validation field change
  const handleValidationChange = (field, validationField, value) => {
    setToolingStatus((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        details: {
          ...prev[field].details,
          [validationField]: value,
        },
      },
    }))
    setHasChanges(true)
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="w-48 h-8 mb-2" />
                <Skeleton className="w-64 h-4" />
              </div>
            </div>
            <Skeleton className="w-32 h-10" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Skeleton className="h-[400px] md:col-span-1" />
            <Skeleton className="h-[600px] md:col-span-3" />
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!toolingStatus) {
    return (
      <MainLayout>
        <div className="container px-4 py-8 mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
              <CardDescription>Tooling status record not found</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/tooling-status")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tooling Status Records
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    )
  }

  const completionPercentage = calculateCompletion()

  return (
    <MainLayout>
      <div className="container px-4 py-8 mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleNavigation("/tooling-status")}
                className="transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="inline-flex items-center"
                  >
                    <Tool className="mr-2 text-blue-500 w-7 h-7" />
                    {isNewRecord ? "Create Tooling Status" : "Edit Tooling Status"}
                  </motion.span>
                </h1>
                <p className="text-muted-foreground">
                  {isNewRecord
                    ? "Create a new tooling status record"
                    : "Update tooling status details and validation information"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center px-3 py-1 text-sm rounded-md text-amber-700 bg-amber-50"
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Unsaved changes
                </motion.div>
              )}
              <Button onClick={handleSubmit} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isNewRecord ? "Creating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> {isNewRecord ? "Create Record" : "Save Changes"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {!isNewRecord && (
            <div className="mb-6">
              <Card className="border-none shadow-none bg-slate-50">
                <CardContent className="p-4">
                  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <Tool className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Tooling Status Record</h3>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(toolingStatus.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-1 md:items-end">
                      <Badge
                        variant={completionPercentage === 100 ? "default" : "outline"}
                        className={completionPercentage === 100 ? "bg-blue-500 hover:bg-blue-600" : ""}
                      >
                        {completionPercentage}% Complete
                      </Badge>
                      <div className="w-full md:w-[200px]">
                        <Progress
                          value={completionPercentage}
                          className="h-2"
                          indicatorClassName={
                            completionPercentage === 100
                              ? "bg-blue-500"
                              : completionPercentage > 50
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Tooling Status Fields</CardTitle>
                  <CardDescription>Select a field to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto">
                      {Object.keys(fieldConfig).map((field) => (
                        <TabsTrigger
                          key={field}
                          value={field}
                          className="relative justify-start mb-1 text-left pl-9 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                        >
                          <span className="absolute left-2">
                            {toolingStatus[field]?.value ? (
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </span>
                          <span className="flex items-center">
                            {fieldConfig[field].icon}
                            <span className="ml-2 truncate">{fieldConfig[field].label}</span>
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {fieldConfig[activeTab].icon}
                    <span className="ml-2">{fieldConfig[activeTab].label}</span>
                  </CardTitle>
                  <CardDescription>{fieldConfig[activeTab].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="status" className="w-full">
                    <TabsList className="border border-blue-100 bg-blue-50">
                      <TabsTrigger
                        value="status"
                        className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                      >
                        Status
                      </TabsTrigger>
                      <TabsTrigger
                        value="validation"
                        className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                      >
                        Validation Details
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="status" className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeTab}-value`}
                          checked={toolingStatus[activeTab]?.value || false}
                          onCheckedChange={(checked) => handleValueChange(activeTab, checked === true)}
                          className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <Label htmlFor={`${activeTab}-value`} className="font-medium">
                          Mark as completed
                        </Label>
                      </div>
                    </TabsContent>
                    <TabsContent value="validation" className="pt-4 space-y-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <Accordion type="single" collapsible defaultValue="item-1">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-blue-700">Validation Checkpoints</AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <TooltipProvider>
                                  <div className="space-y-2">
                                    <Label htmlFor={`${activeTab}-tko`} className="flex items-center">
                                      TKO
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="w-4 h-4 ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Technical Knock Out validation</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${activeTab}-tko`}
                                        checked={toolingStatus[activeTab]?.details?.tko || false}
                                        onCheckedChange={(checked) =>
                                          handleValidationChange(activeTab, "tko", checked === true)
                                        }
                                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                      />
                                      <Label htmlFor={`${activeTab}-tko`}>Completed</Label>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`${activeTab}-ot`} className="flex items-center">
                                      OT
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="w-4 h-4 ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Operational Test validation</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${activeTab}-ot`}
                                        checked={toolingStatus[activeTab]?.details?.ot || false}
                                        onCheckedChange={(checked) =>
                                          handleValidationChange(activeTab, "ot", checked === true)
                                        }
                                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                      />
                                      <Label htmlFor={`${activeTab}-ot`}>Completed</Label>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`${activeTab}-ot_op`} className="flex items-center">
                                      OT OP
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="w-4 h-4 ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Operational Test Operator validation</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${activeTab}-ot_op`}
                                        checked={toolingStatus[activeTab]?.details?.ot_op || false}
                                        onCheckedChange={(checked) =>
                                          handleValidationChange(activeTab, "ot_op", checked === true)
                                        }
                                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                      />
                                      <Label htmlFor={`${activeTab}-ot_op`}>Completed</Label>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`${activeTab}-is`} className="flex items-center">
                                      IS
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="w-4 h-4 ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Inspection Standard validation</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${activeTab}-is`}
                                        checked={toolingStatus[activeTab]?.details?.is || false}
                                        onCheckedChange={(checked) =>
                                          handleValidationChange(activeTab, "is", checked === true)
                                        }
                                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                      />
                                      <Label htmlFor={`${activeTab}-is`}>Completed</Label>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`${activeTab}-sop`} className="flex items-center">
                                      SOP
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="w-4 h-4 ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Standard Operating Procedure validation</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${activeTab}-sop`}
                                        checked={toolingStatus[activeTab]?.details?.sop || false}
                                        onCheckedChange={(checked) =>
                                          handleValidationChange(activeTab, "sop", checked === true)
                                        }
                                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                      />
                                      <Label htmlFor={`${activeTab}-sop`}>Completed</Label>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`${activeTab}-validation_check`} className="flex items-center">
                                      Validation Check
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="w-4 h-4 ml-1 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Final validation check</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${activeTab}-validation_check`}
                                        checked={toolingStatus[activeTab]?.details?.validation_check || false}
                                        onCheckedChange={(checked) =>
                                          handleValidationChange(activeTab, "validation_check", checked === true)
                                        }
                                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                      />
                                      <Label htmlFor={`${activeTab}-validation_check`}>Completed</Label>
                                    </div>
                                  </div>
                                </TooltipProvider>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <Separator className="bg-blue-100" />

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-ok_nok`}>Status</Label>
                            <RadioGroup
                              value={toolingStatus[activeTab]?.details?.ok_nok || ""}
                              onValueChange={(value) => handleValidationChange(activeTab, "ok_nok", value)}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="OK"
                                  id={`${activeTab}-ok`}
                                  className="text-blue-500 border-blue-500 data-[state=checked]:bg-blue-500"
                                />
                                <Label htmlFor={`${activeTab}-ok`}>OK</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="NOK"
                                  id={`${activeTab}-nok`}
                                  className="text-red-500 border-red-500 data-[state=checked]:bg-red-500"
                                />
                                <Label htmlFor={`${activeTab}-nok`}>NOK</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="" id={`${activeTab}-none`} />
                                <Label htmlFor={`${activeTab}-none`}>Not Set</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`${activeTab}-who`} className="flex items-center">
                                <User className="w-4 h-4 mr-1 text-muted-foreground" />
                                Responsible Person
                              </Label>
                              <Input
                                id={`${activeTab}-who`}
                                value={toolingStatus[activeTab]?.details?.who || ""}
                                onChange={(e) => handleValidationChange(activeTab, "who", e.target.value)}
                                placeholder="Enter name"
                                className="border-blue-100 focus-visible:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`${activeTab}-when`} className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                                Date
                              </Label>
                              <Input
                                id={`${activeTab}-when`}
                                value={toolingStatus[activeTab]?.details?.when || ""}
                                onChange={(e) => handleValidationChange(activeTab, "when", e.target.value)}
                                placeholder="YYYY-MM-DD"
                                className="border-blue-100 focus-visible:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-comment`} className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1 text-muted-foreground" />
                              Comments
                            </Label>
                            <Textarea
                              id={`${activeTab}-comment`}
                              value={toolingStatus[activeTab]?.details?.comment || ""}
                              onChange={(e) => handleValidationChange(activeTab, "comment", e.target.value)}
                              placeholder="Add any additional comments here"
                              rows={4}
                              className="border-blue-100 focus-visible:ring-blue-500"
                            />
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigation("/tooling-status")}
                    className="text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {isNewRecord ? "Creating..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" /> {isNewRecord ? "Create Record" : "Save Changes"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </motion.div>

        {/* Unsaved changes dialog */}
        <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setHasChanges(false)
                  if (readinessId) {
                    navigate(`/readiness/detail/${readinessId}`)
                  } else {
                    // If no readinessId is available, try to find it from all readiness entries
                    getAllReadiness()
                      .then((readinessEntries) => {
                        const readinessEntry = readinessEntries.find(
                          (entry) =>
                            entry.ToolingStatus === params.id ||
                            (entry.ToolingStatus && entry.ToolingStatus._id === params.id),
                        )
                        if (readinessEntry) {
                          console.log("Found matching readiness entry:", readinessEntry._id)
                          navigate(`/readiness/detail/${readinessEntry._id}`)
                        } else {
                          navigate(navigationPath)
                        }
                      })
                      .catch((error) => {
                        console.error("Error finding readiness entry:", error)
                        navigate(navigationPath)
                      })
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Leave Page
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  )
}

export default EditToolingStatusPage
