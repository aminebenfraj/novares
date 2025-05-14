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
import { CalendarIcon, Upload, ArrowLeft, Save, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import RoleBasedCheckin from "../../components/role-based-checkin"

const EditValidationForOffer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isAdmin, hasRole } = useAuth()

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
  const [checkinData, setCheckinData] = useState({})
  const [checkinId, setCheckinId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("validation")
  const [massProductionId, setMassProductionId] = useState(null)

  // Check if user can edit validation details
  const canEditValidation = () => {
    return isAdmin() || (user?.roles && user.roles.length > 0)
  }

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
              console.log("Fetched checkin data:", checkinData)
              setCheckinData(checkinData)
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
    if (!canEditValidation()) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit validation details.",
        variant: "destructive",
      })
      return
    }
    setValidationData((prev) => ({ ...prev, [key]: value }))
  }

  // Update the handleSubmit function to check permissions before submitting
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if user has permission to submit any changes
    const hasAnyEditPermission = canEditValidation() || isAdmin()

    if (!hasAnyEditPermission) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to submit changes.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // Create a FormData object for the request
      const formData = new FormData()

      // Add ValidationForOffer data
      formData.append("name", validationData.name)
      formData.append("check", validationData.check)
      formData.append("date", validationData.date ? format(validationData.date, "yyyy-MM-dd") : "")
      formData.append("comments", validationData.comments || "")

      // Add file if present
      if (file) {
        formData.append("upload", file)
      }

      // Prepare checkin data
      if (checkinId) {
        // Update existing checkin
        console.log("Updating existing checkin:", checkinId)
        await updateCheckin(checkinId, checkinData)
      }

      // Add checkin data to form
      formData.append("checkin", JSON.stringify(checkinData))

      // If we have a massProductionId, include it
      if (massProductionId) {
        formData.append("massProductionId", massProductionId)
      }

      console.log("Sending data to update ValidationForOffer with checkin:", {
        validationData,
        checkinData,
      })

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
                  <CardDescription>
                    {canEditValidation()
                      ? "Edit the details for the Validation for Offer"
                      : "View the details for the Validation for Offer (read-only)"}
                  </CardDescription>
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
                      disabled={!canEditValidation()}
                      className={!canEditValidation() ? "opacity-60" : ""}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="check"
                      checked={validationData.check}
                      onCheckedChange={(value) => handleValidationChange("check", value === true)}
                      disabled={!canEditValidation()}
                      className={!canEditValidation() ? "opacity-60" : ""}
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
                          className={`w-full justify-start text-left font-normal ${!validationData.date && "text-muted-foreground"} ${!canEditValidation() ? "opacity-60" : ""}`}
                          disabled={!canEditValidation()}
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
                      disabled={!canEditValidation()}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File (optional)</Label>
                    <div className="relative">
                      <Upload className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="pl-10"
                        disabled={!canEditValidation()}
                      />
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
                    Each role can only edit their own section. Check the box for completed items, add your name, and
                    provide comments.
                  </CardDescription>
                </CardHeader>

                {/* Use the RoleBasedCheckin component */}
                <RoleBasedCheckin
                  checkinData={checkinData}
                  setCheckinData={setCheckinData}
                  readOnly={false}
                  showTitle={false}
                />

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
