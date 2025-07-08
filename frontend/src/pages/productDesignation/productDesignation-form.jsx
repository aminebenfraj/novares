"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import MainLayout from "@/components/MainLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createPD } from "../../apis/ProductDesignation-api"
import { FileText, Sparkles, Loader2, Hash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const CreateProductDesignation = () => {
  const [partName, setPartName] = useState("")
  const [reference, setReference] = useState("")
  const [partNameError, setPartNameError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const validateForm = () => {
    if (!partName.trim()) {
      setPartNameError("Part name is required")
      return false
    }

    if (partName.trim().length < 2) {
      setPartNameError("Part name must be at least 2 characters")
      return false
    }

    setPartNameError("")
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await createPD({
        part_name: partName.trim(),
        reference: reference.trim() || null,
      })

      if (response && response.error) {
        throw new Error(response.message || "Failed to create product designation")
      }

      toast({
        title: "Success",
        description: "Product designation created successfully!",
      })
      setTimeout(() => navigate("/pd"), 1000)
    } catch (error) {
      console.error("Failed to create product designation:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create product designation. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <Toaster />
      <div className="container py-8 mx-auto">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-zinc-200 dark:border-zinc-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Create Product Designation
              </CardTitle>
              <CardDescription>Add a new product designation to the system</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="part_name" className={partNameError ? "text-red-500" : ""}>
                    Part Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <FileText
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        partNameError ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    />
                    <Input
                      id="part_name"
                      type="text"
                      value={partName}
                      onChange={(e) => {
                        setPartName(e.target.value)
                        if (partNameError) setPartNameError("")
                      }}
                      className={`w-full pl-10 ${partNameError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      placeholder="Enter part name"
                    />
                  </div>
                  {partNameError && <p className="mt-1 text-sm text-red-500">{partNameError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Reference</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    <Input
                      id="reference"
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full pl-10"
                      placeholder="Enter reference number (optional)"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="button" variant="outline" onClick={() => navigate("/pd")}>
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Product
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

export default CreateProductDesignation
