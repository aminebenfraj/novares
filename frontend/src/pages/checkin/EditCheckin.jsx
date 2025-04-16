"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getCheckinById, updateCheckin }  from "../../apis/checkIn"
import MainLayout from "@/components/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Calendar } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

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

function CheckinEdit() {
  const [formData, setFormData] = useState(
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchCheckin()
  }, [id])

  const fetchCheckin = async () => {
    try {
      setLoading(true)
      const response = await getCheckinById(id)
      setFormData(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch check-in details",
        variant: "destructive",
      })
      console.error("Error fetching check-in:", error)
      navigate("/checkins")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckboxChange = (fieldId) => {
    setFormData({
      ...formData,
      [fieldId]: {
        ...formData[fieldId],
        value: !formData[fieldId].value,
        // Update date to current time when checked and was previously unchecked
        date: !formData[fieldId].value ? new Date().toISOString() : formData[fieldId].date,
      },
    })
  }

  const handleCommentChange = (fieldId, value) => {
    setFormData({
      ...formData,
      [fieldId]: {
        ...formData[fieldId],
        comment: value,
      },
    })
  }

  const handleNameChange = (fieldId, value) => {
    setFormData({
      ...formData,
      [fieldId]: {
        ...formData[fieldId],
        name: value,
      },
    })
  }

  const handleDateChange = (fieldId, date) => {
    setFormData({
      ...formData,
      [fieldId]: {
        ...formData[fieldId],
        date: date.toISOString(),
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateCheckin(id, formData)
      toast({
        title: "Success",
        description: "Check-in updated successfully",
      })
      navigate("/checkins")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update check-in",
        variant: "destructive",
      })
      console.error("Error updating check-in:", error)
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
          <Button variant="ghost" className="mr-4" onClick={() => navigate("/checkins")}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Check-in</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Check-in Details</CardTitle>
              <CardDescription>
                Update the details for this check-in. Check the box for completed items, update the name and date, and
                modify comments as needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {Array(12)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="p-4 space-y-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-4 h-4 rounded" />
                          <Skeleton className="w-40 h-4" />
                        </div>
                        <Skeleton className="w-full h-8" />
                        <Skeleton className="w-full h-24" />
                      </div>
                    ))}
                </div>
              ) : (
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
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start mb-3 space-x-3">
                        <Checkbox
                          id={`${field.id}-checkbox`}
                          checked={formData[field.id]?.value || false}
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
                          value={formData[field.id]?.name || ""}
                          onChange={(e) => handleNameChange(field.id, e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>

                      <div className="mb-3">
                        <Label className="block mb-1 text-xs text-gray-500">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="justify-start w-full h-8 text-sm font-normal text-left"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              {formData[field.id]?.date ? formatDate(formData[field.id].date) : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={formData[field.id]?.date ? new Date(formData[field.id].date) : undefined}
                              onSelect={(date) => date && handleDateChange(field.id, date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <Label htmlFor={`${field.id}-comment`} className="block mb-1 text-xs text-gray-500">
                        Comments
                      </Label>
                      <Textarea
                        id={`${field.id}-comment`}
                        placeholder="Add comments here..."
                        value={formData[field.id]?.comment || ""}
                        onChange={(e) => handleCommentChange(field.id, e.target.value)}
                        className="h-20 text-sm"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <div className="flex justify-end mt-6">
                <Button type="submit" className="flex items-center gap-2" disabled={loading || saving}>
                  {saving ? (
                    <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? "Saving..." : "Update Check-in"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </MainLayout>
  )
}

export default CheckinEdit
