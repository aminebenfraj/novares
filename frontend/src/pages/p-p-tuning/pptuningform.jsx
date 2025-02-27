"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createP_P_Tuning } from "../../apis/p-p-tuning-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"

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

const initialFormData = p_p_tuningFields.reduce((acc, field) => {
  acc[field] = {
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
  return acc
}, {})

const P_P_TuningForm = () => {
  const [formData, setFormData] = useState(initialFormData)
  const navigate = useNavigate()

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

    console.log("📢 Sending P_P_Tuning Data:", JSON.stringify(submissionData, null, 2))

    try {
      await createP_P_Tuning(submissionData)
      navigate("/p_p_tuning")
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container p-6 mx-auto bg-gray-50">
        <Card className="max-w-4xl mx-auto bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">Create Product Process Tuning</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                {p_p_tuningFields.map((field, index) => (
                  <AccordionItem key={field} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={field}
                          checked={formData[field].value}
                          onCheckedChange={(checked) => handleCheckboxChange(field, checked)}
                        />
                        <Label htmlFor={field} className="text-left">
                          {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                            value={formData[field].task.responsible}
                            onChange={(e) => handleTaskChange(e, field, "responsible")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-planned`}>Planned Date</Label>
                          <Input
                            id={`${field}-planned`}
                            type="date"
                            value={formData[field].task.planned}
                            onChange={(e) => handleTaskChange(e, field, "planned")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-done`}>Completion Date</Label>
                          <Input
                            id={`${field}-done`}
                            type="date"
                            value={formData[field].task.done}
                            onChange={(e) => handleTaskChange(e, field, "done")}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`${field}-comments`}>Comments</Label>
                          <Textarea
                            id={`${field}-comments`}
                            value={formData[field].task.comments}
                            onChange={(e) => handleTaskChange(e, field, "comments")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-file`}>Upload File</Label>
                          <Input id={`${field}-file`} type="file" onChange={(e) => handleFileChange(e, field)} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${field}-check`}
                            checked={formData[field].task.check}
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
                Submit Product Process Tuning
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <ContactUs />
    </div>
  )
}

export default P_P_TuningForm

