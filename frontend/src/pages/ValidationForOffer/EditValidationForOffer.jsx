"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getValidationForOfferById, updateValidationForOffer } from "../../apis/validationForOfferApi"
import { getCheckinById, updateCheckin } from "../../apis/checkIn"
import { useParams, useNavigate } from "react-router-dom"
import MainLayout from "@/components/MainLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { CalendarIcon, Upload, ArrowLeft, Save, Loader2 } from 'lucide-react'

// Define role fields based on the CheckInModel schema
const roleFields = [
  { id: "Project Manager", label: "Project Manager" },
  { id: "Business Manager", label: "Business Manager" },
  { id: "Financial Leader", label: "Financial Leader" },
  { id: "Manufacturing Eng. Manager", label: "Manufacturing Eng. Manager" },
  { id: "Manufacturing Eng. Leader", label: "Manufacturing Eng. Leader" },
  { id: "Methodes UAP1&3", label: "Methodes UAP1&3" },
  { id: "Methodes UAP2", label: "Methodes UAP2" },
  { id: "Maintenance Manager", label: "Maintenance Manager" },
  { id: "Maintenance Leader UAP2", label: "Maintenance Leader UAP2" },
  { id: "Prod. Plant Manager UAP1", label: "Prod. Plant Manager UAP1" },
  { id: "Prod. Plant Manager UAP2", label: "Prod. Plant Manager UAP2" },
  { id: "Quality Manager", label: "Quality Manager" },
  { id: "Quality Leader UAP1", label: "Quality Leader UAP1" },
  { id: "Quality Leader UAP2", label: "Quality Leader UAP2" },
  { id: "Quality Leader UAP3", label: "Quality Leader UAP3" },
]

