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
import { getSuppById, updateSupp } from "../../../apis/readiness/suppApi"

// Define the field labels and descriptions for better UI
const fieldConfig = {
  componentsRawMaterialAvailable: {
    label: "Components & Raw Materials Available",
    description: "Components and raw materials are available for production",
  },
  packagingDefined: {
    label: "Packaging Defined",
    description: "Packaging requirements and specifications are defined",
  },
  partsAccepted: {
    label: "Parts Accepted",
    description: "Parts have been accepted and meet quality standards",
  },
  purchasingRedFilesTransferred: {
    label: "Purchasing Red Files Transferred",
    description: "Purchasing red files have been transferred to the appropriate departments",
  },
  automaticProcurementEnabled: {
    label: "Automatic Procurement Enabled",
    description: "Automatic procurement systems are enabled and operational",
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

function EditSuppPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("componentsRawMaterialAvailable")
  const [supp, setSupp] = useState(null)

  // Fetch supp data
  useEffect(() => {
    const fetchSupp = async () => {
      try {
        setIsLoading(true)
        const data = await getSuppById(params.id)
        setSupp(data)
      } catch (error) {
        console.error("Error fetching supply record:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load supply data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchSupp()
    }
  }, [params.id, toast])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateSupp(params.id, supp)

      toast({
        title: "Success",
        description: "Supply record updated successfully",
      })

      // Navigate back to supp details page
      navigate(`/supply/edit/${params.id}`)
    } catch (error) {
      console.error("Error updating supply record:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update supply record",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle field value change
  const handleValueChange = (field, value) => {
    setSupp((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
      },
    }))
  }

  // Handle validation field change
  const handleValidationChange = (field, validationField, value) => {
    setSupp((prev) => ({
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

  if (!supp) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Supply record not found</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/supply")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Supply Records
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
            <Button variant="outline" size="icon" onClick={() => navigate(`/supply/edit/${params.id}`)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Supply Record</h1>
              <p className="text-muted-foreground">Update supply chain and procurement details</p>
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
                <CardTitle>Supply Fields</CardTitle>
                <CardDescription>Select a field to edit</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                  <TabsList className="flex flex-col items-stretch h-auto">
                    {Object.keys(fieldConfig).map((field) => (
                      <TabsTrigger key={field} value={field} className="relative justify-start mb-1 text-left pl-9">
                        <span className="absolute left-2">
                          {supp[field]?.value ? (
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
                        checked={supp[activeTab]?.value || false}
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
                              checked={supp[activeTab]?.details?.tko || false}
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
                              checked={supp[activeTab]?.details?.ot || false}
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
                              checked={supp[activeTab]?.details?.ot_op || false}
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
                              checked={supp[activeTab]?.details?.is || false}
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
                              checked={supp[activeTab]?.details?.sop || false}
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
                              checked={supp[activeTab]?.details?.validation_check || false}
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
                            value={supp[activeTab]?.details?.ok_nok || ""}
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
                              value={supp[activeTab]?.details?.who || ""}
                              onChange={(e) => handleValidationChange(activeTab, "who", e.target.value)}
                              placeholder="Enter name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-when`}>Date</Label>
                            <Input
                              id={`${activeTab}-when`}
                              value={supp[activeTab]?.details?.when || ""}
                              onChange={(e) => handleValidationChange(activeTab, "when", e.target.value)}
                              placeholder="YYYY-MM-DD"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-comment`}>Comments</Label>
                          <Textarea
                            id={`${activeTab}-comment`}
                            value={supp[activeTab]?.details?.comment || ""}
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
                <Button variant="outline" onClick={() => navigate(`/supply/${params.id}`)}>
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

export default EditSuppPage

