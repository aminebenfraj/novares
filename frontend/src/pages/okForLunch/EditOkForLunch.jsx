"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getOkForLunchById, updateOkForLunch } from "../../apis/okForLunch"
import { getCheckins } from "../../apis/checkIn"
import { useToast } from "@/hooks/use-toast"
import MainLayout from "@/components/MainLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, CalendarIcon, CheckCircle, ArrowLeft, Save, XCircle, Edit } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

function EditOkForLunch() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [okForLunchData, setOkForLunchData] = useState({
    check: false,
    date: new Date(),
    checkin: null,
  })
  const [checkinData, setCheckinData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [checkins, setCheckins] = useState([])
  const [loadingCheckins, setLoadingCheckins] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all checkins for the dropdown
        const checkinsResponse = await getCheckins()
        setCheckins(checkinsResponse.data)
        setLoadingCheckins(false)

        // Fetch the specific OkForLunch record
        const response = await getOkForLunchById(id)

        if (!response || typeof response !== "object") {
          throw new Error("Invalid API response")
        }

        const data = response

        // Set OkForLunch data
        setOkForLunchData({
          check: data.check || false,
          date: data.date ? new Date(data.date) : new Date(),
          checkin: data.checkin?._id || data.checkin,
        })

        // Extract checkin data
        if (data.checkin && typeof data.checkin === "object") {
          const checkinFields = {}
          roleFields.forEach((field) => {
            checkinFields[field.id] = {
              value: data.checkin[field.id]?.value || false,
              comment: data.checkin[field.id]?.comment || "",
              date: data.checkin[field.id]?.date ? new Date(data.checkin[field.id].date) : new Date(),
              name: data.checkin[field.id]?.name || "",
            }
          })
          setCheckinData(checkinFields)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to fetch data")
        toast({
          title: "Error",
          description: "Failed to fetch OK for Lunch or Check-in data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, toast])

  const handleOkForLunchChange = (key, value) => {
    setOkForLunchData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCheckinChange = (fieldId, key, value) => {
    setCheckinData((prev) => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        [key]: value,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Prepare the data for submission
      const formData = {
        check: okForLunchData.check,
        date: okForLunchData.date ? format(okForLunchData.date, "yyyy-MM-dd") : null,
        checkin: okForLunchData.checkin,
      }

      // Update the OkForLunch record
      await updateOkForLunch(id, formData)

      toast({
        title: "Success",
        description: "OK for Lunch updated successfully!",
      })

      navigate("/okforlunch")
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "Failed to update OK for Lunch",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCompletionStatus = (checkin) => {
    if (!checkin) return "0%"

    const fields = roleFields.map((field) => field.id)
    const completedFields = fields.filter((field) => checkin[field]?.value === true).length
    const percentage = Math.round((completedFields / fields.length) * 100)

    return `${percentage}%`
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

  if (error) {
    return (
      <MainLayout>
        <div className="container px-4 py-8 mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>Failed to load OK for Lunch data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">{error}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/okforlunch")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to OK for Lunch
              </Button>
            </CardFooter>
          </Card>
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
          <Button variant="ghost" className="mr-4" onClick={() => navigate("/okforlunch")}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit OK for Lunch</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>OK for Lunch Details</CardTitle>
            <CardDescription>Update the OK for Lunch approval and its associated check-in</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="details">OK for Lunch Details</TabsTrigger>
                <TabsTrigger value="checkin">Associated Check-in</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="checkin">Associated Check-in</Label>
                    <Select
                      value={okForLunchData.checkin}
                      onValueChange={(value) => handleOkForLunchChange("checkin", value)}
                      disabled={loadingCheckins}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loadingCheckins ? "Loading check-ins..." : "Select a check-in"} />
                      </SelectTrigger>
                      <SelectContent>
                        {checkins.map((checkin) => (
                          <SelectItem key={checkin._id} value={checkin._id}>
                            ID: {checkin._id.substring(0, 8)}...
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="check"
                      checked={okForLunchData.check}
                      onCheckedChange={(value) => handleOkForLunchChange("check", value === true)}
                    />
                    <Label htmlFor="check" className="text-sm font-medium">
                      Approve Lunch
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
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

                  <div className="flex justify-end">
                    <Button type="submit" className="flex items-center gap-2" disabled={submitting}>
                      {submitting ? (
                        <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      {submitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="checkin">
                <div className="space-y-4">
                  <div className="p-4 mb-4 rounded-md bg-gray-50">
                    <p className="text-sm text-gray-500">
                      This section shows the details of the associated check-in. To modify these values, please go to
                      the Check-in edit page.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {roleFields.map((field) => (
                      <Card key={field.id} className="overflow-hidden">
                        <CardHeader className="p-4 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">{field.label}</CardTitle>
                            {checkinData[field.id]?.value ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 text-sm">
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Name:</span>{" "}
                              {checkinData[field.id]?.name || "Not specified"}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span>{" "}
                              {checkinData[field.id]?.date ? formatDate(checkinData[field.id].date) : "Not specified"}
                            </div>
                            <div>
                              <span className="font-medium">Comment:</span>{" "}
                              <p className="mt-1 text-gray-600">
                                {checkinData[field.id]?.comment || "No comment provided"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/checkin/edit/${okForLunchData.checkin}`)}
                      className="flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit Check-in
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default EditOkForLunch
