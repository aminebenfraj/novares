"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { createValidationForOffer } from "@/apis/validationForOfferApi" // ✅ Ensure API function exists
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Loader2, CheckCircle, CalendarIcon, Upload } from "lucide-react"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"

const CreateValidationForOffer = () => {
  const [name, setName] = useState("")
  const [check, setCheck] = useState(false)
  const [date, setDate] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData()
    formData.append("name", name)
    formData.append("check", check)
    formData.append("date", date ? format(date, "yyyy-MM-dd") : "")
    if (file) formData.append("upload", file)

    try {
      await createValidationForOffer(formData)
      toast({
        title: "Success",
        description: "ValidationForOffer Created!",
      })
      navigate("/validationforoffer")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ValidationForOffer",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  }

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
  }

  return (
    <div>
      <Navbar />
      <motion.div initial="hidden" animate="visible" variants={formVariants} className="container p-6 mx-auto">
        <Card className="max-w-lg mx-auto shadow-lg">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">Create ValidationForOffer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="mt-4 space-y-6">
              {/* Name Input */}
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Offer Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter offer name" />
              </motion.div>

              {/* Checkbox */}
              <motion.div variants={inputVariants} className="flex items-center space-x-2">
                <Checkbox id="check" checked={check} onCheckedChange={(value) => setCheck(value)} />
                <Label htmlFor="check" className="text-sm font-medium text-gray-700">
                  Approve Offer
                </Label>
              </motion.div>

              {/* Date Picker */}
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-gray-700">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </motion.div>

              {/* File Upload */}
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium text-gray-700">Upload File (optional)</Label>
                <div className="relative">
                  <Upload className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input id="file" type="file" onChange={(e) => setFile(e.target.files[0])} className="pl-10" />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={inputVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-600" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      <ContactUs />
    </div>
  )
}

export default CreateValidationForOffer
