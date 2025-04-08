"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getfacilitiesById, updatefacilities } from "../../apis/facilitiesApi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Upload, CalendarIcon, ArrowLeft, Save, Loader2, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import MainLayout from "@/components/MainLayout"

const facilityFields = [
  "reception_of_modified_means",
  "reception_of_modified_tools",
  "reception_of_modified_fixtures",
  "reception_of_modified_parts",
  "control_plan",
]

// Define field config for better UI
const fieldConfig = {}
facilityFields.forEach((field) => {
  fieldConfig[field] = {
    label: field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: `Configuration for ${field.replace(/_/g, " ")}`,
  }
})

const EditFacilities = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState(facilityFields[0])
  const [massProductionId, setMassProductionId] = useState(null)

  const [formData, setFormData] = useState(() => {
    const initialState = {}
    facilityFields.forEach((field) => {
      initialState[field] = {
        value: false,
        task: {
          check: false,
          responsible: "",
          planned: "",
          done: "",
          comments: "",
          filePath: null,
        },
      }
    })
    return initialState
  })

  useEffect(() => {
    if (id) {
      fetchFacility()
    }
  }, [id])

  // Add this useEffect to extract massProductionId from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const mpId = queryParams.get("massProductionId")
    console.log("Extracted massProductionId from URL:", mpId)
    if (mpId) {
      setMassProductionId(mpId)
    }
  }, [])

  const fetchFacility = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getfacilitiesById(id)
      if (!data) {
        throw new Error("Facility data not found.")
      }

      const fetchedData = { ...formData }
      facilityFields.forEach((field) => {
        fetchedData[field] = {
          value: data[field]?.value || false,
          task: { ...data[field]?.task },
        }
      })
      setFormData(fetchedData)
    } catch (error) {
      console.error("Error fetching Facility data:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: "Failed to load facility data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckboxChange = (field, checked) => {
    setFormData({
      ...formData,
      [field]: { ...formData[field], value: checked },
    })
  }

  const handleTaskChange = (e, field, type) => {
    const value = type === "check" ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        task: { ...formData[field].task, [type]: value },
      },
    })
  }

  const handleDateChange = (field, type, date) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        task: { ...formData[field].task, [type]: format(date, "yyyy-MM-dd") },
      },
    })
  }

  const handleFileChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        task: { ...formData[field].task, filePath: e.target.files[0] },
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const submissionData = { ...formData }

    Object.keys(submissionData).forEach((field) => {
      if (submissionData[field].task.filePath instanceof File) {
        submissionData[field].task.filePath = submissionData[field].task.filePath.name
      }
    })

    try {
      await updatefacilities(id, submissionData)
      toast({
        title: "Success",
        description: "Facility updated successfully",
      })

      // Navigate back to mass production details page if massProductionId is available
      if (massProductionId) {
        navigate(`/masspd/detail/${massProductionId}`)
      } else {
        navigate("/facilities")
      }
    } catch (error) {
      console.error("Error updating Facility:", error)
      toast({
        title: "Error",
        description: "Failed to update facility. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load facility data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/facilities")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Facilities
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
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (massProductionId) {
                    navigate(`/masspd/detail/${massProductionId}`)
                  } else {
                    navigate("/facilities")
                  }
                }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Facility</h1>
                <p className="text-muted-foreground">Update facility details and tasks</p>
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
                  <CardTitle>Facility Fields</CardTitle>
                  <CardDescription>Select a field to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto">
                      {facilityFields.map((field) => (
                        <TabsTrigger key={field} value={field} className="relative justify-start mb-1 text-left pl-9">
                          <span className="absolute left-2">
                            {formData[field]?.value ? (
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
                  <CardDescription>{fieldConfig[activeTab]?.description || "Update facility details"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="status" className="w-full">
                    <TabsList>
                      <TabsTrigger value="status">Status</TabsTrigger>
                      <TabsTrigger value="details">Task Details</TabsTrigger>
                    </TabsList>
                    <TabsContent value="status" className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeTab}-value`}
                          checked={formData[activeTab]?.value || false}
                          onCheckedChange={(checked) => handleCheckboxChange(activeTab, checked === true)}
                        />
                        <Label htmlFor={`${activeTab}-value`}>Mark as completed</Label>
                      </div>
                    </TabsContent>
                    <TabsContent value="details" className="pt-4 space-y-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-responsible`}>Responsible</Label>
                            <Input
                              id={`${activeTab}-responsible`}
                              type="text"
                              value={formData[activeTab]?.task.responsible || ""}
                              onChange={(e) => handleTaskChange(e, activeTab, "responsible")}
                              placeholder="Enter responsible person"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-check`}>Completion Status</Label>
                            <div className="flex items-center pt-2 space-x-2">
                              <Checkbox
                                id={`${activeTab}-check`}
                                checked={formData[activeTab]?.task.check || false}
                                onCheckedChange={(checked) =>
                                  handleTaskChange({ target: { checked } }, activeTab, "check")
                                }
                              />
                              <Label htmlFor={`${activeTab}-check`}>Mark as Completed</Label>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-planned`}>Planned Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={`w-full justify-start text-left font-normal ${
                                    !formData[activeTab]?.task.planned && "text-muted-foreground"
                                  }`}
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  {formData[activeTab]?.task.planned ? (
                                    format(new Date(formData[activeTab]?.task.planned), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={
                                    formData[activeTab]?.task.planned
                                      ? new Date(formData[activeTab]?.task.planned)
                                      : undefined
                                  }
                                  onSelect={(date) => handleDateChange(activeTab, "planned", date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-done`}>Completion Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={`w-full justify-start text-left font-normal ${
                                    !formData[activeTab]?.task.done && "text-muted-foreground"
                                  }`}
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  {formData[activeTab]?.task.done ? (
                                    format(new Date(formData[activeTab]?.task.done), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={
                                    formData[activeTab]?.task.done
                                      ? new Date(formData[activeTab]?.task.done)
                                      : undefined
                                  }
                                  onSelect={(date) => handleDateChange(activeTab, "done", date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-comments`}>Comments</Label>
                          <Textarea
                            id={`${activeTab}-comments`}
                            value={formData[activeTab]?.task.comments || ""}
                            onChange={(e) => handleTaskChange(e, activeTab, "comments")}
                            placeholder="Enter comments..."
                            rows={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-file`}>Upload File</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id={`${activeTab}-file`}
                              type="file"
                              onChange={(e) => handleFileChange(e, activeTab)}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById(`${activeTab}-file`).click()}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {formData[activeTab]?.task.filePath?.name ||
                                formData[activeTab]?.task.filePath ||
                                "No file chosen"}
                            </span>
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
                      if (massProductionId) {
                        navigate(`/masspd/detail/${massProductionId}`)
                      } else {
                        navigate("/facilities")
                      }
                    }}
                  >
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

export default EditFacilities
