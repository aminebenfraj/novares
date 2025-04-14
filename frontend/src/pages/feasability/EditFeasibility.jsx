"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getFeasibilityById, updateFeasibility } from "@/apis/feasabilityApi"
import { getAllMassProductions } from "@/apis/massProductionApi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Save, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import MainLayout from "@/components/MainLayout"

// List of checkin fields
const CHECKIN_FIELDS = [
  "business_manager",
  "economic_financial_leader",
  "engineering_leader_manager",
  "industrial_engineering",
  "launch_manager_method",
  "logistics",
  "maintenance",
  "plant_quality_leader",
  "project_manager",
  "purchasing",
  "quality_leader",
  "sales",
]

// Define field config for better UI
const fieldConfig = {}
CHECKIN_FIELDS.forEach((field) => {
  fieldConfig[field] = {
    label: field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: `Approval from ${field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
  }
})

const EditFeasibility = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [feasibilityData, setFeasibilityData] = useState({})
  const [checkinData, setCheckinData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState(CHECKIN_FIELDS[0])
  const [massProductionId, setMassProductionId] = useState(null)

  // Fetch Feasibility Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFeasibilityById(id)
        // Extract Feasibility Data
        const feasibilityFields = {}
        Object.entries(response.data).forEach(([key, value]) => {
          if (value && typeof value === "object" && "value" in value) {
            feasibilityFields[key] = {
              value: value.value ?? false,
              details: value.details || { description: "", cost: 0, sales_price: 0, comments: "" },
            }
          }
        })
        setFeasibilityData(feasibilityFields)

        // Extract Checkin Data
        if (response.data.checkin) {
          const checkinFields = CHECKIN_FIELDS.reduce((acc, field) => {
            acc[field] = response.data.checkin[field] ?? false
            return acc
          }, {})
          setCheckinData(checkinFields)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to fetch data")
        toast({ title: "Error", description: "Failed to fetch Feasibility data.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, toast])

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

  // Handle Feasibility Field Changes
  const handleFeasibilityChange = (key, field, value) => {
    setFeasibilityData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  // Handle Checkin Field Changes
  const handleCheckinChange = (key, checked) => {
    setCheckinData((prev) => ({ ...prev, [key]: checked }))
  }

  // Back button handler
  const handleBack = () => {
    if (massProductionId && massProductionId !== "masspd_idAttachment") {
      console.log("Back button: Navigating to mass production detail:", massProductionId)
      // Ensure we're using the correct URL format
      navigate(`/masspd/detail/${massProductionId}`)
    } else {
      console.log("No valid massProductionId found, navigating to feasibility list")
      navigate(`/feasibility`)
    }
  }

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formData = {
        ...Object.entries(feasibilityData).reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {}),
        checkin: checkinData,
      }

      console.log("Sending data to server:", JSON.stringify(formData, null, 2))
      await updateFeasibility(id, formData)

      toast({ title: "Success", description: "Feasibility and Checkin Updated Successfully!" })

      // Navigate back to mass production details page if massProductionId is available
      if (massProductionId && massProductionId !== "masspd_idAttachment") {
        console.log("Navigating back to mass production detail with ID:", massProductionId)
        // Ensure we're using the correct URL format
        navigate(`/masspd/detail/${massProductionId}`)
      } else {
        // If we couldn't extract the massProductionId directly, try to find it from API
        try {
          // Make an API call to get all mass production entries
          const massProductionEntries = await getAllMassProductions()

          // Find the mass production entry that references this feasibility
          const massProductionEntry = massProductionEntries.find(
            (entry) => entry.feasibility === id || (entry.feasibility && entry.feasibility._id === id),
          )

          if (massProductionEntry) {
            console.log("Found mass production entry:", massProductionEntry)
            navigate(`/masspd/detail/${massProductionEntry._id}`)
            return
          }
        } catch (error) {
          console.error("Error finding mass production entry:", error)
        }

        // Fallback to feasibility details page if massProductionId is not available
        console.log("No massProductionId found, navigating to feasibility detail")
        navigate(`/feasibility/${id}`)
      }
    } catch (error) {
      console.error("Update error:", error)
      toast({ title: "Error", description: "Failed to update Feasibility and Checkin", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  // Show Loader While Fetching Data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  // Show Error Message if API Fails
  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load feasibility data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/feasibility")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feasibility
            </Button>
          </CardFooter>
        </Card>
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
                <h1 className="text-3xl font-bold tracking-tight">Edit Feasibility</h1>
                <p className="text-muted-foreground">Update feasibility details and approvals</p>
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Approval Fields</CardTitle>
                  <CardDescription>Select a field to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto">
                      {CHECKIN_FIELDS.map((field) => (
                        <TabsTrigger key={field} value={field} className="relative justify-start mb-1 text-left pl-9">
                          <span className="absolute left-2">
                            {checkinData[field] ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </span>
                          {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>{fieldConfig[activeTab]?.label || activeTab}</CardTitle>
                  <CardDescription>{fieldConfig[activeTab]?.description || "Update approval status"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="status" className="w-full">
                    <TabsList>
                      <TabsTrigger value="status">Approval Status</TabsTrigger>
                      <TabsTrigger value="details">Feasibility Details</TabsTrigger>
                    </TabsList>
                    <TabsContent value="status" className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeTab}-value`}
                          checked={checkinData[activeTab] || false}
                          onCheckedChange={(checked) => handleCheckinChange(activeTab, checked === true)}
                        />
                        <Label htmlFor={`${activeTab}-value`}>Mark as approved</Label>
                      </div>
                    </TabsContent>
                    <TabsContent value="details" className="pt-4 space-y-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {Object.keys(feasibilityData).length > 0 ? (
                          Object.entries(feasibilityData).map(([key, value]) => (
                            <div key={key} className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`feasibility-${key}`}
                                  checked={value.value || false}
                                  onCheckedChange={(checked) => handleFeasibilityChange(key, "value", checked)}
                                />
                                <Label htmlFor={`feasibility-${key}`} className="text-base font-medium">
                                  {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                </Label>
                              </div>

                              {value.value && (
                                <div className="pl-6 mt-2 space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`${key}-description`}>Description</Label>
                                    <Textarea
                                      id={`${key}-description`}
                                      value={value.details?.description || ""}
                                      onChange={(e) =>
                                        handleFeasibilityChange(key, "details", {
                                          ...value.details,
                                          description: e.target.value,
                                        })
                                      }
                                      placeholder="Enter description..."
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <Label htmlFor={`${key}-cost`}>Cost</Label>
                                      <Input
                                        id={`${key}-cost`}
                                        type="number"
                                        value={value.details?.cost || ""}
                                        onChange={(e) =>
                                          handleFeasibilityChange(key, "details", {
                                            ...value.details,
                                            cost: Number(e.target.value),
                                          })
                                        }
                                        placeholder="Enter cost..."
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor={`${key}-sales-price`}>Sales Price</Label>
                                      <Input
                                        id={`${key}-sales-price`}
                                        type="number"
                                        value={value.details?.sales_price || ""}
                                        onChange={(e) =>
                                          handleFeasibilityChange(key, "details", {
                                            ...value.details,
                                            sales_price: Number(e.target.value),
                                          })
                                        }
                                        placeholder="Enter sales price..."
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`${key}-comments`}>Comments</Label>
                                    <Textarea
                                      id={`${key}-comments`}
                                      value={value.details?.comments || ""}
                                      onChange={(e) =>
                                        handleFeasibilityChange(key, "details", {
                                          ...value.details,
                                          comments: e.target.value,
                                        })
                                      }
                                      placeholder="Enter comments..."
                                    />
                                  </div>
                                </div>
                              )}

                              <Separator />
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No feasibility data available.</p>
                        )}
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
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

export default EditFeasibility
