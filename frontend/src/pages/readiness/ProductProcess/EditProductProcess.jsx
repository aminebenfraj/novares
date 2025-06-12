"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, Save, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getProductProcessesById, updateProductProcesses } from "../../../apis/readiness/productProcessesApi"
import { getAllReadiness } from "../../../apis/readiness/readinessApi"
import MainLayout from "@/components/MainLayout"

// Define the field labels and descriptions for better UI
const fieldConfig = {
  technicalReview: {
    label: "Technical Review Product/Process with RETEX of previous/similar Product/Process",
    description: "BD-PR-A01 Technical review",
  },
  dfmea: {
    label: "DFMEA validated/approved via ENTERPROJ",
    description: "SKILL PRO",
  },
  pfmea: {
    label: "PFMEA validated /approved via ENTERPROJ",
    description: "SKILL PRO",
  },
  injectionTools: {
    label: "Injection Tools  technical specifications & official  TKO ",
    description: "BD-PD-B02",
  },
  paintingProcess: {
    label: "Painting Process specifications & Official TKO",
    description: "BD-PM-A08",
  },
  assyMachine: {
    label: "Assy Machine  general technical specifications & official  TKO ",
    description: "BD-PD-E02",
  },
  checkingFixture: {
    label: " Checking Fixture general technical specifications & official  TKO ",
    description: "BD-PD-A02",
  },
  industrialCapacity: {
    label: "Industrial Capacity validated acc. SMART MAC POWER ",
    description: "BD-PI-F03",
  },
  skillsDeployment: {
    label: "Skills deployment for Support Function if new technologies Product and/or Process",
    description: "TD-HR-K01",
  },
}

