"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getValidationForOfferById, updateValidationForOffer } from "@/apis/validationForOfferApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Loader2, CalendarIcon, AlertTriangle, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import MainLayout from "@/components/MainLayout"


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

const EditValidationForOffer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [validationForOfferData, setValidationForOfferData] = useState({
    name: "",
    check: false,
    date: null,
  })
  const [checkinData, setCheckinData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [massProductionId, setMassProductionId] = useState(null)

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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getValidationForOfferById(id)
        console.log("API Response:", response)

        if (!response || typeof response !== "object") {
          throw new Error("Invalid API response")
        }

        const data = response
        console.log("ValidationForOffer Response:", data)

        // Set ValidationForOffer data
        setValidationForOfferData({
          name: data.name || "",
          check: data.check || false,
          date: data.date ? new Date(data.date) : null,
        })

        // Extract check-in data from the response
        const checkinFields = {}
        if (data.checkin && typeof data.checkin === "object") {
          CHECKIN_FIELDS.forEach((field) => {
            checkinFields[field] = data.checkin[field] || false
          })
        } else {
          CHECKIN_FIELDS.forEach((field) => {
            checkinFields[field] = false
          })
        }

        console.log("Extracted Checkin Data:", checkinFields)
        setCheckinData(checkinFields)

        // Check for possible massProduction reference fields
        if (data._massProductionId) {
          console.log("Found massProductionId in _massProductionId:", data._massProductionId)
          setMassProductionId(data._massProductionId)
        } else if (data.massProductionId) {
          console.log("Found massProductionId in massProductionId:", data.massProductionId)
          setMassProductionId(data.massProductionId)
        } else if (data.massProduction) {
          const mpRef = typeof data.massProduction === "object" ? data.massProduction._id : data.massProduction
          console.log("Found massProductionId in massProduction:", mpRef)
          setMassProductionId(mpRef)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to fetch data")
        toast({
          title: "Error",
          description: "Failed to fetch ValidationForOffer or Checkin data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleValidationForOfferChange = (key, value) => {
    setValidationForOfferData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCheckinChange = (key) => {
    setCheckinData((prev) => {
      const updatedCheckin = { ...prev, [key]: !prev[key] }
      console.log("Updated check-in data:", updatedCheckin)
      return updatedCheckin
    })
  }

  // Handle navigation back to the mass production details page
  const handleBack = () => {
    if (massProductionId && massProductionId !== "masspd_idAttachment") {
      console.log("Navigating back to mass production detail with ID:", massProductionId)
      // Ensure we're using the correct URL format
      navigate(`/masspd/detail/${massProductionId}`)
    } else {
      console.log("No valid massProductionId found, navigating to validation for offer list")
      navigate("/validationforoffer")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formData = {
        name: validationForOfferData.name,
        check: validationForOfferData.check,
        date: validationForOfferData.date ? format(validationForOfferData.date, "yyyy-MM-dd") : null,
        checkin: { ...checkinData },
      }

      console.log("Sending data to server:", JSON.stringify(formData, null, 2))
      const updatedData = await updateValidationForOffer(id, formData)

      console.log("Response from server:", updatedData)

      // Update local state with the response from the server
      setValidationForOfferData({
        name: updatedData.name || "",
        check: updatedData.check || false,
        date: updatedData.date ? new Date(updatedData.date) : null,
      })

      if (updatedData.checkin) {
        const updatedCheckin = CHECKIN_FIELDS.reduce((acc, field) => {
          acc[field] = !!updatedData.checkin[field]
          return acc
        }, {})
        setCheckinData(updatedCheckin)
        console.log("Updated check-in state:", updatedCheckin)
      }

      toast({
        title: "Success",
        description: "ValidationForOffer and Checkin Updated Successfully!",
      })

      // Navigate back to mass production details page if massProductionId is available
      handleBack()
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "Failed to update ValidationForOffer and Checkin",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Error Loading Data</h2>
        <p className="mb-4 text-gray-600">{error}</p>
        <Button onClick={handleBack}>Go Back</Button>
      </div>
    )
  }

  return (
    <div>
      <MainLayout>
      <div className="container p-6 mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Validation For Offer</h1>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              Edit ValidationForOffer & Checkin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="mt-4 space-y-6">
              <Label>Name</Label>
              <input
                type="text"
                value={validationForOfferData.name}
                onChange={(e) => handleValidationForOfferChange("name", e.target.value)}
                className="w-full p-2 border rounded"
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="check"
                  checked={validationForOfferData.check}
                  onCheckedChange={(value) => handleValidationForOfferChange("check", value)}
                />
                <Label htmlFor="check" className="text-sm font-medium text-gray-700">
                  Approve Offer
                </Label>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {validationForOfferData.date ? format(validationForOfferData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={validationForOfferData.date}
                    onSelect={(date) => handleValidationForOfferChange("date", date)}
                  />
                </PopoverContent>
              </Popover>

              <h3 className="mb-4 text-lg font-semibold">Checkin Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AnimatePresence>
                  {CHECKIN_FIELDS.map((field) => (
                    <motion.div key={field} className="flex items-center p-2 space-x-2 rounded-md hover:bg-gray-50">
                      <Checkbox
                        id={field}
                        checked={checkinData[field] || false}
                        onCheckedChange={() => handleCheckinChange(field)}
                      />
                      <Label htmlFor={field} className="text-sm font-medium text-gray-700 capitalize">
                        {field.replace(/_/g, " ")}
                      </Label>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Update"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      </MainLayout>
    </div>
  )
}

export default EditValidationForOffer
