"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCheckinById, updateCheckin } from "../../apis/checkIn"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"

const EditCheckin = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCheckin = async () => {
      try {
        setLoading(true)
        const res = await getCheckinById(id)
        setFormData(res.data)
      } catch (error) {
        toast({
          title: "Error fetching check-in",
          description: "Could not load check-in data",
          variant: "destructive",
        })
        navigate("/checkins")
      } finally {
        setLoading(false)
      }
    }

    fetchCheckin()
  }, [id, navigate, toast])

  const handleChange = (field, checked) => {
    setFormData((prev) => ({ ...prev, [field]: checked }))
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
        title: "Error updating check-in",
        description: error.message || "Please try again later",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex items-center justify-center py-8 mx-auto">
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="mt-4 text-lg">Loading check-in data...</p>
          </div>
        </div>
        <ContactUs />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/checkins")} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
          <h1 className="text-3xl font-bold">Edit Check-in</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Check-in</CardTitle>
            <CardDescription>Update the roles that have been checked in for this project</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {formData &&
                  Object.keys(formData)
                    .filter((key) => !["_id", "__v", "createdAt", "updatedAt"].includes(key))
                    .map((field) => (
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
            <CardFooter className="flex justify-between p-6 border-t">
              <Button variant="outline" onClick={() => navigate("/checkins")}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
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

export default EditCheckin

