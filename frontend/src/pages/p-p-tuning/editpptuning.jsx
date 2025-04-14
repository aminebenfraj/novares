"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getP_P_TuningById, updateP_P_Tuning } from "../../apis/p-p-tuning-api"
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

const p_p_tuningFields = [
  "product_process_tuning",
  "functional_validation_test",
  "dimensional_validation_test",
  "aspect_validation_test",
  "supplier_order_modification",
  "acceptation_of_supplier",
  "capability",
  "manufacturing_of_control_parts",
  "product_training",
  "process_training",
  "purchase_file",
  "means_technical_file_data",
  "means_technical_file_manufacturing",
  "means_technical_file_maintenance",
  "tooling_file",
  "product_file",
  "internal_process",
]

// Define field config for better UI
const fieldConfig = {}
p_p_tuningFields.forEach((field) => {
  fieldConfig[field] = {
    label: field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: `Configuration for ${field.replace(/_/g, " ")}`,
  }
})

const EditP_P_Tuning = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState(p_p_tuningFields[0])
  const [massProductionId, setMassProductionId] = useState(null)

  const [formData, setFormData] = useState(() => {
    const initialState = {}
    p_p_tuningFields.forEach((field) => {
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
      fetchP_P_Tuning()
    }
  }, [id])

  // Add this useEffect to extract massProductionId from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const mpId = queryParams.get("massProductionId")

    if (mpId) {
      console.log("Extracted massProductionId from URL:", mpId)
      setMassProductionId(mpId)
      // Store in localStorage as fallback
      localStorage.setItem("lastMassProductionId", mpId)
    } else {
      // Try to get from localStorage as a fallback
      const storedMpId = localStorage.getItem("lastMassProductionId")
      if (storedMpId) {
        console.log("Retrieved massProductionId from localStorage:", storedMpId)
        setMassProductionId(storedMpId)
      } else {
        // If we still don't have an ID, try to extract it from the URL path
        const pathParts = window.location.pathname.split("/")
        const editIndex = pathParts.indexOf("edit")
        if (editIndex > 0 && editIndex < pathParts.length - 1) {
          const possibleId = pathParts[editIndex + 1]
          if (possibleId && possibleId !== "masspd_idAttachment") {
            console.log("Extracted massProductionId from URL path:", possibleId)
            setMassProductionId(possibleId)
            localStorage.setItem("lastMassProductionId", possibleId)
          }
        }
      }
    }
  }, [])

  const fetchP_P_Tuning = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getP_P_TuningById(id)
      if (!data) {
        throw new Error("Product Process Tuning data not found.")
      }

      const fetchedData = { ...formData }
      p_p_tuningFields.forEach((field) => {
        fetchedData[field] = {
          value: data[field]?.value || false,
          task: { ...data[field]?.task },
        }
      })
      setFormData(fetchedData)
    } catch (error) {
      console.error("Error fetching Product Process Tuning data:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: "Failed to load product/process tuning data",
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
      await updateP_P_Tuning(id, submissionData)
      toast({
        title: "Success",
        description: "Product/Process Tuning updated successfully",
      })

      // Navigate back to mass production details page if massProductionId is available
      if (massProductionId) {
        navigate(`/masspd/detail/${massProductionId}`)
      } else {
        navigate("/p_p_tuning")
      }
    } catch (error) {
      console.error("Error updating Product Process Tuning:", error)
      toast({
        title: "Error",
        description: "Failed to update product/process tuning. Please try again.",
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
            <CardDescription>Failed to load product/process tuning data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/p_p_tuning")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to P/P Tuning
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
                  if (massProductionId && massProductionId !== "masspd_idAttachment") {
                    navigate(`/masspd/detail/${massProductionId}`)
                  } else {
                    navigate("/p_p_tuning")
                  }
                }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Product/Process Tuning</h1>
                <p className="text-muted-foreground">Update tuning details and tasks</p>
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
                  <CardTitle>Tuning Fields</CardTitle>
                  <CardDescription>Select a field to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto">
                      {p_p_tuningFields.map((field) => (
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
                  <CardDescription>{fieldConfig[activeTab]?.description || "Update tuning details"}</CardDescription>
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
                      if (massProductionId && massProductionId !== "masspd_idAttachment") {
                        // Ensure we're using the correct URL format
                        navigate(`/masspd/detail/${massProductionId}`)
                      } else {
                        navigate("/p_p_tuning")
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

export default EditP_P_Tuning
