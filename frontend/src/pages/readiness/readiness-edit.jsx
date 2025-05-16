"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, Save, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import MainLayout from "@/components/MainLayout"

// Import API functions
import { getReadinessById, updateReadiness } from "../../apis/readiness/readinessApi"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function ReadinessEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [additionalNotes, setAdditionalNotes] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    project_number: "",
    part_designation: "",
    part_number: "",
    description: "",
    status: "on-going",
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
          project_number: data.project_number || "",
          part_designation: data.part_designation || "",
          part_number: data.part_number || "",
          description: data.description || "",
          status: data.status || "on-going",
        })

        // Set additional notes if available
        if (data.additionalNotes) {
          setAdditionalNotes(data.additionalNotes)
        }
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
      if (!formData.project_number || !formData.part_number) {
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
      const readinessData = {
        ...formData,
        additionalNotes,
      }

      setProgress(50)

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading readiness data...</span>
      </div>
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
              <TabsTrigger value="basic" className="flex-grow">
                Basic Information
              </TabsTrigger>
              <TabsTrigger value="details" className="flex-grow">
                Additional Details
              </TabsTrigger>
              <TabsTrigger value="submit" className="flex-grow">
                Review & Submit
              </TabsTrigger>
            </TabsList>

            <motion.div key={activeTab} initial="hidden" animate="visible" variants={slideUp} exit={{ opacity: 0 }}>
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
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
                      <Label htmlFor="project_number" className="flex items-center">
                        Project Number <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <Input
                        id="project_number"
                        name="project_number"
                        value={formData.project_number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="part_number" className="flex items-center">
                          Part Number <span className="ml-1 text-red-500">*</span>
                        </Label>
                        <Input
                          id="part_number"
                          name="part_number"
                          value={formData.part_number}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="part_designation">Part Designation</Label>
                        <Input
                          id="part_designation"
                          name="part_designation"
                          value={formData.part_designation}
                          onChange={handleInputChange}
                        />
                      </div>
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
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="Enter any additional notes or comments here..."
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

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
                          <p className="text-sm font-medium text-gray-500">Project Number</p>
                          <p>{formData.project_number || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Part Number</p>
                          <p>{formData.part_number || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Part Designation</p>
                          <p>{formData.part_designation || "Not specified"}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-500">Description</p>
                          <p>{formData.description || "Not specified"}</p>
                        </div>
                      </div>
                    </div>

                    {additionalNotes && (
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <h3 className="mb-2 text-lg font-medium">Additional Notes</h3>
                        <p className="whitespace-pre-wrap">{additionalNotes}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                      Back to Edit
                    </Button>
                    <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
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
                  </CardFooter>
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
