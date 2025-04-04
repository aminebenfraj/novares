"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, Save, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getProductProcessesById, updateProductProcesses } from "../../../apis/readiness/productProcessesApi"
import { getAllReadiness } from "../../../apis/readiness/readinessApi"

// Define the field labels and descriptions for better UI
const fieldConfig = {
  technicalReview: {
    label: "Technical Review",
    description: "Technical review of the product design and specifications",
  },
  dfmea: {
    label: "DFMEA",
    description: "Design Failure Mode and Effects Analysis",
  },
  pfmea: {
    label: "PFMEA",
    description: "Process Failure Mode and Effects Analysis",
  },
  injectionTools: {
    label: "Injection Tools",
    description: "Injection molding tools and equipment",
  },
  paintingProcess: {
    label: "Painting Process",
    description: "Painting process and equipment",
  },
  assyMachine: {
    label: "Assembly Machine",
    description: "Assembly machines and equipment",
  },
  checkingFixture: {
    label: "Checking Fixture",
    description: "Checking fixtures and quality control equipment",
  },
  industrialCapacity: {
    label: "Industrial Capacity",
    description: "Industrial capacity and production capabilities",
  },
  skillsDeployment: {
    label: "Skills Deployment",
    description: "Skills deployment and training",
  },
}

// Define the validation field labels
const validationFieldLabels = {
  tko: "TKO",
  ot: "OT",
  ot_op: "OT OP",
  is: "IS",
  sop: "SOP",
  ok_nok: "Status",
  who: "Responsible Person",
  when: "Date",
  validation_check: "Validation Check",
  comment: "Comments",
}

function EditProductProcessPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("technicalReview")
  const [productProcess, setProductProcess] = useState(null)
  const [readinessId, setReadinessId] = useState(null)

  // Add useEffect to extract readinessId from URL query parameters after the existing useState declarations
  useEffect(() => {
    // Get the readinessId from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search)
    const id = queryParams.get("readinessId")
    console.log("Extracted readinessId from URL:", id)
    setReadinessId(id)
  }, [])

  // Fetch product process data
  const fetchProductProcess = async () => {
    try {
      setIsLoading(true)
      const data = await getProductProcessesById(params.id)
      setProductProcess(data)

      // Extract readinessId from the product process object
      console.log("Product process data:", data)
      console.log("Product Process ID:", params.id)
      console.log("Extracting readiness ID from product process data...")

      let extractedReadinessId = null

      // Check for possible readiness reference fields
      if (data._readinessId) {
        extractedReadinessId = typeof data._readinessId === "object" ? data._readinessId._id : data._readinessId
        console.log("Found readinessId in _readinessId:", extractedReadinessId)
      } else if (data.readinessId) {
        extractedReadinessId = typeof data.readinessId === "object" ? data.readinessId._id : data.readinessId
        console.log("Found readinessId in readinessId:", extractedReadinessId)
      } else if (data.readiness) {
        extractedReadinessId = typeof data.readiness === "object" ? data.readiness._id : data.readiness
        console.log("Found readinessId in readiness:", extractedReadinessId)
      } else if (data.Readiness) {
        extractedReadinessId = typeof data.Readiness === "object" ? data.Readiness._id : data.Readiness
        console.log("Found readinessId in Readiness:", extractedReadinessId)
      } else {
        console.log("No direct readinessId reference found in data object")

        // Try to extract from ID format (if ID follows pattern readinessId-entityId)
        const idParts = params.id.split("-")
        if (idParts.length > 1) {
          extractedReadinessId = idParts[0]
          console.log("Extracted potential readinessId from ID format:", extractedReadinessId)
        }
      }

      // If we found a readiness ID, set it
      if (extractedReadinessId) {
        console.log("FINAL EXTRACTED READINESS ID:", extractedReadinessId)
        setReadinessId(extractedReadinessId)
      } else {
        console.log("WARNING: Could not extract readiness ID from product process data")
      }

      // Additional debugging - log all keys in the data object
      console.log("All keys in product process data:", Object.keys(data))

      // Check if there are any keys that might contain "readiness"
      const potentialReadinessKeys = Object.keys(data).filter(
        (key) =>
          key.toLowerCase().includes("readiness") ||
          (typeof data[key] === "object" && data[key] !== null && data[key]._id),
      )

      if (potentialReadinessKeys.length > 0) {
        console.log("Potential readiness reference keys:", potentialReadinessKeys)
        potentialReadinessKeys.forEach((key) => {
          console.log(`Key ${key} value:`, data[key])
        })
      }
    } catch (error) {
      console.error("Error fetching product process:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product process data",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchProductProcess()
    }
  }, [params.id, toast])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    console.log("Submitting product process with readiness ID:", readinessId || "unknown")

    try {
      await updateProductProcesses(params.id, productProcess)

      toast({
        title: "Success",
        description: "Product process updated successfully",
      })

      // Navigate back to readiness details page if readinessId is available
      if (readinessId) {
        console.log("Navigating to readiness detail:", readinessId)
        navigate(`/readiness/detail/${readinessId}`)
      } else {
        // If we couldn't extract the readinessId, try to get it from the API response
        try {
          // Make an API call to get all readiness entries
          const readinessEntries = await getAllReadiness()

          // Find the readiness entry that references this product process
          const readinessEntry = readinessEntries.find(
            (entry) =>
              entry.ProductProcesses === params.id ||
              (entry.ProductProcesses && entry.ProductProcesses._id === params.id),
          )

          if (readinessEntry) {
            console.log("Found readiness entry:", readinessEntry)
            navigate(`/readiness/detail/${readinessEntry._id}`)
            return
          }
        } catch (error) {
          console.error("Error finding readiness entry:", error)
        }

        // Fallback to product process details page if readinessId is not available
        console.log("No readinessId found, navigating to product process detail")
        navigate(`/product-process/${params.id}`)
      }
    } catch (error) {
      console.error("Error updating product process:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product process",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle field value change
  const handleValueChange = (field, value) => {
    setProductProcess((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
      },
    }))
  }

  // Handle validation field change
  const handleValidationChange = (field, validationField, value) => {
    setProductProcess((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        details: {
          ...prev[field].details,
          [validationField]: value,
        },
      },
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!productProcess) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Product process not found</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/product-process")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Product Process
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (readinessId) {
                  console.log("Back button: Navigating to readiness detail:", readinessId)
                  navigate(`/readiness/detail/${readinessId}`)
                } else {
                  navigate(`/product-process/${params.id}`)
                }
              }}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Product Process</h1>
              <p className="text-muted-foreground">Update product process details and validation information</p>
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Product Process Fields</CardTitle>
                <CardDescription>Select a field to edit</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                  <TabsList className="flex flex-col items-stretch h-auto">
                    {Object.keys(fieldConfig).map((field) => (
                      <TabsTrigger key={field} value={field} className="relative justify-start mb-1 text-left pl-9">
                        <span className="absolute left-2">
                          {productProcess[field]?.value ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </span>
                        {fieldConfig[field].label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>{fieldConfig[activeTab].label}</CardTitle>
                <CardDescription>{fieldConfig[activeTab].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="status" className="w-full">
                  <TabsList>
                    <TabsTrigger value="status">Status</TabsTrigger>
                    <TabsTrigger value="validation">Validation Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="status" className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`${activeTab}-value`}
                        checked={productProcess[activeTab]?.value || false}
                        onCheckedChange={(checked) => handleValueChange(activeTab, checked === true)}
                      />
                      <Label htmlFor={`${activeTab}-value`}>Mark as completed</Label>
                    </div>
                  </TabsContent>
                  <TabsContent value="validation" className="pt-4 space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-tko`}>TKO</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${activeTab}-tko`}
                              checked={productProcess[activeTab]?.details?.tko || false}
                              onCheckedChange={(checked) => handleValidationChange(activeTab, "tko", checked === true)}
                            />
                            <Label htmlFor={`${activeTab}-tko`}>Completed</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-ot`}>OT</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${activeTab}-ot`}
                              checked={productProcess[activeTab]?.details?.ot || false}
                              onCheckedChange={(checked) => handleValidationChange(activeTab, "ot", checked === true)}
                            />
                            <Label htmlFor={`${activeTab}-ot`}>Completed</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-ot_op`}>OT OP</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${activeTab}-ot_op`}
                              checked={productProcess[activeTab]?.details?.ot_op || false}
                              onCheckedChange={(checked) =>
                                handleValidationChange(activeTab, "ot_op", checked === true)
                              }
                            />
                            <Label htmlFor={`${activeTab}-ot_op`}>Completed</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-is`}>IS</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${activeTab}-is`}
                              checked={productProcess[activeTab]?.details?.is || false}
                              onCheckedChange={(checked) => handleValidationChange(activeTab, "is", checked === true)}
                            />
                            <Label htmlFor={`${activeTab}-is`}>Completed</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-sop`}>SOP</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${activeTab}-sop`}
                              checked={productProcess[activeTab]?.details?.sop || false}
                              onCheckedChange={(checked) => handleValidationChange(activeTab, "sop", checked === true)}
                            />
                            <Label htmlFor={`${activeTab}-sop`}>Completed</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-validation_check`}>Validation Check</Label>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${activeTab}-validation_check`}
                              checked={productProcess[activeTab]?.details?.validation_check || false}
                              onCheckedChange={(checked) =>
                                handleValidationChange(activeTab, "validation_check", checked === true)
                              }
                            />
                            <Label htmlFor={`${activeTab}-validation_check`}>Completed</Label>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-ok_nok`}>Status</Label>
                          <RadioGroup
                            value={productProcess[activeTab]?.details?.ok_nok || ""}
                            onValueChange={(value) => handleValidationChange(activeTab, "ok_nok", value)}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="OK" id={`${activeTab}-ok`} />
                              <Label htmlFor={`${activeTab}-ok`}>OK</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="NOK" id={`${activeTab}-nok`} />
                              <Label htmlFor={`${activeTab}-nok`}>NOK</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="" id={`${activeTab}-none`} />
                              <Label htmlFor={`${activeTab}-none`}>Not Set</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-who`}>Responsible Person</Label>
                            <Input
                              id={`${activeTab}-who`}
                              value={productProcess[activeTab]?.details?.who || ""}
                              onChange={(e) => handleValidationChange(activeTab, "who", e.target.value)}
                              placeholder="Enter name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-when`}>Date</Label>
                            <Input
                              id={`${activeTab}-when`}
                              value={productProcess[activeTab]?.details?.when || ""}
                              onChange={(e) => handleValidationChange(activeTab, "when", e.target.value)}
                              placeholder="YYYY-MM-DD"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-comment`}>Comments</Label>
                          <Textarea
                            id={`${activeTab}-comment`}
                            value={productProcess[activeTab]?.details?.comment || ""}
                            onChange={(e) => handleValidationChange(activeTab, "comment", e.target.value)}
                            placeholder="Add any additional comments here"
                            rows={4}
                          />
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
                    if (readinessId) {
                      console.log("Cancel button: Navigating to readiness detail:", readinessId)
                      navigate(`/readiness/detail/${readinessId}`)
                    } else {
                      navigate(`/product-process/${params.id}`)
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default EditProductProcessPage

