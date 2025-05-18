"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, Save, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
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
import { getTrainingById, updateTraining } from "../../../apis/readiness/trainingApi"
import { getAllReadiness } from "../../../apis/readiness/readinessApi"
import MainLayout from "@/components/MainLayout"

// Define the field labels and descriptions for better UI
const fieldConfig = {
  visualControlQualification: {
    label: "Visual Control Qualification",
    description: "Operator qualification for visual control",
  },
  dojoTrainingCompleted: {
    label: "Dojo Training Completed",
    description: "DOJO training completed for all relevant personnel",
  },
  trainingPlanDefined: {
    label: "Training Plan Defined",
    description: "Training plan for product/process defined per ramp-up",
  },
}

// Define the validation field labels
const validationFieldLabels = {
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

  // Add readinessId state
  const [readinessId, setReadinessId] = useState(null)

  // Add useEffect to extract readinessId from URL query parameters
  useEffect(() => {
    // Get the readinessId from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search)
    const id = queryParams.get("readinessId")
    console.log("Extracted readinessId from URL:", id)
    setReadinessId(id)
  }, [])

  // Fetch training data
  useEffect(() => {
    const fetchTraining = async () => {
      try {
        setIsLoading(true)
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

    if (params.id) {
      fetchTraining()
    }
  }, [params.id, toast])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateTraining(params.id, training)

      toast({
        title: "Success",
        description: "Training record updated successfully",
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
    } catch (error) {
      console.error("Error updating training record:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update training record",
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
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
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
              <CardTitle>Error</CardTitle>
              <CardDescription>Training record not found</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/training")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Training Records
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container px-4 py-8 mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (readinessId) {
                    console.log("Back button: Navigating to readiness detail:", readinessId)
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
                          navigate(`/training/${params.id}`)
                        }
                      })
                      .catch((error) => {
                        console.error("Error finding readiness entry:", error)
                        navigate(`/training/${params.id}`)
                      })
                  }
                }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Training Record</h1>
                <p className="text-muted-foreground">
                  Update training qualification details and validation information
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
                  <CardTitle>Training Fields</CardTitle>
                  <CardDescription>Select a field to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto">
                      {Object.keys(fieldConfig).map((field) => (
                        <TabsTrigger key={field} value={field} className="relative justify-start mb-1 text-left pl-9">
                          <span className="absolute left-2">
                            {training[field]?.value ? (
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
                      <TabsTrigger value="validation">Validation Details</TabsTrigger>
                    </TabsList>
                    <TabsContent value="status" className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeTab}-value`}
                          checked={training[activeTab]?.value || false}
                          onCheckedChange={(checked) => handleValueChange(activeTab, checked === true)}
                        />
                        <Label htmlFor={`${activeTab}-value`}>Mark as completed</Label>
                      </div>
                    </TabsContent>
                    <TabsContent value="validation" className="pt-4 space-y-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-ok_nok`}>Status</Label>
                            <RadioGroup
                              value={training[activeTab]?.details?.ok_nok || ""}
                              onValueChange={(value) => handleValidationChange(activeTab, "ok_nok", value)}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="OK" id={`${activeTab}-ok`} />
                                <Label htmlFor={`${activeTab}-ok`}>OK</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="NOK" id={`${activeTab}-nok`} />
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
                              <Label htmlFor={`${activeTab}-who`}>Responsible Person</Label>
                              <Input
                                id={`${activeTab}-who`}
                                value={training[activeTab]?.details?.who || ""}
                                onChange={(e) => handleValidationChange(activeTab, "who", e.target.value)}
                                placeholder="Enter name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`${activeTab}-when`}>Date</Label>
                              <Input
                                id={`${activeTab}-when`}
                                value={training[activeTab]?.details?.when || ""}
                                onChange={(e) => handleValidationChange(activeTab, "when", e.target.value)}
                                placeholder="YYYY-MM-DD"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-comment`}>Comments</Label>
                            <Textarea
                              id={`${activeTab}-comment`}
                              value={training[activeTab]?.details?.comment || ""}
                              onChange={(e) => handleValidationChange(activeTab, "comment", e.target.value)}
                              placeholder="Add any additional comments here"
                              rows={4}
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
                    onClick={() => {
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
                              navigate(`/training/${params.id}`)
                            }
                          })
                          .catch((error) => {
                            console.error("Error finding readiness entry:", error)
                            navigate(`/training/${params.id}`)
                          })
                      }
                    }}
                  >
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

export default EditTrainingPage
