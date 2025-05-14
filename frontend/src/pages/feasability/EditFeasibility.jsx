"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getFeasibilityById, updateFeasibility } from "@/apis/feasabilityApi"
import { getCheckinById, updateCheckin } from "../../apis/checkIn"
import { getAllMassProductions } from "@/apis/massProductionApi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/AuthContext"
import { Loader2, ArrowLeft, Save, CheckCircle, XCircle, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import MainLayout from "@/components/MainLayout"
import RoleBasedCheckin from "../../components/role-based-checkin"

// List of feasibility fields from the model
const FEASIBILITY_FIELDS = [
  "product",
  "raw_material_type",
  "raw_material_qty",
  "packaging",
  "purchased_part",
  "injection_cycle_time",
  "moulding_labor",
  "press_size",
  "assembly_finishing_paint_cycle_time",
  "assembly_finishing_paint_labor",
  "ppm_level",
  "pre_study",
  "project_management",
  "study_design",
  "cae_design",
  "monitoring",
  "measurement_metrology",
  "validation",
  "molds",
  "special_machines",
  "checking_fixture",
  "equipment_painting_prehension",
  "run_validation",
  "stock_production_coverage",
  "is_presentation",
  "documentation_update",
]

// Define field config with labels and descriptions
const fieldConfig = {
  product: {
    label: "Product",
    description: "Product details and specifications",
  },
  raw_material_type: {
    label: "Raw Material Type",
    description: "Type of raw materials required",
  },
  raw_material_qty: {
    label: "Raw Material Quantity",
    description: "Quantity of raw materials needed",
  },
  packaging: {
    label: "Packaging",
    description: "Packaging requirements and specifications",
  },
  purchased_part: {
    label: "Purchased Part",
    description: "Parts that need to be purchased",
  },
  injection_cycle_time: {
    label: "Injection Cycle Time",
    description: "Time required for injection cycle",
  },
  moulding_labor: {
    label: "Moulding Labor",
    description: "Labor requirements for moulding",
  },
  press_size: {
    label: "Press Size",
    description: "Size of press required",
  },
  assembly_finishing_paint_cycle_time: {
    label: "Assembly/Finishing/Paint Cycle Time",
    description: "Time required for assembly, finishing, and painting",
  },
  assembly_finishing_paint_labor: {
    label: "Assembly/Finishing/Paint Labor",
    description: "Labor requirements for assembly, finishing, and painting",
  },
  ppm_level: {
    label: "PPM Level",
    description: "Parts per million quality level",
  },
  pre_study: {
    label: "Pre-Study",
    description: "Pre-study requirements and findings",
  },
  project_management: {
    label: "Project Management",
    description: "Project management requirements",
  },
  study_design: {
    label: "Study Design",
    description: "Design study requirements",
  },
  cae_design: {
    label: "CAE Design",
    description: "Computer-aided engineering design",
  },
  monitoring: {
    label: "Monitoring",
    description: "Monitoring requirements and procedures",
  },
  measurement_metrology: {
    label: "Measurement Metrology",
    description: "Measurement and metrology requirements",
  },
  validation: {
    label: "Validation",
    description: "Validation requirements and procedures",
  },
  molds: {
    label: "Molds",
    description: "Mold requirements and specifications",
  },
  special_machines: {
    label: "Special Machines",
    description: "Special machinery requirements",
  },
  checking_fixture: {
    label: "Checking Fixture",
    description: "Checking fixture requirements",
  },
  equipment_painting_prehension: {
    label: "Equipment Painting Prehension",
    description: "Equipment requirements for painting prehension",
  },
  run_validation: {
    label: "Run Validation",
    description: "Run validation requirements and procedures",
  },
  stock_production_coverage: {
    label: "Stock Production Coverage",
    description: "Stock production coverage requirements",
  },
  is_presentation: {
    label: "Presentation",
    description: "Presentation requirements",
  },
  documentation_update: {
    label: "Documentation Update",
    description: "Documentation update requirements",
  },
}

// Group feasibility fields for better organization
const FEASIBILITY_FIELD_GROUPS = {
  "Product Information": ["product", "raw_material_type", "raw_material_qty", "packaging", "purchased_part"],
  "Process Metrics": [
    "injection_cycle_time",
    "moulding_labor",
    "press_size",
    "assembly_finishing_paint_cycle_time",
    "assembly_finishing_paint_labor",
    "ppm_level",
  ],
  "Investment Impact": [
    "pre_study",
    "project_management",
    "study_design",
    "cae_design",
    "monitoring",
    "measurement_metrology",
    "validation",
    "molds",
    "special_machines",
    "checking_fixture",
    "equipment_painting_prehension",
    "run_validation",
    "stock_production_coverage",
    "is_presentation",
    "documentation_update",
  ],
}

const EditFeasibility = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, isAdmin } = useAuth()

  const [feasibilityData, setFeasibilityData] = useState({})
  const [checkinData, setCheckinData] = useState({})
  const [checkinId, setCheckinId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("feasibility")
  const [activeField, setActiveField] = useState("product")
  const [massProductionId, setMassProductionId] = useState(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [totalFields] = useState(FEASIBILITY_FIELDS.length)

  // Check if user can edit feasibility details
  const canEditFeasibility = () => {
    return isAdmin() || (user?.roles && user.roles.length > 0)
  }

  // Extract massProductionId from URL or localStorage
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const mpId = queryParams.get("massProductionId")

    if (mpId) {
      console.log("Found massProductionId in query params:", mpId)
      setMassProductionId(mpId)
      localStorage.setItem("lastMassProductionId", mpId)
    } else {
      const storedId = localStorage.getItem("lastMassProductionId")
      if (storedId) {
        console.log("Using massProductionId from localStorage:", storedId)
        setMassProductionId(storedId)
      }
    }
  }, [])

  // Fetch Feasibility Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await getFeasibilityById(id)
        console.log("Fetched feasibility data:", response.data)

        // Extract Feasibility Data
        const feasibilityFields = {}
        let completed = 0

        FEASIBILITY_FIELDS.forEach((field) => {
          if (response.data[field]) {
            feasibilityFields[field] = {
              value: response.data[field].value ?? false,
              details: {
                attribute_name: field,
                description: response.data[field].details?.description || "",
                cost: response.data[field].details?.cost || 0,
                comments: response.data[field].details?.comments || "",
                sales_price: response.data[field].details?.sales_price || 0,
              },
            }

            if (response.data[field].value) {
              completed++
            }
          } else {
            feasibilityFields[field] = {
              value: false,
              details: {
                attribute_name: field,
                description: "",
                cost: 0,
                comments: "",
                sales_price: 0,
              },
            }
          }
        })

        setCompletedCount(completed)
        setFeasibilityData(feasibilityFields)

        // Extract Checkin Data
        if (response.data.checkin) {
          const checkinId =
            typeof response.data.checkin === "object" ? response.data.checkin._id : response.data.checkin
          setCheckinId(checkinId)

          // Fetch checkin data
          if (checkinId) {
            try {
              const checkinResponse = await getCheckinById(checkinId)
              const checkinData = checkinResponse.data || checkinResponse
              console.log("Fetched checkin data:", checkinData)
              setCheckinData(checkinData)
            } catch (error) {
              console.error("Error fetching checkin data:", error)
              toast({
                title: "Warning",
                description: "Could not load check-in data. You'll create a new check-in.",
                variant: "warning",
              })
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to fetch data")
        toast({ title: "Error", description: "Failed to fetch Feasibility data.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, toast])

  // Update completed count when feasibility data changes
  useEffect(() => {
    if (Object.keys(feasibilityData).length > 0) {
      const completed = Object.values(feasibilityData).filter((field) => field.value).length
      setCompletedCount(completed)
    }
  }, [feasibilityData])

  // Handle Feasibility Field Changes
  const handleFeasibilityChange = (key, field, value) => {
    if (!canEditFeasibility()) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit feasibility details.",
        variant: "destructive",
      })
      return
    }

    setFeasibilityData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }))
  }

  // Handle Feasibility Detail Changes
  const handleDetailChange = (key, detailField, value) => {
    if (!canEditFeasibility()) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit feasibility details.",
        variant: "destructive",
      })
      return
    }

    setFeasibilityData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        details: {
          ...prev[key].details,
          [detailField]: value,
        },
      },
    }))
  }

  // Back button handler
  const handleBack = () => {
    if (massProductionId && massProductionId !== "masspd_idAttachment") {
      console.log("Back button: Navigating to mass production detail:", massProductionId)
      navigate(`/masspd/detail/${massProductionId}`)
    } else {
      console.log("No valid massProductionId found, navigating to feasibility list")
      navigate(`/feasibility`)
    }
  }

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if user has permission to submit changes
    const hasAnyEditPermission = canEditFeasibility() || isAdmin()

    if (!hasAnyEditPermission) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to submit changes.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // Format each feasibility field with the correct structure
      const formattedFeasibilityData = {}
      Object.entries(feasibilityData).forEach(([key, value]) => {
        formattedFeasibilityData[key] = {
          value: value.value,
          details: {
            attribute_name: key,
            description: value.details.description || "",
            cost: value.details.cost || 0,
            comments: value.details.comments || "",
            sales_price: value.details.sales_price || 0,
          },
        }
      })

      if (checkinId) {
        // Update existing checkin
        console.log("Updating existing checkin:", checkinId)
        await updateCheckin(checkinId, checkinData)
      }

      // Prepare the data for submission
      const submitData = {
        ...formattedFeasibilityData,
        checkin: checkinData,
      }

      // If we have a massProductionId, include it
      if (massProductionId) {
        submitData.massProductionId = massProductionId
      }

      console.log("Sending data to update Feasibility with checkin")

      // Update the feasibility
      await updateFeasibility(id, submitData)

      toast({
        title: "Success",
        description: "Feasibility and Checkin Updated Successfully!",
      })

      // Navigate back based on context
      if (massProductionId && massProductionId !== "masspd_idAttachment") {
        navigate(`/masspd/detail/${massProductionId}`)
      } else {
        // Try to find massProductionId from API
        try {
          const massProductionEntries = await getAllMassProductions()
          const massProductionEntry = massProductionEntries.find(
            (entry) => entry.feasibility === id || (entry.feasibility && entry.feasibility._id === id),
          )

          if (massProductionEntry) {
            navigate(`/masspd/detail/${massProductionEntry._id}`)
            return
          }
        } catch (error) {
          console.error("Error finding mass production entry:", error)
        }

        // Fallback to feasibility list
        navigate(`/feasibility`)
      }
    } catch (error) {
      console.error("Update error:", error)
      toast({ title: "Error", description: "Failed to update Feasibility and Checkin", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  // Show Loader While Fetching Data
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </MainLayout>
    )
  }

  // Show Error Message if API Fails
  if (error) {
    return (
      <MainLayout>
        <div className="container px-4 py-8 mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>Failed to load feasibility data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-red-500">{error}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/feasibility")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feasibility
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container px-4 py-8 mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Feasibility</h1>
                <p className="text-muted-foreground">
                  Update feasibility details • {completedCount} of {totalFields} fields completed
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setActiveTab(activeTab === "feasibility" ? "checkin" : "feasibility")}
                className="flex items-center"
              >
                {activeTab === "feasibility" ? (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    View Check-in
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Feasibility
                  </>
                )}
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="hidden">
                <TabsTrigger value="feasibility">Feasibility</TabsTrigger>
                <TabsTrigger value="checkin">Check-in</TabsTrigger>
              </TabsList>

              <TabsContent value="feasibility">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>Feasibility Fields</CardTitle>
                      <CardDescription>
                        Select a field to edit • {completedCount}/{totalFields} completed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-2">
                      {Object.entries(FEASIBILITY_FIELD_GROUPS).map(([groupName, fields]) => (
                        <div key={groupName} className="mb-4">
                          <h3 className="px-2 mb-2 text-sm font-semibold text-muted-foreground">{groupName}</h3>
                          <div className="space-y-1">
                            {fields.map((field) => (
                              <button
                                key={field}
                                type="button"
                                onClick={() => setActiveField(field)}
                                className={`relative w-full flex items-center justify-start text-left px-9 py-2 rounded-md text-sm ${
                                  activeField === field ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                }`}
                              >
                                <span className="absolute left-2">
                                  {feasibilityData[field]?.value ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )}
                                </span>
                                {fieldConfig[field].label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle>{fieldConfig[activeField].label}</CardTitle>
                      <CardDescription>
                        {canEditFeasibility()
                          ? fieldConfig[activeField].description
                          : "View-only mode. You don't have permission to edit feasibility details."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeField}-value`}
                          checked={feasibilityData[activeField]?.value || false}
                          onCheckedChange={(checked) => handleFeasibilityChange(activeField, "value", checked === true)}
                          disabled={!canEditFeasibility()}
                          className={!canEditFeasibility() ? "opacity-60" : ""}
                        />
                        <Label htmlFor={`${activeField}-value`}>Mark as completed</Label>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${activeField}-description`}>Description</Label>
                          <Textarea
                            id={`${activeField}-description`}
                            value={feasibilityData[activeField]?.details?.description || ""}
                            onChange={(e) => handleDetailChange(activeField, "description", e.target.value)}
                            placeholder="Enter description"
                            rows={3}
                            disabled={!canEditFeasibility()}
                            className={!canEditFeasibility() ? "opacity-60" : ""}
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${activeField}-cost`}>Cost</Label>
                            <Input
                              id={`${activeField}-cost`}
                              type="number"
                              value={feasibilityData[activeField]?.details?.cost || ""}
                              onChange={(e) => handleDetailChange(activeField, "cost", Number(e.target.value))}
                              placeholder="0.00"
                              disabled={!canEditFeasibility()}
                              className={!canEditFeasibility() ? "opacity-60" : ""}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${activeField}-sales-price`}>Sales Price</Label>
                            <Input
                              id={`${activeField}-sales-price`}
                              type="number"
                              value={feasibilityData[activeField]?.details?.sales_price || ""}
                              onChange={(e) => handleDetailChange(activeField, "sales_price", Number(e.target.value))}
                              placeholder="0.00"
                              disabled={!canEditFeasibility()}
                              className={!canEditFeasibility() ? "opacity-60" : ""}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${activeField}-comments`}>Comments</Label>
                          <Textarea
                            id={`${activeField}-comments`}
                            value={feasibilityData[activeField]?.details?.comments || ""}
                            onChange={(e) => handleDetailChange(activeField, "comments", e.target.value)}
                            placeholder="Add any additional comments here"
                            rows={4}
                            disabled={!canEditFeasibility()}
                            className={!canEditFeasibility() ? "opacity-60" : ""}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={handleBack}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="checkin">
                <Card>
                  <CardHeader>
                    <CardTitle>Check-in Details</CardTitle>
                    <CardDescription>
                      Each role can only edit their own section. Check the box for completed items, add your name, and
                      provide comments.
                    </CardDescription>
                  </CardHeader>

                  {/* Use the RoleBasedCheckin component */}
                  <RoleBasedCheckin
                    checkinData={checkinData}
                    setCheckinData={setCheckinData}
                    readOnly={false}
                    showTitle={false}
                  />

                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("feasibility")}>
                      Back to Feasibility
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default EditFeasibility
