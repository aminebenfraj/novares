"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { createKickOff } from "../../apis/kickOffApi"
import { createDesign } from "../../apis/designApi"
import { createfacilities } from "../../apis/facilitiesApi"
import { createFeasibility } from "../../apis/feasabilityApi" // Note: API file name remains the same for backward compatibility
import { createQualificationProcess } from "../../apis/process_qualifApi"
import { createQualificationConfirmation } from "../../apis/qualificationconfirmationapi"
import { getAllCustomers } from "../../apis/customerApi"
import { getAllpd } from "../../apis/ProductDesignation-api"
import { createMassProduction } from "../../apis/massProductionApi"
import { createP_P_Tuning } from "../../apis/p-p-tuning-api"
import { createOkForLunch } from "../../apis/okForLunch"
import { createValidationForOffer } from "../../apis/validationForOfferApi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from 'lucide-react'
import MainLayout from "@/components/MainLayout"

const MassPdCreate = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState([])
  const [productDesignations, setProductDesignations] = useState([])
  const [selectedProductDesignations, setSelectedProductDesignations] = useState([])

  // Initial form state with all required fields
  const [formData, setFormData] = useState({
    id: "",
    status: "on-going",
    status_type: "ok",
    project_n: "",
    product_designation: [],
    description: "",
    customer: "",
    technical_skill: "sc",
    initial_request: new Date().toISOString().split("T")[0],
    request_original: "customer",
    customer_offer: "F",
    customer_order: "F",
    ppap_submission_date: "",
    ppap_submitted: false,
    closure: "",
    comment: "",
    next_review: "",
    mlo: "",
    tko: "",
    cv: "",
    pt1: "",
    pt2: "",
    sop: "",
    assignedRole: "",
    assignedEmail: "",
  })

  // Feasibility form state
  const [feasibilityData, setFeasibilityData] = useState(
    feasibilityFields.reduce((acc, field) => {
      acc[field] = { value: false, details: { description: "", cost: 0, sales_price: 0, comments: "" } }
      return acc
    }, {}),
  )

  // Kick-off form state
  const [kickOffData, setKickOffData] = useState(
    kickOffFields.reduce((acc, field) => {
      acc[field] = { value: false, task: { check: false, responsible: "", planned: "", comments: "" } }
      return acc
    }, {}),
  )

  // Design form state
  const [designData, setDesignData] = useState(
    designFields.reduce((acc, field) => {
      acc[field] = { value: false, task: { check: false, responsible: "", planned: "", comments: "" } }
      return acc
    }, {}),
  )

  // Facilities form state
  const [facilitiesData, setFacilitiesData] = useState(
    facilitiesFields.reduce((acc, field) => {
      acc[field] = { value: false, task: { check: false, responsible: "", planned: "", comments: "" } }
      return acc
    }, {}),
  )

  // P_P_Tuning form state
  const [ppTuningData, setPPTuningData] = useState(
    ppTuningFields.reduce((acc, field) => {
      acc[field] = { value: false, task: { check: false, responsible: "", planned: "", comments: "" } }
      return acc
    }, {}),
  )

  // Process Qualification form state
  const [processQualifData, setProcessQualifData] = useState(
    processQualifFields.reduce((acc, field) => {
      acc[field] = { value: false, task: { check: false, responsible: "", planned: "", comments: "" } }
      return acc
    }, {}),
  )

  // Qualification Confirmation form state
  const [qualificationConfirmationData, setQualificationConfirmationData] = useState(
    qualificationConfirmationFields.reduce((acc, field) => {
      acc[field] = { value: false, task: { check: false, responsible: "", planned: "", comments: "" } }
      return acc
    }, {}),
  )

  // Checkin form state
  const [checkinData, setCheckinData] = useState({
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
  })

  // Ok For Lunch form state
  const [okForLunchData, setOkForLunchData] = useState({
    check: false,
    upload: null,
    date: new Date().toISOString().split("T")[0],
  })

  const [validationForOfferData, setValidationForOfferData] = useState({
    name: "",
    check: false,
    upload: null,
    date: new Date().toISOString().split("T")[0],
  })

  // Checkin data for ValidationForOffer
  const [validationForOfferCheckinData, setValidationForOfferCheckinData] = useState({
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
  })

  // Checkin data for OkForLunch
  const [okForLunchCheckinData, setOkForLunchCheckinData] = useState({
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
  })

  // Checkin data for Feasibility
  const [feasibilityCheckinData, setFeasibilityCheckinData] = useState({
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
  })

  // Fetch customers and product designations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, productDesignationsData] = await Promise.all([getAllCustomers(), getAllpd()])

        // Validate customers data
        if (Array.isArray(customersData)) {
          setCustomers(customersData)
        } else {
          console.error("Invalid customers data format:", customersData)
          setCustomers([])
        }

        // Validate product designations data
        if (Array.isArray(productDesignationsData)) {
          // Filter out any invalid product designations
          const validProductDesignations = productDesignationsData.filter(
            (pd) => pd && pd._id && typeof pd._id === "string" && pd.part_name,
          )

          if (validProductDesignations.length !== productDesignationsData.length) {
            console.warn(
              `Filtered out ${productDesignationsData.length - validProductDesignations.length} invalid product designations`,
            )
          }

          setProductDesignations(validProductDesignations)
        } else {
          console.error("Invalid product designations data format:", productDesignationsData)
          setProductDesignations([])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load initial data. Please refresh the page.",
          variant: "destructive",
        })
        setCustomers([])
        setProductDesignations([])
      }
    }

    fetchData()
  }, [toast])

  // Handle input changes for main form
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle checkbox changes for main form
  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle select changes for main form
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle product designation selection
  const handleProductDesignationChange = (id) => {
    setSelectedProductDesignations((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle checkin checkbox changes
  const handleCheckinChange = (field, checked) => {
    setCheckinData((prev) => ({ ...prev, [field]: checked }))
  }

  // Handle ok for lunch changes
  const handleOkForLunchChange = (field, value) => {
    setOkForLunchData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle file upload for ok for lunch
  const handleFileChange = (e) => {
    setOkForLunchData((prev) => ({ ...prev, upload: e.target.files[0] }))
  }

  // Generic handler for accordion form data changes
  const handleAccordionCheckboxChange = (setter, field, checked) => {
    setter((prev) => ({
      ...prev,
      [field]: { ...prev[field], value: checked },
    }))
  }

  // Generic handler for task changes in accordion forms
  const handleTaskChange = (setter, field, taskField, value) => {
    setter((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        task: { ...prev[field].task, [taskField]: value },
      },
    }))
  }

  // Generic handler for details changes in feasibility form
  const handleDetailsChange = (field, detailField, value) => {
    setFeasibilityData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        details: { ...prev[field].details, [detailField]: value },
      },
    }))
  }

  const handleValidationForOfferChange = (field, value) => {
    setValidationForOfferData((prev) => ({ ...prev, [field]: value }))

    // Log the updated state for debugging
    console.log(`Updated validation for offer ${field}:`, value)
  }
  // Handle file upload for validation for offer
  const handleValidationForOfferFileChange = (e) => {
    setValidationForOfferData((prev) => ({ ...prev, upload: e.target.files[0] }))
  }

  // Handle ValidationForOffer checkin checkbox changes
  const handleValidationForOfferCheckinChange = (field, checked) => {
    setValidationForOfferCheckinData((prev) => ({ ...prev, [field]: checked }))
  }

  // Handle OkForLunch checkin checkbox changes
  const handleOkForLunchCheckinChange = (field, checked) => {
    setOkForLunchCheckinData((prev) => ({ ...prev, [field]: checked }))
  }

  // Handle Feasibility checkin checkbox changes
  const handleFeasibilityCheckinChange = (field, checked) => {
    setFeasibilityCheckinData((prev) => ({ ...prev, [field]: checked }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate product designations before submission
      if (selectedProductDesignations.length === 0) {
        toast({
          title: "Warning",
          description: "Please select at least one product designation.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Verify that all selected product designations exist in the productDesignations array
      const validProductDesignationIds = productDesignations.map((pd) => pd._id)
      const invalidSelections = selectedProductDesignations.filter((id) => !validProductDesignationIds.includes(id))

      if (invalidSelections.length > 0) {
        console.error("Invalid product designations detected:", invalidSelections)
        toast({
          title: "Error",
          description: `${invalidSelections.length} invalid product designation(s) detected. Please refresh and try again.`,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Update product designations in form data
      const updatedFormData = {
        ...formData,
        product_designation: selectedProductDesignations,
      }

      // Create feasibility record with embedded checkin data
      const feasibilityResponse = await createFeasibility({
        ...feasibilityData,
        checkin: feasibilityCheckinData, // Pass the checkin data directly
      })

      console.log("✅ Feasibility created successfully:", feasibilityResponse)

      // Extract the feasibility ID correctly from the nested response structure
      let feasibilityId = null

      // Check the nested response structure based on the console output
      if (feasibilityResponse && feasibilityResponse.data) {
        if (feasibilityResponse.data.data && feasibilityResponse.data.data.feasibility) {
          // Extract from the nested structure where feasibility is in data.data.feasibility
          if (feasibilityResponse.data.data.feasibility._id) {
            feasibilityId = feasibilityResponse.data.data.feasibility._id
          } else if (feasibilityResponse.data.data.feasibility.id) {
            feasibilityId = feasibilityResponse.data.data.feasibility.id
          }
        } else if (feasibilityResponse.data._id) {
          // Fallback to direct data._id if available
          feasibilityId = feasibilityResponse.data._id
        } else if (feasibilityResponse.data.id) {
          // Fallback to direct data.id if available
          feasibilityId = feasibilityResponse.data.id
        } else if (feasibilityResponse.data.feasibility) {
          // Check if feasibility is directly in data
          if (feasibilityResponse.data.feasibility._id) {
            feasibilityId = feasibilityResponse.data.feasibility._id
          } else if (feasibilityResponse.data.feasibility.id) {
            feasibilityId = feasibilityResponse.data.feasibility.id
          }
        }
      }

      console.log("✅ Extracted feasibility ID:", feasibilityId)

      // Add additional debugging to see the exact structure
      if (!feasibilityId) {
        console.error(
          "Failed to extract feasibility ID from response. Response structure:",
          JSON.stringify(feasibilityResponse.data, null, 2),
        )

        // Try one more approach - look for any _id in the response that might be the feasibility ID
        if (feasibilityResponse.data && feasibilityResponse.data.data && feasibilityResponse.data.data.feasibility) {
          console.log("Attempting to extract ID from feasibility object:", feasibilityResponse.data.data.feasibility)
          feasibilityId =
            feasibilityResponse.data.data.feasibility._id ||
            feasibilityResponse.data.data.feasibility.id ||
            feasibilityResponse.data.data.feasibility
          console.log("Final attempt at ID extraction:", feasibilityId)
        }

        if (!feasibilityId) {
          toast({
            title: "Error",
            description: "Failed to extract feasibility ID. Please check the console for details.",
            variant: "destructive",
          })
          setLoading(false)
          return
        }
      }

      // Create kick-off record
      const kickOffResponse = await createKickOff(kickOffData)

      // Create design record
      const designResponse = await createDesign(designData)

      // Create facilities record
      const facilitiesResponse = await createfacilities(facilitiesData)

      // Create P_P_Tuning record
      const ppTuningResponse = await createP_P_Tuning(ppTuningData)

      // Create process qualification record
      const processQualifResponse = await createQualificationProcess(processQualifData)

      // Create qualification confirmation record
      const qualificationConfirmationResponse = await createQualificationConfirmation(qualificationConfirmationData)

      // Create ok for lunch record with embedded checkin data
      // Make sure the structure matches exactly how feasibility checkin is working
      const okForLunchResponse = await createOkForLunch({
        ...okForLunchData,
        checkin: okForLunchCheckinData, // Pass the checkin data directly
      })

      console.log("✅ OkForLunch created successfully:", okForLunchResponse)

      // Create validation for offer record with embedded checkin data
      // Make sure the structure matches exactly how feasibility checkin is working
      const validationForOfferResponse = await createValidationForOffer({
        ...validationForOfferData,
        checkin: validationForOfferCheckinData, // Pass the checkin data directly
      })

      console.log("✅ ValidationForOffer created successfully:", validationForOfferResponse)

      // Create the mass production record with references to created records
      const massProductionData = {
        ...updatedFormData,
        feasibility: feasibilityId, // FIXED: Changed from feasability to feasibility
        kick_off: kickOffResponse.data._id,
        design: designResponse.data._id,
        facilities: facilitiesResponse.data._id,
        p_p_tuning: ppTuningResponse.data._id,
        process_qualif: processQualifResponse.data._id,
        qualification_confirmation: qualificationConfirmationResponse.data._id,
        ok_for_lunch: okForLunchResponse.data._id,
        validation_for_offer: validationForOfferResponse.data._id,
      }

      console.log("✅ Mass Production data to be sent:", massProductionData)

      // Create the mass production record
      const massProductionResponse = await createMassProduction(massProductionData)
      console.log("✅ Mass Production created successfully:", massProductionResponse)

      toast({
        title: "Success",
        description: "Mass production record created successfully!",
      })

      // Redirect to the mass production list page
      navigate("/masspd/create")
    } catch (error) {
      console.error("Failed to create mass production record:", error)
      toast({
        title: "Error",
        description: "Failed to create mass production record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
    <div className="min-h-screen bg-background">
      <div className="container py-8 mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={() => navigate("/mass-production")} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
          <h1 className="text-3xl font-bold">Create Mass Production</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="dates">Key Dates</TabsTrigger>
              <TabsTrigger value="stages">Process Stages</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic information for the mass production record.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="id">
                        ID <span className="text-red-500">*</span>
                      </Label>
                      <Input id="id" name="id" value={formData.id} onChange={handleInputChange} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project_n">
                        Project Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="project_n"
                        name="project_n"
                        value={formData.project_n}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="status">
                        Status <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="on-going">On-going</SelectItem>
                          <SelectItem value="stand-by">Stand-by</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status_type">
                        Status Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.status_type}
                        onValueChange={(value) => handleSelectChange("status_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ok">OK</SelectItem>
                          <SelectItem value="no">NO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customer">Customer</Label>
                      <Select
                        value={formData.customer}
                        onValueChange={(value) => handleSelectChange("customer", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer._id} value={customer._id}>
                              {customer.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technical_skill">Technical Skill</Label>
                      <Select
                        value={formData.technical_skill}
                        onValueChange={(value) => handleSelectChange("technical_skill", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select technical skill" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sc">SC</SelectItem>
                          <SelectItem value="tc">TC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">Product Designation</Label>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Select the product designations for this mass production.
                    </p>
                    {productDesignations.length === 0 ? (
                      <div className="p-4 border rounded-md bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                          No product designations available. Please check the database.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {productDesignations.map((item) => (
                          <div key={item._id} className="flex flex-row items-start p-3 space-x-3 border rounded-md">
                            <Checkbox
                              id={`pd-${item._id}`}
                              checked={selectedProductDesignations.includes(item._id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedProductDesignations((prev) => [...prev, item._id])
                                  // Also update the formData to keep it in sync
                                  setFormData((prev) => ({
                                    ...prev,
                                    product_designation: [...prev.product_designation, item._id],
                                  }))
                                } else {
                                  setSelectedProductDesignations((prev) => prev.filter((id) => id !== item._id))
                                  // Also update the formData to keep it in sync
                                  setFormData((prev) => ({
                                    ...prev,
                                    product_designation: prev.product_designation.filter((id) => id !== item._id),
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={`pd-${item._id}`} className="font-normal">
                              {item.part_name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedProductDesignations.length > 0 && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {selectedProductDesignations.length} product designation(s) selected
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Details Tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Enter the project details for the mass production record.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="initial_request">
                        Initial Request Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="initial_request"
                        name="initial_request"
                        type="date"
                        value={formData.initial_request}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="request_original">Request Origin</Label>
                      <Select
                        value={formData.request_original}
                        onValueChange={(value) => handleSelectChange("request_original", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select request origin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customer_offer">Customer Offer</Label>
                      <Select
                        value={formData.customer_offer}
                        onValueChange={(value) => handleSelectChange("customer_offer", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer offer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customer_order">Customer Order</Label>
                      <Select
                        value={formData.customer_order}
                        onValueChange={(value) => handleSelectChange("customer_order", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer order" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="F">F</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ppap_submitted"
                        checked={formData.ppap_submitted}
                        onCheckedChange={(checked) => handleCheckboxChange("ppap_submitted", checked)}
                      />
                      <Label htmlFor="ppap_submitted">PPAP Submitted</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ppap_submission_date">PPAP Submission Date</Label>
                    <Input
                      id="ppap_submission_date"
                      name="ppap_submission_date"
                      type="date"
                      value={formData.ppap_submission_date}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Comments</Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>OK for Launch</Label>
                    <Card className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ok-for-lunch-check"
                            checked={okForLunchData.check}
                            onCheckedChange={(checked) => handleOkForLunchChange("check", checked)}
                          />
                          <Label htmlFor="ok-for-lunch-check">Approved</Label>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ok-for-lunch-date">Date</Label>
                          <Input
                            id="ok-for-lunch-date"
                            type="date"
                            value={okForLunchData.date}
                            onChange={(e) => handleOkForLunchChange("date", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ok-for-lunch-upload">Upload Document</Label>
                          <Input id="ok-for-lunch-upload" type="file" onChange={handleFileChange} />
                        </div>

                        <div className="pt-4 mt-6 border-t">
                          <h4 className="mb-3 text-sm font-medium">Check-in for OK for Launch</h4>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {Object.keys(okForLunchCheckinData).map((field) => (
                              <div key={field} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`ok-for-lunch-${field}`}
                                  checked={okForLunchCheckinData[field]}
                                  onCheckedChange={(checked) => handleOkForLunchCheckinChange(field, checked)}
                                />
                                <Label
                                  htmlFor={`ok-for-lunch-${field}`}
                                  className="text-sm font-medium leading-none capitalize"
                                >
                                  {field.replace(/_/g, " ")}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <Label>Validation For Offer</Label>
                    <Card className="p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="validation-for-offer-name">Name</Label>
                          <Input
                            id="validation-for-offer-name"
                            value={validationForOfferData.name}
                            onChange={(e) => handleValidationForOfferChange("name", e.target.value)}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="validation-for-offer-check"
                            checked={validationForOfferData.check}
                            onCheckedChange={(checked) => handleValidationForOfferChange("check", checked)}
                          />
                          <Label htmlFor="validation-for-offer-check">Approved</Label>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="validation-for-offer-date">Date</Label>
                          <Input
                            id="validation-for-offer-date"
                            type="date"
                            value={validationForOfferData.date}
                            onChange={(e) => handleValidationForOfferChange("date", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="validation-for-offer-upload">Upload Document</Label>
                          <Input
                            id="validation-for-offer-upload"
                            type="file"
                            onChange={handleValidationForOfferFileChange}
                          />
                        </div>

                        <div className="pt-4 mt-6 border-t">
                          <h4 className="mb-3 text-sm font-medium">Check-in for Validation For Offer</h4>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {Object.keys(validationForOfferCheckinData).map((field) => (
                              <div key={field} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`validation-for-offer-${field}`}
                                  checked={validationForOfferCheckinData[field]}
                                  onCheckedChange={(checked) => handleValidationForOfferCheckinChange(field, checked)}
                                />
                                <Label
                                  htmlFor={`validation-for-offer-${field}`}
                                  className="text-sm font-medium leading-none capitalize"
                                >
                                  {field.replace(/_/g, " ")}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Key Dates Tab */}
            <TabsContent value="dates">
              <Card>
                <CardHeader>
                  <CardTitle>Key Dates</CardTitle>
                  <CardDescription>Enter the key dates for the mass production record.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="next_review">Next Review Date</Label>
                      <Input
                        id="next_review"
                        name="next_review"
                        type="date"
                        value={formData.next_review}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="closure">Closure Date</Label>
                      <Input
                        id="closure"
                        name="closure"
                        type="date"
                        value={formData.closure}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium">Milestone Dates</h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="mlo">MLO</Label>
                      <Input id="mlo" name="mlo" type="date" value={formData.mlo} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tko">TKO</Label>
                      <Input id="tko" name="tko" type="date" value={formData.tko} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cv">CV</Label>
                      <Input id="cv" name="cv" type="date" value={formData.cv} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pt1">PT1</Label>
                      <Input id="pt1" name="pt1" type="date" value={formData.pt1} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pt2">PT2</Label>
                      <Input id="pt2" name="pt2" type="date" value={formData.pt2} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sop">SOP</Label>
                      <Input id="sop" name="sop" type="date" value={formData.sop} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedRole">
                      Assigned Role <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="assignedRole"
                      name="assignedRole"
                      value={formData.assignedRole}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedEmail">
                      Assigned Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="assignedEmail"
                      name="assignedEmail"
                      type="email"
                      value={formData.assignedEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Process Stages Tab */}
            <TabsContent value="stages">
              <Card>
                <CardHeader>
                  <CardTitle>Process Stages</CardTitle>
                  <CardDescription>Configure all process stages for this mass production record.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="feasibility" className="w-full">
                    <TabsList className="grid w-full grid-cols-7">
                      <TabsTrigger value="feasibility">Feasibility</TabsTrigger>
                      <TabsTrigger value="kickoff">Kick-Off</TabsTrigger>
                      <TabsTrigger value="design">Design</TabsTrigger>
                      <TabsTrigger value="facilities">Facilities</TabsTrigger>
                      <TabsTrigger value="pptuning">P/P Tuning</TabsTrigger>
                      <TabsTrigger value="processqualif">Process Qualif</TabsTrigger>
                      <TabsTrigger value="qualifconfirm">Qualif Confirm</TabsTrigger>
                    </TabsList>

                    {/* Feasibility Tab */}
                    <TabsContent value="feasibility">
                      <Card>
                        <CardHeader>
                          <CardTitle>Feasibility</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accordion type="single" collapsible className="w-full">
                            {feasibilityFields.map((field, index) => (
                              <AccordionItem key={field} value={`item-${index}`}>
                                <AccordionTrigger className="text-lg font-semibold">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={field}
                                      checked={feasibilityData[field].value}
                                      onCheckedChange={(checked) =>
                                        handleAccordionCheckboxChange(setFeasibilityData, field, checked)
                                      }
                                    />
                                    <Label htmlFor={field} className="text-left">
                                      {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </Label>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <Label htmlFor={`${field}-description`}>Description</Label>
                                      <Textarea
                                        id={`${field}-description`}
                                        value={feasibilityData[field].details.description}
                                        onChange={(e) => handleDetailsChange(field, "description", e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`${field}-cost`}>Cost</Label>
                                      <Input
                                        id={`${field}-cost`}
                                        type="number"
                                        value={feasibilityData[field].details.cost}
                                        onChange={(e) => handleDetailsChange(field, "cost", e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`${field}-sales-price`}>Sales Price</Label>
                                      <Input
                                        id={`${field}-sales-price`}
                                        type="number"
                                        value={feasibilityData[field].details.sales_price}
                                        onChange={(e) => handleDetailsChange(field, "sales_price", e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`${field}-comments`}>Comments</Label>
                                      <Textarea
                                        id={`${field}-comments`}
                                        value={feasibilityData[field].details.comments}
                                        onChange={(e) => handleDetailsChange(field, "comments", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                          <div className="pt-4 mt-6 border-t">
                            <h4 className="mb-3 text-lg font-medium">Check-in for Feasibility</h4>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              {Object.keys(feasibilityCheckinData).map((field) => (
                                <div key={field} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`feasibility-${field}`}
                                    checked={feasibilityCheckinData[field]}
                                    onCheckedChange={(checked) => handleFeasibilityCheckinChange(field, checked)}
                                  />
                                  <Label
                                    htmlFor={`feasibility-${field}`}
                                    className="text-sm font-medium leading-none capitalize"
                                  >
                                    {field.replace(/_/g, " ")}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Kick-Off Tab */}
                    <TabsContent value="kickoff">
                      <Card>
                        <CardHeader>
                          <CardTitle>Kick-Off</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accordion type="single" collapsible className="w-full">
                            {kickOffFields.map((field, index) => (
                              <AccordionItem key={field} value={`item-${index}`}>
                                <AccordionTrigger className="text-lg font-semibold">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={field}
                                      checked={kickOffData[field].value}
                                      onCheckedChange={(checked) =>
                                        handleAccordionCheckboxChange(setKickOffData, field, checked)
                                      }
                                    />
                                    <Label htmlFor={field} className="text-left">
                                      {field.replace(/([A-Z])/g, " $1").trim()}
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
                                        value={kickOffData[field].task.responsible}
                                        onChange={(e) =>
                                          handleTaskChange(setKickOffData, field, "responsible", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`${field}-planned`}>Planned Date</Label>
                                      <Input
                                        id={`${field}-planned`}
                                        type="date"
                                        value={kickOffData[field].task.planned}
                                        onChange={(e) =>
                                          handleTaskChange(setKickOffData, field, "planned", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <Label htmlFor={`${field}-comments`}>Comments</Label>
                                      <Textarea
                                        id={`${field}-comments`}
                                        value={kickOffData[field].task.comments}
                                        onChange={(e) =>
                                          handleTaskChange(setKickOffData, field, "comments", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${field}-check`}
                                        checked={kickOffData[field].task.check}
                                        onCheckedChange={(checked) =>
                                          handleTaskChange(setKickOffData, field, "check", checked)
                                        }
                                      />
                                      <Label htmlFor={`${field}-check`}>Mark as Completed</Label>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Design Tab */}
                    <TabsContent value="design">
                      <Card>
                        <CardHeader>
                          <CardTitle>Design</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accordion type="single" collapsible className="w-full">
                            {designFields.map((field, index) => (
                              <AccordionItem key={field} value={`item-${index}`}>
                                <AccordionTrigger className="text-lg font-semibold">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={field}
                                      checked={designData[field].value}
                                      onCheckedChange={(checked) =>
                                        handleAccordionCheckboxChange(setDesignData, field, checked)
                                      }
                                    />
                                    <Label htmlFor={field} className="text-left">
                                      {field
                                        .replace(/_/g, " ")
                                        .replace(/([A-Z])/g, " $1")
                                        .trim()}
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
                                        value={designData[field].task.responsible}
                                        onChange={(e) =>
                                          handleTaskChange(setDesignData, field, "responsible", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`${field}-planned`}>Planned Date</Label>
                                      <Input
                                        id={`${field}-planned`}
                                        type="date"
                                        value={designData[field].task.planned}
                                        onChange={(e) =>
                                          handleTaskChange(setDesignData, field, "planned", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <Label htmlFor={`${field}-comments`}>Comments</Label>
                                      <Textarea
                                        id={`${field}-comments`}
                                        value={designData[field].task.comments}
                                        onChange={(e) =>
                                          handleTaskChange(setDesignData, field, "comments", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${field}-check`}
                                        checked={designData[field].task.check}
                                        onCheckedChange={(checked) =>
                                          handleTaskChange(setDesignData, field, "check", checked)
                                        }
                                      />
                                      <Label htmlFor={`${field}-check`}>Mark as Completed</Label>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Facilities Tab */}
                    <TabsContent value="facilities">
                      <Card>
                        <CardHeader>
                          <CardTitle>Facilities</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accordion type="single" collapsible className="w-full">
                            {facilitiesFields.map((field, index) => (
                              <AccordionItem key={field} value={`item-${index}`}>
                                <AccordionTrigger className="text-lg font-semibold">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={field}
                                      checked={facilitiesData[field].value}
                                      onCheckedChange={(checked) =>
                                        handleAccordionCheckboxChange(setFacilitiesData, field, checked)
                                      }
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
                                        value={facilitiesData[field].task.responsible}
                                        onChange={(e) =>
                                          handleTaskChange(setFacilitiesData, field, "responsible", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`${field}-planned`}>Planned Date</Label>
                                      <Input
                                        id={`${field}-planned`}
                                        type="date"
                                        value={facilitiesData[field].task.planned}
                                        onChange={(e) =>
                                          handleTaskChange(setFacilitiesData, field, "planned", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <Label htmlFor={`${field}-comments`}>Comments</Label>
                                      <Textarea
                                        id={`${field}-comments`}
                                        value={facilitiesData[field].task.comments}
                                        onChange={(e) =>
                                          handleTaskChange(setFacilitiesData, field, "comments", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${field}-check`}
                                        checked={facilitiesData[field].task.check}
                                        onCheckedChange={(checked) =>
                                          handleTaskChange(setFacilitiesData, field, "check", checked)
                                        }
                                      />
                                      <Label htmlFor={`${field}-check`}>Mark as Completed</Label>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* P/P Tuning Tab */}
                    <TabsContent value="pptuning">
                      <Card>
                        <CardHeader>
                          <CardTitle>Process/Product Tuning</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accordion type="single" collapsible className="w-full">
                            {ppTuningFields.map((field, index) => (
                              <AccordionItem key={field} value={`item-${index}`}>
                                <AccordionTrigger className="text-lg font-semibold">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={field}
                                      checked={ppTuningData[field].value}
                                      onCheckedChange={(checked) =>
                                        handleAccordionCheckboxChange(setPPTuningData, field, checked)
                                      }
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
                                        value={ppTuningData[field].task.responsible}
                                        onChange={(e) =>
                                          handleTaskChange(setPPTuningData, field, "responsible", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`${field}-planned`}>Planned Date</Label>
                                      <Input
                                        id={`${field}-planned`}
                                        type="date"
                                        value={ppTuningData[field].task.planned}
                                        onChange={(e) =>
                                          handleTaskChange(setPPTuningData, field, "planned", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <Label htmlFor={`${field}-comments`}>Comments</Label>
                                      <Textarea
                                        id={`${field}-comments`}
                                        value={ppTuningData[field].task.comments}
                                        onChange={(e) =>
                                          handleTaskChange(setPPTuningData, field, "comments", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${field}-check`}
                                        checked={ppTuningData[field].task.check}
                                        onCheckedChange={(checked) =>
                                          handleTaskChange(setPPTuningData, field, "check", checked)
                                        }
                                      />
                                      <Label htmlFor={`${field}-check`}>Mark as Completed</Label>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Process Qualification Tab */}
                    <TabsContent value="processqualif">
                      <Card>
                        <CardHeader>
                          <CardTitle>Process Qualification</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accordion type="single" collapsible className="w-full">
                            {processQualifFields.map((field, index) => (
                              <AccordionItem key={field} value={`item-${index}`}>
                                <AccordionTrigger className="text-lg font-semibold">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={field}
                                      checked={processQualifData[field].value}
                                      onCheckedChange={(checked) =>
                                        handleAccordionCheckboxChange(setProcessQualifData, field, checked)
                                      }
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
                                        value={processQualifData[field].task.responsible}
                                        onChange={(e) =>
                                          handleTaskChange(setProcessQualifData, field, "responsible", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`${field}-planned`}>Planned Date</Label>
                                      <Input
                                        id={`${field}-planned`}
                                        type="date"
                                        value={processQualifData[field].task.planned}
                                        onChange={(e) =>
                                          handleTaskChange(setProcessQualifData, field, "planned", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <Label htmlFor={`${field}-comments`}>Comments</Label>
                                      <Textarea
                                        id={`${field}-comments`}
                                        value={processQualifData[field].task.comments}
                                        onChange={(e) =>
                                          handleTaskChange(setProcessQualifData, field, "comments", e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${field}-check`}
                                        checked={processQualifData[field].task.check}
                                        onCheckedChange={(checked) =>
                                          handleTaskChange(setProcessQualifData, field, "check", checked)
                                        }
                                      />
                                      <Label htmlFor={`${field}-check`}>Mark as Completed</Label>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Qualification Confirmation Tab */}
                    <TabsContent value="qualifconfirm">
                      <Card>
                        <CardHeader>
                          <CardTitle>Qualification Confirmation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Accordion type="single" collapsible className="w-full">
                            {qualificationConfirmationFields.map((field, index) => (
                              <AccordionItem key={field} value={`item-${index}`}>
                                <AccordionTrigger className="text-lg font-semibold">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={field}
                                      checked={qualificationConfirmationData[field].value}
                                      onCheckedChange={(checked) =>
                                        handleAccordionCheckboxChange(setQualificationConfirmationData, field, checked)
                                      }
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
                                        value={qualificationConfirmationData[field].task.responsible}
                                        onChange={(e) =>
                                          handleTaskChange(
                                            setQualificationConfirmationData,
                                            field,
                                            "responsible",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`${field}-planned`}>Planned Date</Label>
                                      <Input
                                        id={`${field}-planned`}
                                        type="date"
                                        value={qualificationConfirmationData[field].task.planned}
                                        onChange={(e) =>
                                          handleTaskChange(
                                            setQualificationConfirmationData,
                                            field,
                                            "planned",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <Label htmlFor={`${field}-comments`}>Comments</Label>
                                      <Textarea
                                        id={`${field}-comments`}
                                        value={qualificationConfirmationData[field].task.comments}
                                        onChange={(e) =>
                                          handleTaskChange(
                                            setQualificationConfirmationData,
                                            field,
                                            "comments",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${field}-check`}
                                        checked={qualificationConfirmationData[field].task.check}
                                        onCheckedChange={(checked) =>
                                          handleTaskChange(setQualificationConfirmationData, field, "check", checked)
                                        }
                                      />
                                      <Label htmlFor={`${field}-check`}>Mark as Completed</Label>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Mass Production Record"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
        </MainLayout>

  )
}

// Field definitions
const feasibilityFields = [
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

const kickOffFields = [
  "timeScheduleApproved",
  "modificationLaunchOrder",
  "projectRiskAssessment",
  "standardsImpact",
  "validationOfCosts",
]

const designFields = [
  "Validation_of_the_validation",
  "Modification_of_bought_product",
  "Modification_of_tolerance",
  "Modification_of_checking_fixtures",
  "Modification_of_Product_FMEA",
  "Modification_of_part_list_form",
  "Modification_of_control_plan",
  "Modification_of_Process_FMEA",
  "Modification_of_production_facilities",
  "Modification_of_tools",
  "Modification_of_packaging",
  "Modification_of_information_system",
  "Updating_of_drawings",
]

const facilitiesFields = [
  "reception_of_modified_means",
  "reception_of_modified_tools",
  "reception_of_modified_fixtures",
  "reception_of_modified_parts",
  "control_plan",
]

const ppTuningFields = [
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

const processQualifFields = [
  "updating_of_capms",
  "modification_of_customer_logistics",
  "qualification_of_supplier",
  "presentation_of_initial_samples",
  "filing_of_initial_samples",
  "information_on_modification_implementation",
  "full_production_run",
  "request_for_dispensation",
  "process_qualification",
  "initial_sample_acceptance",
]

const qualificationConfirmationFields = [
  "using_up_old_stock",
  "using_up_safety_stocks",
  "updating_version_number_mould",
  "updating_version_number_product_label",
  "management_of_manufacturing_programmes",
  "specific_spotting_of_packaging_with_label",
  "management_of_galia_identification_labels",
  "preservation_measure",
  "product_traceability_label_modification",
  "information_to_production",
  "information_to_customer_logistics",
  "information_to_customer_quality",
  "updating_customer_programme_data_sheet",
]

export default MassPdCreate
