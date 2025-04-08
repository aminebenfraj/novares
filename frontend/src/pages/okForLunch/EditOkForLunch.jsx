"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getOkForLunchById, updateOkForLunch } from "@/apis/okForLunch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CalendarIcon, CheckCircle, ArrowLeft, Save, XCircle } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Define field config for better UI
const fieldConfig = {}
CHECKIN_FIELDS.forEach((field) => {
  fieldConfig[field] = {
    label: field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: `Approval from ${field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
  }
})

const EditOkForLunch = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [okForLunchData, setOkForLunchData] = useState({
    check: false,
    date: null,
  })
  const [checkinData, setCheckinData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState(CHECKIN_FIELDS[0])
  const [massProductionId, setMassProductionId] = useState(null)

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
  }, [id, toast])

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const mpId = queryParams.get("massProductionId")
    console.log("Extracted massProductionId from URL:", mpId)
    if (mpId) {
      setMassProductionId(mpId)
    }
  }, [])

  const handleOkForLunchChange = (key, value) => {
    setOkForLunchData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCheckinChange = (key, checked) => {
    setCheckinData((prev) => {
      const updatedCheckin = { ...prev, [key]: checked }
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
        checkin: { ...checkinData },
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

      // Navigate back to mass production details page if massProductionId is available
      if (massProductionId) {
        navigate(`/masspd/detail/${massProductionId}`)
      } else {
        navigate("/okforlunch")
      }
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
            <CardDescription>Failed to load OkForLunch data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/okforlunch")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to OkForLunch
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
                    navigate("/okforlunch")
                  }
                }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit OK for Launch</h1>
                <p className="text-muted-foreground">Update launch approval details</p>
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
                      <TabsTrigger value="details">Launch Details</TabsTrigger>
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
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="check"
                              checked={okForLunchData.check}
                              onCheckedChange={(checked) => handleOkForLunchChange("check", checked === true)}
                            />
                            <Label htmlFor="check" className="text-base font-medium">
                              Approve Launch
                            </Label>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="date">Launch Date</Label>
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
                        navigate("/okforlunch")
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

export default EditOkForLunch
