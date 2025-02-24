"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getDesignById, updateDesign } from "../../apis/designApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Upload, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"

const designFields = [
  "Validation_of_the_validation",
  "Modification_of_bought_product",
  "Modification_of_tolerance",
  "Modification_of_checking_fixtures",
  "Modification_of_Product_FMEA",
  "Modification_of_part_list_form",
  "Modification_of_control_plan",
  "Modification_of_Process_FMEA",
  "Modification_of_production_facilities",
  "Modification_of_tools",
  "Modification_of_packaging",
  "Modification_of_information_system",
  "Updating_of_drawings",
]

const EditDesign = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState(() => {
    const initialState = {}
    designFields.forEach((field) => {
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
      fetchDesign()
    }
  }, [id])

  const fetchDesign = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getDesignById(id)
      if (!data) {
        throw new Error("Design data not found.")
      }

      const fetchedData = { ...formData }
      designFields.forEach((field) => {
        fetchedData[field] = {
          value: data[field]?.value || false,
          task: { ...data[field]?.task },
        }
      })
      setFormData(fetchedData)
    } catch (error) {
      console.error("Error fetching Design data:", error)
      setError(error.message)
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

    const submissionData = { ...formData }

    Object.keys(submissionData).forEach((field) => {
      if (submissionData[field].task.filePath instanceof File) {
        submissionData[field].task.filePath = submissionData[field].task.filePath.name
      }
    })

    try {
      await updateDesign(id, submissionData)
      navigate("/")
    } catch (error) {
      console.error("Error updating Design:", error)
      setError("Failed to update Design. Please try again.")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container p-6 mx-auto"
      >
        <Card className="max-w-4xl mx-auto bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">Edit Design</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                {designFields.map((field, index) => (
                  <AccordionItem key={field} value={field}>
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={field}
                          checked={formData[field]?.value}
                          onCheckedChange={(checked) => handleCheckboxChange(field, checked)}
                        />
                        <Label htmlFor={field} className="text-left">
                          {field.replace(/_/g, " ")}
                        </Label>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-responsible`}>Responsible</Label>
                          <Input
                            id={`${field}-responsible`}
                            type="text"
                            value={formData[field]?.task.responsible || ""}
                            onChange={(e) => handleTaskChange(e, field, "responsible")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-planned`}>Planned Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={`w-full justify-start text-left font-normal ${
                                  !formData[field]?.task.planned && "text-muted-foreground"
                                }`}
                              >
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {formData[field]?.task.planned ? (
                                  format(new Date(formData[field]?.task.planned), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  formData[field]?.task.planned ? new Date(formData[field]?.task.planned) : undefined
                                }
                                onSelect={(date) => handleDateChange(field, "planned", date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-done`}>Completion Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={`w-full justify-start text-left font-normal ${
                                  !formData[field]?.task.done && "text-muted-foreground"
                                }`}
                              >
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {formData[field]?.task.done ? (
                                  format(new Date(formData[field]?.task.done), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={formData[field]?.task.done ? new Date(formData[field]?.task.done) : undefined}
                                onSelect={(date) => handleDateChange(field, "done", date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`${field}-comments`}>Comments</Label>
                          <Textarea
                            id={`${field}-comments`}
                            value={formData[field]?.task.comments || ""}
                            onChange={(e) => handleTaskChange(e, field, "comments")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-file`}>Upload File</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id={`${field}-file`}
                              type="file"
                              onChange={(e) => handleFileChange(e, field)}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById(`${field}-file`).click()}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                            <span className="text-sm text-gray-500">
                              {formData[field]?.task.filePath?.name || "No file chosen"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${field}-check`}
                            checked={formData[field]?.task.check || false}
                            onCheckedChange={(checked) => handleTaskChange({ target: { checked } }, field, "check")}
                          />
                          <Label htmlFor={`${field}-check`}>Mark as Completed</Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button type="submit" className="w-full text-white bg-green-600 hover:bg-green-700">
                Update Design
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <ContactUs />
    </div>
  )
}

export default EditDesign

