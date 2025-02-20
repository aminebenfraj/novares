"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getOkForLunchById, updateOkForLunch } from "@/apis/okForLunch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Loader2, CalendarIcon, CheckCircle, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"
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

const EditOkForLunch = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [okForLunchData, setOkForLunchData] = useState({
    check: false,
    date: null,
  })
  const [checkinData, setCheckinData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getOkForLunchById(id)
        console.log("API Response:", response)

        if (!response || typeof response !== "object") {
          throw new Error("Invalid API response")
        }

        const data = response
        console.log("OkForLunch Response:", data)

        // Set OkForLunch data
        setOkForLunchData({
          check: data.check || false,
          date: data.date ? new Date(data.date) : null,
        })

        // Extract checkin data from the response
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
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to fetch data")
        toast({
          title: "Error",
          description: "Failed to fetch OkForLunch or Checkin data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleOkForLunchChange = (key, value) => {
    setOkForLunchData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCheckinChange = (key) => {
    setCheckinData((prev) => {
      const updatedCheckin = { ...prev, [key]: !prev[key] }
      console.log("Updated checkin data:", updatedCheckin)
      return updatedCheckin
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formData = {
        check: okForLunchData.check,
        date: okForLunchData.date ? format(okForLunchData.date, "yyyy-MM-dd") : null,
        checkin: Object.keys(checkinData).reduce((acc, key) => {
          if (checkinData[key] === true) {
            acc[key] = true
          }
          return acc
        }, {}),
      }

      console.log("Sending data to server:", JSON.stringify(formData, null, 2))
      const updatedData = await updateOkForLunch(id, formData)

      console.log("Response from server:", updatedData)

      // Update local state with the response from the server
      setOkForLunchData({
        check: updatedData.check || false,
        date: updatedData.date ? new Date(updatedData.date) : null,
      })

      if (updatedData.checkin) {
        const updatedCheckin = CHECKIN_FIELDS.reduce((acc, field) => {
          acc[field] = !!updatedData.checkin[field]
          return acc
        }, {})
        setCheckinData(updatedCheckin)
        console.log("Updated checkin state:", updatedCheckin)
      }

      toast({
        title: "Success",
        description: "OkForLunch and Checkin Updated Successfully!",
      })
      navigate("/okforlunch")
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "Failed to update OkForLunch and Checkin",
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
        <Button onClick={() => navigate("/okforlunch")}>Go Back to List</Button>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container p-6 mx-auto">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              Edit OkForLunch & Checkin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="mt-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">OkForLunch Details</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="check"
                    checked={okForLunchData.check}
                    onCheckedChange={(value) => handleOkForLunchChange("check", value)}
                  />
                  <Label htmlFor="check" className="text-sm font-medium text-gray-700">
                    Approve Lunch
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${!okForLunchData.date && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {okForLunchData.date ? format(okForLunchData.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={okForLunchData.date}
                        onSelect={(date) => handleOkForLunchChange("date", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="mb-4 text-lg font-semibold">Checkin Details</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <AnimatePresence>
                    {CHECKIN_FIELDS.map((field) => (
                      <motion.div
                        key={field}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center p-2 space-x-2 rounded-md hover:bg-gray-50"
                      >
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
              </div>

              <Button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-600" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Update
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <ContactUs />
    </div>
  )
}

export default EditOkForLunch

