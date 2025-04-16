"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { createValidationForOffer } from "../../apis/validationForOfferApi"
import { useNavigate } from "react-router-dom"
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
import { CalendarIcon, Upload, ArrowLeft, Save } from "lucide-react"

const roleFields = [
  { id: "project_manager", label: "Project Manager" },
  { id: "business_manager", label: "Business Manager" },
  { id: "engineering_leader_manager", label: "Engineering Leader/Manager" },
  { id: "quality_leader", label: "Quality Leader" },
  { id: "plant_quality_leader", label: "Plant Quality Leader" },
  { id: "industrial_engineering", label: "Industrial Engineering" },
  { id: "launch_manager_method", label: "Launch Manager Method" },
  { id: "maintenance", label: "Maintenance" },
  { id: "purchasing", label: "Purchasing" },
  { id: "logistics", label: "Logistics" },
  { id: "sales", label: "Sales" },
  { id: "economic_financial_leader", label: "Economic Financial Leader" },
]

const CreateValidationForOffer = () => {
  // ValidationForOffer state
  const [validationData, setValidationData] = useState({
    name: "",
    check: false,
    date: new Date(),
    comments: "",
  })
  const [file, setFile] = useState(null)

  // Checkin state
  const [checkinData, setCheckinData] = useState(
    roleFields.reduce((acc, field) => {
      acc[field.id] = {
        value: false,
        comment: "",
        date: new Date().toISOString(),
        name: "",
      }
      return acc
    }, {}),
  )

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("validation")
  const { toast } = useToast()
  const navigate = useNavigate()

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
    setLoading(true)

    try {
      // Create a FormData object for the request
      const formData = new FormData()

      // Add ValidationForOffer data
      formData.append("name", validationData.name)
      formData.append("check", validationData.check)
      formData.append("date", validationData.date ? format(validationData.date, "yyyy-MM-dd") : "")
      formData.append("comments", validationData.comments)

      // Add file if present
      if (file) formData.append("upload", file)

      // Add checkin data directly as a field
      // We'll let the backend handle the parsing
      const checkinDataObj = {}
      Object.keys(checkinData).forEach((key) => {
        checkinDataObj[key] = checkinData[key]
      })
      formData.append("checkin", JSON.stringify(checkinDataObj))

      console.log("Sending data to create ValidationForOffer with checkin")

      // Send the combined request
      const response = await createValidationForOffer(formData)
      console.log("Creation response:", response)

      toast({
        title: "Success",
        description: "Validation for Offer created successfully!",
      })
      navigate("/validationforoffer")
    } catch (error) {
      console.error("Error creating Validation for Offer:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create Validation for Offer",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
          <Button variant="ghost" className="mr-4" onClick={() => navigate("/validationforoffer")}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Create Validation for Offer with Check-in</h1>
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
                  <CardDescription>Fill in the details for the Validation for Offer</CardDescription>
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
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => navigate("/validationforoffer")}>
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
                    Fill in the details for the new check-in. Check the box for completed items, add the name of the
                    person checking in, and provide any comments.
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
                            checked={checkinData[field.id].value}
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
                            value={checkinData[field.id].name}
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
                          value={checkinData[field.id].comment}
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
                  <Button type="submit" className="flex items-center gap-2" disabled={loading}>
                    {loading ? (
                      <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    {loading ? "Saving..." : "Save Both"}
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

export default CreateValidationForOffer
