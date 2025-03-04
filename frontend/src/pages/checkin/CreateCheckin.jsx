"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createCheckin } from "../../apis/checkIn"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"

const initialCheckinState = {
  project_manager: false,
  business_manager: false,
  engineering_leader_manager: false,
  quality_leader: false,
  plant_quality_leader: false,
  industrial_engineering: false,
  launch_manager_method: false,
  maintenance: false,
  purchasing: false,
  logistics: false,
  sales: false,
  economic_financial_leader: false,
}

const CreateCheckin = () => {
  const [formData, setFormData] = useState(initialCheckinState)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleChange = (field, checked) => {
    setFormData((prev) => ({ ...prev, [field]: checked }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createCheckin(formData)
      toast({
        title: "Success",
        description: "Check-in created successfully",
      })
      navigate("/checkins")
    } catch (error) {
      toast({
        title: "Error creating check-in",
        description: error.message || "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/checkins")} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
          <h1 className="text-3xl font-bold">Create Check-in</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>New Check-in</CardTitle>
            <CardDescription>Select all the roles that have been checked in for this project</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Object.keys(formData).map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={formData[field]}
                      onCheckedChange={(checked) => handleChange(field, checked)}
                    />
                    <Label
                      htmlFor={field}
                      className="text-sm font-medium leading-none capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {field.replace(/_/g, " ")}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-6 border-t">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Check-in"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <ContactUs />
    </div>
  )
}

export default CreateCheckin