// Define the validation field labels
const validationFieldLabels = {
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

  
  // Fetch product process data
  const fetchProductProcess = async () => {
    try {
      setIsLoading(true)
      const data = await getProductProcessesById(params.id)
      setProductProcess(data)
      console.log("Product process data loaded successfully:", data)
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
  }, [params.id])

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setIsSaving(true)

    try {
      await updateProductProcesses(params.id, productProcess)

      toast({
        title: "Success",
        description: "Product process updated successfully",
      })

      // Navigate back to readiness details page if readinessId is available
      
        navigate(`/readiness/detail/${params.readinessId}`)
     
    } catch (error) {
      console.error("Error updating product process:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product process",
      })
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
            <Button
              onClick={() => {
                
                  navigate(`/readiness/detail/${params.readinessId}`)
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {readinessId ? "Back to Readiness" : "Back to Product Processes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <MainLayout>
    <div className="container px-4 py-8 mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
               
                  navigate(`/readiness/detail/${params.readinessId}`)
              }}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Product Process</h1>
              <p className="text-muted-foreground">Update product process details and validation information</p>
            </div>
          </div>
          <Button onClick={() => handleSubmit()} disabled={isSaving}>
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
                        <span className="absolute left-2 ">
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
                      {activeTab === "technicalReview" && (
                        <div className="mt-6 space-y-2">
                          <Label>Validation Details</Label>
                          <div className="overflow-hidden border rounded-md">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-sm font-medium text-left">Milestones</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">TKO</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTOP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">IS</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">SOP</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t">
                                  <td className="px-4 py-2 text-sm font-medium">Initialized</td>
                                  <td className="px-4 py-2 text-sm text-center">x</td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                </tr>
                                <tr className="border-t bg-muted/50">
                                  
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Legend: o = Item initialized, x = Item validated/updated, blank = No status
                          </p>
                        </div>
                      )}

                      {activeTab === "dfmea" && (
                        <div className="mt-6 space-y-2">
                          <Label>Validation Details</Label>
                          <div className="overflow-hidden border rounded-md">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-sm font-medium text-left">Milestones</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">TKO</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTOP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">IS</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">SOP</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t">
                                  <td className="px-4 py-2 text-sm font-medium">Initialized</td>
                                  <td className="px-4 py-2 text-sm text-center">x</td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                </tr>
                                <tr className="border-t bg-muted/50">
                                  
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Legend: o = Item initialized, x = Item validated/updated, blank = No status
                          </p>
                        </div>
                      )}

                      {activeTab === "pfmea" && (
                        <div className="mt-6 space-y-2">
                          <Label>Validation Details</Label>
                          <div className="overflow-hidden border rounded-md">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-sm font-medium text-left">Milestones</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">TKO</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTOP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">IS</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">SOP</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t">
                                  <td className="px-4 py-2 text-sm font-medium">Initialized</td>
                                  <td className="px-4 py-2 text-sm text-center">x</td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                </tr>
                                <tr className="border-t bg-muted/50">
                                  
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Legend: o = Item initialized, x = Item validated/updated, blank = No status
                          </p>
                        </div>
                      )}

                      {activeTab === "injectionTools" && (
                        <div className="mt-6 space-y-2">
                          <Label>Validation Details</Label>
                          <div className="overflow-hidden border rounded-md">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-sm font-medium text-left">Milestones</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">TKO</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTOP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">IS</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">SOP</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t">
                                  <td className="px-4 py-2 text-sm font-medium">Initialized</td>
                                  <td className="px-4 py-2 text-sm text-center">x</td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                </tr>
                                <tr className="border-t bg-muted/50">
                                  
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Legend: o = Item initialized, x = Item validated/updated, blank = No status
                          </p>
                        </div>
                      )}

                      {activeTab === "paintingProcess" && (
                        <div className="mt-6 space-y-2">
                          <Label>Validation Details</Label>
                          <div className="overflow-hidden border rounded-md">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-sm font-medium text-left">Milestones</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">TKO</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTOP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">IS</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">SOP</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t">
                                  <td className="px-4 py-2 text-sm font-medium">Initialized</td>
                                  <td className="px-4 py-2 text-sm text-center">x</td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                </tr>
                                <tr className="border-t bg-muted/50">
                                  
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Legend: o = Item initialized, x = Item validated/updated, blank = No status
                          </p>
                        </div>
                      )}

                      {activeTab === "assyMachine" && (
                        <div className="mt-6 space-y-2">
                          <Label>Validation Details</Label>
                          <div className="overflow-hidden border rounded-md">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-sm font-medium text-left">Milestones</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">TKO</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTOP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">IS</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">SOP</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t">
                                  <td className="px-4 py-2 text-sm font-medium">Initialized</td>
                                  <td className="px-4 py-2 text-sm text-center">x</td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                </tr>
                                <tr className="border-t bg-muted/50">
                                  
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Legend: o = Item initialized, x = Item validated/updated, blank = No status
                          </p>
                        </div>
                      )}

                      {activeTab === "checkingFixture" && (
                        <div className="mt-6 space-y-2">
                          <Label>Validation Details</Label>
                          <div className="overflow-hidden border rounded-md">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-sm font-medium text-left">Milestones</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">TKO</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTOP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">IS</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">SOP</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t">
                                  <td className="px-4 py-2 text-sm font-medium">Initialized</td>
                                  <td className="px-4 py-2 text-sm text-center">x</td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                </tr>
                                <tr className="border-t bg-muted/50">
                                  
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Legend: o = Item initialized, x = Item validated/updated, blank = No status
                          </p>
                        </div>
                      )}

                      {activeTab === "industrialCapacity" && (
                        <div className="mt-6 space-y-2">
                          <Label>Validation Details</Label>
                          <div className="overflow-hidden border rounded-md">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-sm font-medium text-left">Milestones</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">TKO</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTOP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">IS</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">SOP</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t">
                                  <td className="px-4 py-2 text-sm font-medium">Initialized</td>
                                  <td className="px-4 py-2 text-sm text-center">x</td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                </tr>
                                <tr className="border-t bg-muted/50">
                                  <td className="px-4 py-2 text-sm font-medium">Validated</td>
                                  <td className="px-4 py-2 text-sm text-center">x</td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Legend: o = Item initialized, x = Item validated/updated, blank = No status
                          </p>
                        </div>
                      )}

                      {activeTab === "skillsDeployment" && (
                        <div className="mt-6 space-y-2">
                          <Label>Validation Details</Label>
                          <div className="overflow-hidden border rounded-md">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-sm font-medium text-left">Milestones</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">TKO</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">OTOP</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">IS</th>
                                  <th className="px-4 py-2 text-sm font-medium text-center">SOP</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t">
                                  <td className="px-4 py-2 text-sm font-medium">Initialized</td>
                                  <td className="px-4 py-2 text-sm text-center">x</td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                  <td className="px-4 py-2 text-sm text-center"></td>
                                </tr>
                                <tr className="border-t bg-muted/50">
                                  
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Legend: o = Item initialized, x = Item validated/updated, blank = No status
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                   
                      navigate(`/readiness/detail/${params.readinessId}`)
                  }
                  }
                >
                  Cancel
                </Button>
                <Button onClick={() => handleSubmit()} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </motion.div>
    </div>
    </MainLayout>
  )
}

export default EditProductProcessPage
