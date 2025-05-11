"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMassProductionById, updateMassProduction } from "../../apis/massProductionApi"
import { getAllCustomers } from "../../apis/customerApi"
import { getAllpd } from "../../apis/ProductDesignation-api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import MainLayout from "@/components/MainLayout"

const EditMassProductionForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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

  // Helper function to extract ID from object or string
  const extractId = (idOrObject) => {
    if (!idOrObject) return null

    // If it's a string, return it directly
    if (typeof idOrObject === "string") return idOrObject

    // If it's an object with _id property
    if (typeof idOrObject === "object") {
      if (idOrObject._id) return idOrObject._id
      if (idOrObject.id) return idOrObject.id
    }

    console.warn("Could not extract ID from:", idOrObject)
    return null
  }

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await Promise.all([fetchMassProduction(), fetchCustomers(), fetchProductDesignations()])
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, toast])

  const fetchMassProduction = async () => {
    try {
      setLoading(true)
      console.log("Fetching mass production with ID:", id)
      const data = await getMassProductionById(id)
      console.log("Mass Production Data:", data)

      if (!data) {
        throw new Error("Mass production data not found")
      }

      // Format date fields properly
      const formattedData = {
        ...data,
        initial_request: data.initial_request ? new Date(data.initial_request).toISOString().split("T")[0] : "",
        ppap_submission_date: data.ppap_submission_date
          ? new Date(data.ppap_submission_date).toISOString().split("T")[0]
          : "",
        closure: data.closure ? new Date(data.closure).toISOString().split("T")[0] : "",
        next_review: data.next_review ? new Date(data.next_review).toISOString().split("T")[0] : "",
        mlo: data.mlo ? new Date(data.mlo).toISOString().split("T")[0] : "",
        tko: data.tko ? new Date(data.tko).toISOString().split("T")[0] : "",
        cv: data.cv ? new Date(data.cv).toISOString().split("T")[0] : "",
        pt1: data.pt1 ? new Date(data.pt1).toISOString().split("T")[0] : "",
        pt2: data.pt2 ? new Date(data.pt2).toISOString().split("T")[0] : "",
        sop: data.sop ? new Date(data.sop).toISOString().split("T")[0] : "",
        product_designation: data.product_designation ? data.product_designation.map((pd) => pd._id || pd) : [],
      }

      // Set main form data
      setFormData(formattedData)

      // Set selected product designations
      setSelectedProductDesignations(formattedData.product_designation)
    } catch (error) {
      console.error("Failed to fetch mass production:", error)
      toast({
        title: "Error",
        description: "Failed to load mass production data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchCustomers = async () => {
    try {
      console.log("Fetching customers...")
      const data = await getAllCustomers()
      console.log("Customers data:", data)

      // Handle different API response structures
      const customersData = Array.isArray(data) ? data : data.data || []

      if (customersData && customersData.length > 0) {
        console.log("Setting customers:", customersData)
        setCustomers(customersData)
      } else {
        console.warn("No customers found or invalid data format")
        setCustomers([])
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error)
      toast({
        title: "Error",
        description: "Failed to load customer data. Please try again.",
        variant: "destructive",
      })
      setCustomers([])
    }
  }

  const fetchProductDesignations = async () => {
    try {
      const data = await getAllpd()
      setProductDesignations(data || [])
    } catch (error) {
      console.error("Failed to fetch product designations:", error)
    }
  }

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validate product designations before submission
      if (selectedProductDesignations.length === 0) {
        toast({
          title: "Warning",
          description: "Please select at least one product designation.",
          variant: "destructive",
        })
        setSubmitting(false)
        return
      }

      // Update product designations in form data and handle empty customer field
      const updatedFormData = {
        ...formData,
        product_designation: selectedProductDesignations,
      }

      // Remove empty customer field to prevent ObjectId casting error
      if (!updatedFormData.customer) {
        delete updatedFormData.customer
      }

      // Update the mass production record
      await updateMassProduction(id, updatedFormData)

      toast({
        title: "Success",
        description: "Mass production record updated successfully!",
      })

      // Redirect to the mass production list page
      navigate("/masspd")
    } catch (error) {
      console.error("Failed to update mass production record:", error)
      toast({
        title: "Error",
        description: "Failed to update mass production record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 rounded-full border-t-primary animate-spin"></div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container py-8 mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="outline" onClick={() => navigate("/masspd")} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
            </Button>
            <h1 className="text-3xl font-bold">Edit Mass Production</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Project Details</TabsTrigger>
                <TabsTrigger value="dates">Key Dates</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Edit the basic information for the mass production record.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="id">
                          ID <span className="text-red-500">*</span>
                        </Label>
                        <Input id="id" name="id" value={formData.id} onChange={handleInputChange} required readOnly />
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
                            {customers.length > 0 ? (
                              customers.map((customer) => (
                                <SelectItem key={customer._id} value={customer._id}>
                                  {customer.username || customer.name || customer.email || "Unknown Customer"}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>
                                No customers available
                              </SelectItem>
                            )}
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
                    <CardDescription>Edit the project details for the mass production record.</CardDescription>
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
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Key Dates Tab */}
              <TabsContent value="dates">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Dates</CardTitle>
                    <CardDescription>Edit the key dates for the mass production record.</CardDescription>
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
                  <CardFooter>
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Mass Production Record"
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

export default EditMassProductionForm
