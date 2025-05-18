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
import { getDocumentationById, updateDocumentation } from "../../../apis/readiness/documentationApi"
import { getAllReadiness } from "../../../apis/readiness/readinessApi"
import MainLayout from "@/components/MainLayout"

// Define the field labels and descriptions for better UI
const fieldConfig = {
  workStandardsInPlace: {
    label: "Work Standards In Place",
    description: "Work standards available in the workplace",
  },
  polyvalenceMatrixUpdated: {
    label: "Polyvalence Matrix Updated",
    description: "Polyvalence Matrix up to date (Operators & Leaders)",
  },
  gaugesAvailable: {
    label: "Gauges Available",
    description: "Gauges in place, leaders trained, report sheets available",
  },
  qualityFileApproved: {
    label: "Quality File Approved",
    description: "Quality Assurance File completed & approved",
  },
  drpUpdated: {
    label: "DRP Updated",
    description: "Disaster Recovery Plan (DRP) updated",
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

function EditDocumentationPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("workStandardsInPlace")
  const [documentation, setDocumentation] = useState(null)
  const [readinessId, setReadinessId] = useState(null)

  // Fetch documentation data and try to find readiness ID
  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return

      try {
        setIsLoading(true)

        // First, check URL query parameters for readinessId
        const queryParams = new URLSearchParams(window.location.search)
        const urlReadinessId = queryParams.get("readinessId")
        if (urlReadinessId) {
          console.log("Found readinessId in URL:", urlReadinessId)
          setReadinessId(urlReadinessId)
        }

        // Fetch documentation data
        const data = await getDocumentationById(params.id)
        setDocumentation(data)
        console.log("Documentation data:", data)

        // If we don't have readinessId from URL, try to find it in the documentation
        if (!urlReadinessId) {
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
          } else {
            // If still no readinessId, try to find it in all readiness entries
            try {
              const readinessEntries = await getAllReadiness()
              console.log("Searching through readiness entries for documentation ID:", params.id)

              // Find the readiness entry that contains this documentation ID
              for (const entry of readinessEntries) {
                if (
                  entry.Documentation &&
                  ((typeof entry.Documentation === "object" && entry.Documentation._id === params.id) ||
                    entry.Documentation === params.id)
                ) {
                  console.log("Found matching readiness entry:", entry._id)
                  setReadinessId(entry._id)
                  break
                }
              }
            } catch (error) {
              console.error("Error searching readiness entries:", error)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching documentation:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load documentation data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setIsSaving(true)

    try {
      await updateDocumentation(params.id, documentation)

      toast({
        title: "Success",
        description: "Documentation updated successfully",
      })

      // Navigate back to readiness details page if readinessId is available
      if (readinessId) {
        console.log("Navigating to readiness detail:", readinessId)
        navigate(`/readiness/detail/${readinessId}`)
      } else {
        // If we still don't have a readinessId, try one more time to find it
        try {
          const readinessEntries = await getAllReadiness()
          let foundId = null

          for (const entry of readinessEntries) {
            if (
              entry.Documentation &&
              ((typeof entry.Documentation === "object" && entry.Documentation._id === params.id) ||
                entry.Documentation === params.id)
            ) {
              console.log("Found matching readiness entry at submit time:", entry._id)
              foundId = entry._id
              break
            }
          }

          if (foundId) {
            navigate(`/readiness/detail/${foundId}`)
          } else {
            // Fallback to documentation details page
            navigate(`/documentation/${params.id}`)
          }
        } catch (error) {
          console.error("Error finding readiness entry:", error)
          navigate(`/documentation/${params.id}`)
        }
      }
    } catch (error) {
      console.error("Error updating documentation:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update documentation",
      })
      setIsSaving(false)
    }
  }

  // Handle field value change
  const handleValueChange = (field, value) => {
    setDocumentation((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
      },
    }))
  }

  // Handle validation field change
  const handleValidationChange = (field, validationField, value) => {
    setDocumentation((prev) => ({
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

  if (!documentation) {
    return (
      <MainLayout>
        <div className="container px-4 py-8 mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>Documentation not found</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/documentation")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Documentation
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
                    navigate(`/documentation/${params.id}`)
                  }
                }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Documentation</h1>
                <p className="text-muted-foreground">Update documentation details and validation information</p>
              </div>
            </div>
            <Button onClick={() => handleSubmit()} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Documentation Fields</CardTitle>
                  <CardDescription>Select a field to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto">
                      {Object.keys(fieldConfig).map((field) => (
                        <TabsTrigger key={field} value={field} className="relative justify-start mb-1 text-left pl-9">
                          <span className="absolute left-2">
                            {documentation[field]?.value ? (
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
                          checked={documentation[activeTab]?.value || false}
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
                              value={documentation[activeTab]?.details?.ok_nok || ""}
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
                                value={documentation[activeTab]?.details?.who || ""}
                                onChange={(e) => handleValidationChange(activeTab, "who", e.target.value)}
                                placeholder="Enter name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`${activeTab}-when`}>Date</Label>
                              <Input
                                id={`${activeTab}-when`}
                                value={documentation[activeTab]?.details?.when || ""}
                                onChange={(e) => handleValidationChange(activeTab, "when", e.target.value)}
                                placeholder="YYYY-MM-DD"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-comment`}>Comments</Label>
                            <Textarea
                              id={`${activeTab}-comment`}
                              value={documentation[activeTab]?.details?.comment || ""}
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
                        console.log("Cancel button: Navigating to readiness detail:", readinessId)
                        navigate(`/readiness/detail/${readinessId}`)
                      } else {
                        navigate(`/documentation/${params.id}`)
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleSubmit()} disabled={isSaving}>
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

export default EditDocumentationPage
