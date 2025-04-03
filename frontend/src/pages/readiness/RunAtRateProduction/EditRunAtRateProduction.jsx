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
import { getRunAtRateProductionById, updateRunAtRateProduction } from "../../../apis/readiness/runAtRateProductionApi"

// Define the field labels and descriptions for better UI
const fieldConfig = {
  qualityWallInPlace: {
    label: "Quality Wall In Place",
    description: "Quality wall is in place and operational",
  },
  selfRunRatePerformed: {
    label: "Self Run Rate Performed",
    description: "Self run rate has been performed and documented",
  },
  dimensionalInspectionsConform: {
    label: "Dimensional Inspections Conform",
    description: "Dimensional inspections conform to specifications",
  },
  rampUpDefined: {
    label: "Ramp Up Defined",
    description: "Production ramp up plan is defined",
  },
  mppAuditCompleted: {
    label: "MPP Audit Completed",
    description: "Manufacturing Process Planning audit is completed",
  },
  reversePFMEACompleted: {
    label: "Reverse PFMEA Completed",
    description: "Reverse Process Failure Mode and Effects Analysis is completed",
  },
  paceBoardFollowUp: {
    label: "Pace Board Follow Up",
    description: "Pace board follow up is implemented",
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

function EditRunAtRateProductionPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("qualityWallInPlace")
  const [runAtRate, setRunAtRate] = useState(null)

  // Fetch run-at-rate production data
  useEffect(() => {
    const fetchRunAtRate = async () => {
      try {
        setIsLoading(true)
        const data = await getRunAtRateProductionById(params.id)
        setRunAtRate(data)
      } catch (error) {
        console.error("Error fetching run-at-rate production:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load run-at-rate production data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchRunAtRate()
    }
  }, [params.id, toast])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateRunAtRateProduction(params.id, runAtRate)

      toast({
        title: "Success",
        description: "Run-at-rate production updated successfully",
      })

      // Navigate back to run-at-rate production details page
      navigate(`/run-at-rate/edit/${params.id}`)
    } catch (error) {
      console.error("Error updating run-at-rate production:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update run-at-rate production",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle field value change
  const handleValueChange = (field, value) => {
    setRunAtRate((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
      },
    }))
  }

  // Handle validation field change
  const handleValidationChange = (field, validationField, value) => {
    setRunAtRate((prev) => ({
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

  if (!runAtRate) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Run-at-rate production not found</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/run-at-rate")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Run-at-Rate
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
            <Button variant="outline" size="icon" onClick={() => navigate(`/run-at-rate/edit/${params.id}`)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Run-at-Rate Production</h1>
              <p className="text-muted-foreground">Update run-at-rate production details and validation information</p>
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
                <CardTitle>Run-at-Rate Fields</CardTitle>
                <CardDescription>Select a field to edit</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                  <TabsList className="flex flex-col items-stretch h-auto">
                    {Object.keys(fieldConfig).map((field) => (
                      <TabsTrigger key={field} value={field} className="relative justify-start mb-1 text-left pl-9">
                        <span className="absolute left-2">
                          {runAtRate[field]?.value ? (
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
                        checked={runAtRate[activeTab]?.value || false}
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
                              checked={runAtRate[activeTab]?.details?.tko || false}
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
                              checked={runAtRate[activeTab]?.details?.ot || false}
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
                              checked={runAtRate[activeTab]?.details?.ot_op || false}
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
                              checked={runAtRate[activeTab]?.details?.is || false}
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
                              checked={runAtRate[activeTab]?.details?.sop || false}
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
                              checked={runAtRate[activeTab]?.details?.validation_check || false}
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
                            value={runAtRate[activeTab]?.details?.ok_nok || ""}
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
                              value={runAtRate[activeTab]?.details?.who || ""}
                              onChange={(e) => handleValidationChange(activeTab, "who", e.target.value)}
                              placeholder="Enter name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-when`}>Date</Label>
                            <Input
                              id={`${activeTab}-when`}
                              value={runAtRate[activeTab]?.details?.when || ""}
                              onChange={(e) => handleValidationChange(activeTab, "when", e.target.value)}
                              placeholder="YYYY-MM-DD"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-comment`}>Comments</Label>
                          <Textarea
                            id={`${activeTab}-comment`}
                            value={runAtRate[activeTab]?.details?.comment || ""}
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
                <Button variant="outline" onClick={() => navigate(`/run-at-rate`)}>
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

export default EditRunAtRateProductionPage