const EditValidationForOffer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  // ValidationForOffer state
  const [validationData, setValidationData] = useState({
    name: "",
    check: false,
    date: new Date(),
    comments: "",
  })
  const [file, setFile] = useState(null)
  const [existingFile, setExistingFile] = useState(null)

  // Checkin state - initialize with default structure
  const [checkinData, setCheckinData] = useState(
    roleFields.reduce((acc, field) => {
      acc[field.id] = {
        value: false,
        comment: "",
        date: new Date().toISOString(),
        name: "",
      }
      return acc
    }, {})
  )

  const [checkinId, setCheckinId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("validation")
  const [massProductionId, setMassProductionId] = useState(null)

  // Extract massProductionId from URL or localStorage
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const mpId = queryParams.get("massProductionId")

    if (mpId) {
      console.log("Found massProductionId in query params:", mpId)
      setMassProductionId(mpId)
      localStorage.setItem("lastMassProductionId", mpId)
    } else {
      const storedId = localStorage.getItem("lastMassProductionId")
      if (storedId) {
        console.log("Using massProductionId from localStorage:", storedId)
        setMassProductionId(storedId)
      }
    }
  }, [])

  // Fetch validation for offer and checkin data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch validation for offer data
        const response = await getValidationForOfferById(id)
        console.log("Validation for offer data:", response)

        if (!response) {
          throw new Error("Failed to fetch validation for offer data")
        }

        const data = response.data || response

        // Set validation data
        setValidationData({
          name: data.name || "",
          check: data.check || false,
          date: data.date ? new Date(data.date) : new Date(),
          comments: data.comments || "",
        })

        // Set existing file if available
        if (data.upload) {
          setExistingFile(data.upload)
        }

        // Handle checkin data
        if (data.checkin) {
          const checkinId = typeof data.checkin === "object" ? data.checkin._id : data.checkin
          setCheckinId(checkinId)

          // Fetch checkin data
          if (checkinId) {
            try {
              const checkinResponse = await getCheckinById(checkinId)
              const checkinData = checkinResponse.data || checkinResponse

              // Initialize checkin data with default structure
              const initializedCheckinData = {}
              
              // Map checkin data to state, ensuring all fields have the correct structure
              roleFields.forEach((field) => {
                if (checkinData[field.id]) {
                  initializedCheckinData[field.id] = {
                    value: checkinData[field.id].value || false,
                    comment: checkinData[field.id].comment || "",
                    date: checkinData[field.id].date || new Date().toISOString(),
                    name: checkinData[field.id].name || "",
                  }
                } else {
                  // If field doesn't exist in the data, create it with default values
                  initializedCheckinData[field.id] = {
                    value: false,
                    comment: "",
                    date: new Date().toISOString(),
                    name: "",
                  }
                }
              })

              setCheckinData(initializedCheckinData)
            } catch (error) {
              console.error("Error fetching checkin data:", error)
              toast({
                title: "Warning",
                description: "Could not load check-in data. You'll create a new check-in.",
                variant: "warning",
              })
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch validation for offer data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, toast])

  const handleValidationChange = (key, value) => {
    setValidationData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCheckboxChange = (fieldId) => {
    setCheckinData({
      ...checkinData,
      [fieldId]: {
        ...checkinData[fieldId],
        value: !checkinData[fieldId].value,
        // Update date to current time when checked
        date: !checkinData[fieldId].value ? new Date().toISOString() : checkinData[fieldId].date,
      },
    })
  }

  const handleCommentChange = (fieldId, value) => {
    setCheckinData({
      ...checkinData,
      [fieldId]: {
        ...checkinData[fieldId],
        comment: value,
      },
    })
  }

  const handleNameChange = (fieldId, value) => {
    setCheckinData({
      ...checkinData,
      [fieldId]: {
        ...checkinData[fieldId],
        name: value,
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Create a FormData object for the request
      const formData = new FormData()

      // Add ValidationForOffer data
      formData.append("name", validationData.name)
      formData.append("check", validationData.check)
      formData.append("date", validationData.date ? format(validationData.date, "yyyy-MM-dd") : "")
      formData.append("comments", validationData.comments)

      // Add file if present
      if (file) {
        formData.append("upload", file)
      }

      // Update or create checkin
      const checkinReference = checkinId

      // Prepare checkin data
      const checkinDataObj = {}
      Object.keys(checkinData).forEach((key) => {
        checkinDataObj[key] = checkinData[key]
      })

      if (checkinId) {
        // Update existing checkin
        console.log("Updating existing checkin:", checkinId)
        await updateCheckin(checkinId, checkinDataObj)
      } else {
        // Create new checkin - handled by backend when we pass the data
        console.log("Will create new checkin")
      }

      // Add checkin data to form
      formData.append("checkin", JSON.stringify(checkinDataObj))

      // If we have a massProductionId, include it
      if (massProductionId) {
        formData.append("massProductionId", massProductionId)
      }

      console.log("Sending data to update ValidationForOffer with checkin")

      // Update the validation for offer
      const response = await updateValidationForOffer(id, formData)
      console.log("Update response:", response)

      toast({
        title: "Success",
        description: "Validation for Offer updated successfully!",
      })

      // Navigate back based on context
      if (massProductionId) {
        navigate(`/masspd/detail/${massProductionId}`)
      } else {
        navigate("/validationforoffer")
      }
    } catch (error) {
      console.error("Error updating Validation for Offer:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update Validation for Offer",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    if (massProductionId) {
      navigate(`/masspd/detail/${massProductionId}`)
    } else {
      navigate("/validationforoffer")
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container px-4 py-8 mx-auto"
      >
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-4" onClick={handleBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Validation for Offer</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="validation">Validation Details</TabsTrigger>
              <TabsTrigger value="checkin">Check-in Details</TabsTrigger>
            </TabsList>

            <TabsContent value="validation">
              <Card>
                <CardHeader>
                  <CardTitle>Validation for Offer Details</CardTitle>
                  <CardDescription>Edit the details for the Validation for Offer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Offer Name</Label>
                    <Input
                      id="name"
                      value={validationData.name}
                      onChange={(e) => handleValidationChange("name", e.target.value)}
                      placeholder="Enter offer name"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="check"
                      checked={validationData.check}
                      onCheckedChange={(value) => handleValidationChange("check", value === true)}
                    />
                    <Label htmlFor="check" className="text-sm font-medium">
                      Approve Offer
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${!validationData.date && "text-muted-foreground"}`}
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {validationData.date ? format(validationData.date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={validationData.date}
                          onSelect={(date) => handleValidationChange("date", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      value={validationData.comments}
                      onChange={(e) => handleValidationChange("comments", e.target.value)}
                      placeholder="Add any comments about this validation"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File (optional)</Label>
                    <div className="relative">
                      <Upload className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <Input id="file" type="file" onChange={(e) => setFile(e.target.files[0])} className="pl-10" />
                    </div>
                    {existingFile && !file && (
                      <p className="text-sm text-muted-foreground">Current file: {existingFile}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("checkin")}>
                    Next: Check-in Details
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="checkin">
              <Card>
                <CardHeader>
                  <CardTitle>Check-in Details</CardTitle>
                  <CardDescription>
                    Edit the details for the check-in. Check the box for completed items, add the name of the person
                    checking in, and provide any comments.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="grid gap-6 md:grid-cols-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {roleFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        className="p-4 border rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-start mb-3 space-x-3">
                          <Checkbox
                            id={`${field.id}-checkbox`}
                            checked={checkinData[field.id]?.value || false}
                            onCheckedChange={() => handleCheckboxChange(field.id)}
                          />
                          <label
                            htmlFor={`${field.id}-checkbox`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {field.label}
                          </label>
                        </div>

                        <div className="mb-3">
                          <Label htmlFor={`${field.id}-name`} className="block mb-1 text-xs text-gray-500">
                            Name
                          </Label>
                          <Input
                            id={`${field.id}-name`}
                            placeholder="Enter name"
                            value={checkinData[field.id]?.name || ""}
                            onChange={(e) => handleNameChange(field.id, e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>

                        <Label htmlFor={`${field.id}-comment`} className="block mb-1 text-xs text-gray-500">
                          Comments
                        </Label>
                        <Textarea
                          id={`${field.id}-comment`}
                          placeholder="Add comments here..."
                          value={checkinData[field.id]?.comment || ""}
                          onChange={(e) => handleCommentChange(field.id, e.target.value)}
                          className="h-20 text-sm"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("validation")}>
                    Back to Validation
                  </Button>
                  <Button type="submit" className="flex items-center gap-2" disabled={submitting}>
                    {submitting ? (
                      <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    {submitting ? "Saving..." : "Save Both"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </motion.div>
    </MainLayout>
  )
}

export default EditValidationForOffer
