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
  GraduationCap,
  AlertTriangle,
  Info,
  Calendar,
  User,
  MessageSquare,
  BookOpen,
  Award,
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
import { getTrainingById, updateTraining, createTraining } from "../../../apis/readiness/trainingApi"
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
import MainLayout from "@/components/MainLayout"

// Define the field labels and descriptions for better UI
const fieldConfig = {
  visualControlQualification: {
    label: "Visual Control Qualification",
    description: "Operator qualification for visual control",
    icon: <Award className="w-5 h-5 text-purple-500" />,
  },
  dojoTrainingCompleted: {
    label: "Dojo Training Completed",
    description: "DOJO training completed for all relevant personnel",
    icon: <BookOpen className="w-5 h-5 text-purple-500" />,
  },
  trainingPlanDefined: {
    label: "Training Plan Defined",
    description: "Training plan for product/process defined per ramp-up",
    icon: <GraduationCap className="w-5 h-5 text-purple-500" />,
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

function EditTrainingPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("visualControlQualification")
  const [training, setTraining] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [navigationPath, setNavigationPath] = useState("")
  const isNewRecord = params.id === "new"
  const [readinessId, setReadinessId] = useState(null)

  // Initialize new training record
  const initializeNewTraining = () => {
    const newTraining = {
      createdAt: new Date(),
    }

    // Initialize each field with default values
    Object.keys(fieldConfig).forEach((field) => {
      newTraining[field] = {
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

    return newTraining
  }

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!training) return 0

    const fields = Object.keys(fieldConfig)
    const completedFields = fields.filter((field) => training[field]?.value === true)
    return Math.round((completedFields.length / fields.length) * 100)
  }

  // Add useEffect to extract readinessId from URL query parameters
  useEffect(() => {
    // Get the readinessId from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search)
    const id = queryParams.get("readinessId")
    console.log("Extracted readinessId from URL:", id)
    setReadinessId(id)
  }, [])

  // Fetch training data or initialize new record
  useEffect(() => {
    const fetchTraining = async () => {
      try {
        setIsLoading(true)
        if (isNewRecord) {
          setTraining(initializeNewTraining())
        } else {
          const data = await getTrainingById(params.id)
          setTraining(data)

          // Extract readinessId from the training object
          console.log("Training data:", data)

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
        console.error("Error fetching training record:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load training data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTraining()
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
              (entry) => entry.Training === params.id || (entry.Training && entry.Training._id === params.id),
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
        const newRecord = await createTraining(training)
        toast({
          title: "Success",
          description: "Training record created successfully",
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
        // Fallback to training list
        else {
          navigate("/training")
        }
      } else {
        await updateTraining(params.id, training)
        toast({
          title: "Success",
          description: "Training record updated successfully",
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

            // Find the readiness entry that references this training record
            const readinessEntry = readinessEntries.find(
              (entry) => entry.Training === params.id || (entry.Training && entry.Training._id === params.id),
            )

            if (readinessEntry) {
              console.log("Found readiness entry:", readinessEntry)
              navigate(`/readiness/detail/${readinessEntry._id}`)
              return
            }
          } catch (error) {
            console.error("Error finding readiness entry:", error)
          }

          // Fallback to training details page if readinessId is not available
          console.log("No readinessId found, navigating to training detail")
          navigate(`/training/${params.id}`)
        }
      }

      setHasChanges(false)
    } catch (error) {
      console.error("Error saving training record:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isNewRecord ? "create" : "update"} training record`,
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle field value change
  const handleValueChange = (field, value) => {
    setTraining((prev) => ({
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
    setTraining((prev) => ({
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

  if (!training) {
    return (
      <MainLayout>
        <div className="container px-4 py-8 mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
              <CardDescription>Training record not found</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/training")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Training Records
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
                onClick={() => handleNavigation("/training")}
                className="transition-all hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
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
                    <GraduationCap className="mr-2 text-purple-500 w-7 h-7" />
                    {isNewRecord ? "Create Training Record" : "Edit Training Record"}
                  </motion.span>
                </h1>
                <p className="text-muted-foreground">
                  {isNewRecord
                    ? "Create a new training record"
                    : "Update training qualification details and validation information"}
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
              <Button onClick={handleSubmit} disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
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
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                        <GraduationCap className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Training Record</h3>
                        <p className="text-sm text-muted-foreground">
                          Created: {new Date(training.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-1 md:items-end">
                      <Badge
                        variant={completionPercentage === 100 ? "default" : "outline"}
                        className={completionPercentage === 100 ? "bg-purple-500 hover:bg-purple-600" : ""}
                      >
                        {completionPercentage}% Complete
                      </Badge>
                      <div className="w-full md:w-[200px]">
                        <Progress
                          value={completionPercentage}
                          className="h-2"
                          indicatorClassName={
                            completionPercentage === 100
                              ? "bg-purple-500"
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
                  <CardTitle>Training Fields</CardTitle>
                  <CardDescription>Select a field to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto">
                      {Object.keys(fieldConfig).map((field) => (
                        <TabsTrigger
                          key={field}
                          value={field}
                          className="relative justify-start mb-1 text-left pl-9 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
                        >
                          <span className="absolute left-2">
                            {training[field]?.value ? (
                              <CheckCircle className="w-4 h-4 text-purple-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </span>
                          <span className="flex items-center">
                            {fieldConfig[field].icon}
                            <span className="ml-2">{fieldConfig[field].label}</span>
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
                    <TabsList className="border border-purple-100 bg-purple-50">
                      <TabsTrigger
                        value="status"
                        className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                      >
                        Status
                      </TabsTrigger>
                      <TabsTrigger
                        value="validation"
                        className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                      >
                        Validation Details
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="status" className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeTab}-value`}
                          checked={training[activeTab]?.value || false}
                          onCheckedChange={(checked) => handleValueChange(activeTab, checked === true)}
                          className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
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
                                  checked={training[activeTab]?.details?.tko || false}
                                  onCheckedChange={(checked) =>
                                    handleValidationChange(activeTab, "tko", checked === true)
                                  }
                                  className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
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
                                  checked={training[activeTab]?.details?.ot || false}
                                  onCheckedChange={(checked) =>
                                    handleValidationChange(activeTab, "ot", checked === true)
                                  }
                                  className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
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
                                  checked={training[activeTab]?.details?.ot_op || false}
                                  onCheckedChange={(checked) =>
                                    handleValidationChange(activeTab, "ot_op", checked === true)
                                  }
                                  className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
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
                                  checked={training[activeTab]?.details?.is || false}
                                  onCheckedChange={(checked) =>
                                    handleValidationChange(activeTab, "is", checked === true)
                                  }
                                  className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
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
                                  checked={training[activeTab]?.details?.sop || false}
                                  onCheckedChange={(checked) =>
                                    handleValidationChange(activeTab, "sop", checked === true)
                                  }
                                  className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
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
                                  checked={training[activeTab]?.details?.validation_check || false}
                                  onCheckedChange={(checked) =>
                                    handleValidationChange(activeTab, "validation_check", checked === true)
                                  }
                                  className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                />
                                <Label htmlFor={`${activeTab}-validation_check`}>Completed</Label>
                              </div>
                            </div>
                          </TooltipProvider>
                        </div>

                        <Separator className="bg-purple-100" />

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-ok_nok`}>Status</Label>
                            <RadioGroup
                              value={training[activeTab]?.details?.ok_nok || ""}
                              onValueChange={(value) => handleValidationChange(activeTab, "ok_nok", value)}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="OK"
                                  id={`${activeTab}-ok`}
                                  className="text-purple-500 border-purple-500 data-[state=checked]:bg-purple-500"
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
                                value={training[activeTab]?.details?.who || ""}
                                onChange={(e) => handleValidationChange(activeTab, "who", e.target.value)}
                                placeholder="Enter name"
                                className="border-purple-100 focus-visible:ring-purple-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`${activeTab}-when`} className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                                Date
                              </Label>
                              <Input
                                id={`${activeTab}-when`}
                                value={training[activeTab]?.details?.when || ""}
                                onChange={(e) => handleValidationChange(activeTab, "when", e.target.value)}
                                placeholder="YYYY-MM-DD"
                                className="border-purple-100 focus-visible:ring-purple-500"
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
                              value={training[activeTab]?.details?.comment || ""}
                              onChange={(e) => handleValidationChange(activeTab, "comment", e.target.value)}
                              placeholder="Add any additional comments here"
                              rows={4}
                              className="border-purple-100 focus-visible:ring-purple-500"
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
                    onClick={() => handleNavigation("/training")}
                    className="text-purple-700 border-purple-200 hover:bg-purple-50"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving} className="bg-purple-600 hover:bg-purple-700">
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
                            entry.Training === params.id || (entry.Training && entry.Training._id === params.id),
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
                className="bg-purple-600 hover:bg-purple-700"
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

export default EditTrainingPage
