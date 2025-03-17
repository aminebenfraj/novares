"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getMassProductionById, deleteMassProduction } from "../../apis/massProductionApi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import {
  Edit,
  Trash2,
  ArrowLeft,
  FileText,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  CheckSquare,
  Clipboard,
  Package,
  Factory,
  Settings,
  FileCheck,
  ShieldCheck,
  Plus,
} from "lucide-react"
import { format } from "date-fns"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const MassProductionDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [massProduction, setMassProduction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchMassProduction()
  }, [id])

  const fetchMassProduction = async () => {
    if (!id) {
      setError("Invalid Mass Production ID")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await getMassProductionById(id)
      setMassProduction(data)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch mass production:", error)
      setError("Failed to fetch mass production. Please try again later.")
      toast({
        title: "Error",
        description: "Failed to fetch mass production details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this mass production record?")) {
      try {
        await deleteMassProduction(id)
        toast({
          title: "Success",
          description: "Mass production record deleted successfully",
        })
        navigate("/masspd")
      } catch (error) {
        console.error("Failed to delete mass production:", error)
        toast({
          title: "Error",
          description: "Failed to delete mass production record",
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = () => {
    navigate(`/masspd/edit/${id}`)
  }

  const handleBack = () => {
    navigate("/masspd")
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "on-going":
        return { variant: "default", icon: <Clock className="w-3 h-3 mr-1" /> }
      case "stand-by":
        return { variant: "warning", icon: <AlertTriangle className="w-3 h-3 mr-1" /> }
      case "closed":
        return { variant: "success", icon: <CheckCircle className="w-3 h-3 mr-1" /> }
      case "cancelled":
        return { variant: "destructive", icon: <XCircle className="w-3 h-3 mr-1" /> }
      default:
        return { variant: "secondary", icon: null }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  const renderTaskStatus = (task) => {
    if (!task) return <Badge variant="secondary">Not Started</Badge>

    if (task.check) {
      return (
        <Badge variant="success" className="flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" /> Completed
        </Badge>
      )
    } else {
      return (
        <Badge variant="warning" className="flex items-center">
          <Clock className="w-3 h-3 mr-1" /> In Progress
        </Badge>
      )
    }
  }

  const renderFileLink = (filePath) => {
    if (!filePath) return <span className="text-gray-400">No file attached</span>

    return (
      <a
        href={`http://localhost:5000/${filePath}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-blue-500 hover:text-blue-700"
      >
        <FileText className="w-4 h-4 mr-1" />
        View File
      </a>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 rounded-full border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading mass production details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-8 text-center bg-white rounded-lg shadow-lg">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Error</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
        </div>
      </div>
    )
  }

  if (!massProduction) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-8 text-center bg-white rounded-lg shadow-lg">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-amber-500" />
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Not Found</h2>
          <p className="mb-6 text-gray-600">The requested mass production record could not be found.</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
        </div>
      </div>
    )
  }

  const statusBadge = getStatusBadge(massProduction.status)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Mass Production Details</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">Project: {massProduction.project_n}</CardTitle>
                  <CardDescription>ID: {massProduction.id}</CardDescription>
                </div>
                <Badge variant={statusBadge.variant} className="flex items-center">
                  {statusBadge.icon}
                  {massProduction.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Customer</h3>
                  <p className="text-lg font-bold">
                    {massProduction.customer ? massProduction.customer.username : "N/A"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Initial Request</h3>
                  <p className="text-lg font-bold">{formatDate(massProduction.initial_request)}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Next Review</h3>
                  <p className="text-lg font-bold">{formatDate(massProduction.next_review)}</p>
                </div>
              </div>

              {massProduction.description && (
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Description</h3>
                  <p className="p-3 rounded-md bg-gray-50">{massProduction.description}</p>
                </div>
              )}

              {massProduction.product_designation && massProduction.product_designation.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Product Designations</h3>
                  <div className="flex flex-wrap gap-2">
                    {massProduction.product_designation.map((product) => (
                      <Badge key={product._id} variant="outline" className="px-3 py-1">
                        {product.part_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button onClick={handleEdit} variant="outline">
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button onClick={handleDelete} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </CardFooter>
          </Card>

          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="facilities">Facilities</TabsTrigger>
              <TabsTrigger value="pptuning">P/P Tuning</TabsTrigger>
              <TabsTrigger value="processqualif">Process Qualification</TabsTrigger>
              <TabsTrigger value="qualificationconfirmation">Qualification Confirmation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>Summary of all project phases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-base font-medium">
                            <Clipboard className="w-4 h-4 mr-2 text-blue-500" />
                            Feasibility
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.feasability)}</CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-base font-medium">
                            <FileCheck className="w-4 h-4 mr-2 text-indigo-500" />
                            Validation For Offer
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.validation_for_offer)}</CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-base font-medium">
                            <CheckSquare className="w-4 h-4 mr-2 text-green-500" />
                            OK For Launch
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.ok_for_lunch)}</CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-base font-medium">
                            <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                            Kick Off
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.kick_off)}</CardContent>
                      </Card>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-base font-medium">
                            <Package className="w-4 h-4 mr-2 text-purple-500" />
                            Design
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.design)}</CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-base font-medium">
                            <Factory className="w-4 h-4 mr-2 text-orange-500" />
                            Facilities
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.facilities)}</CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-base font-medium">
                            <Settings className="w-4 h-4 mr-2 text-cyan-500" />
                            P/P Tuning
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.p_p_tuning)}</CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-base font-medium">
                            <ShieldCheck className="w-4 h-4 mr-2 text-red-500" />
                            Process Qualification
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.process_qualif)}</CardContent>
                      </Card>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Card className="md:col-span-1">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center text-base font-medium">
                            <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                            Qualification Confirmation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.qualification_confirmation)}</CardContent>
                      </Card>

                      <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium">Project Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Initial Request:</span>
                              <span className="font-medium">{formatDate(massProduction.initial_request)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">PPAP Submission:</span>
                              <span className="font-medium">{formatDate(massProduction.ppap_submission_date)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Next Review:</span>
                              <span className="font-medium">{formatDate(massProduction.next_review)}</span>
                            </div>
                            {massProduction.days_until_ppap_submission !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Days Until PPAP:</span>
                                <Badge variant={massProduction.days_until_ppap_submission > 30 ? "outline" : "warning"}>
                                  {massProduction.days_until_ppap_submission} days
                                </Badge>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design">
              <Card>
                <CardHeader>
                  <CardTitle>Design Details</CardTitle>
                  <CardDescription>Design tasks and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  {massProduction.design ? (
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(massProduction.design).map(([key, value]) => {
                        if (
                          key !== "_id" &&
                          key !== "__v" &&
                          key !== "createdAt" &&
                          key !== "updatedAt" &&
                          typeof value === "object"
                        ) {
                          return (
                            <AccordionItem key={key} value={key}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
                                  {value.value ? (
                                    <Badge variant="success" className="ml-2">
                                      Completed
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="ml-2">
                                      Pending
                                    </Badge>
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                {value.task && (
                                  <div className="grid grid-cols-1 gap-4 p-4 rounded-md bg-gray-50 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Responsible:</span>
                                        <span className="ml-2">{value.task.responsible || "Not assigned"}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Planned:</span>
                                        <span className="ml-2">
                                          {value.task.planned ? formatDate(value.task.planned) : "Not scheduled"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Completed:</span>
                                        <span className="ml-2">
                                          {value.task.done ? formatDate(value.task.done) : "Not completed"}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">File:</span>
                                        <span className="ml-2">{renderFileLink(value.task.filePath)}</span>
                                      </div>
                                    </div>
                                    {value.task.comments && (
                                      <div className="col-span-1 md:col-span-2">
                                        <p className="font-medium">Comments:</p>
                                        <p className="p-2 mt-1 text-sm bg-white rounded">{value.task.comments}</p>
                                      </div>
                                    )}
                                    <div className="col-span-1 md:col-span-2">
                                      <div className="flex items-center">
                                        <Checkbox checked={value.task.check} disabled className="mr-2" />
                                        <span>Task marked as {value.task.check ? "completed" : "incomplete"}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          )
                        }
                        return null
                      })}
                    </Accordion>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No design data available</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate(`/design/create?massProductionId=${id}`)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Design
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="facilities">
              <Card>
                <CardHeader>
                  <CardTitle>Facilities Details</CardTitle>
                  <CardDescription>Facilities tasks and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  {massProduction.facilities ? (
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(massProduction.facilities).map(([key, value]) => {
                        if (
                          key !== "_id" &&
                          key !== "__v" &&
                          key !== "createdAt" &&
                          key !== "updatedAt" &&
                          typeof value === "object"
                        ) {
                          return (
                            <AccordionItem key={key} value={key}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
                                  {value.value ? (
                                    <Badge variant="success" className="ml-2">
                                      Completed
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="ml-2">
                                      Pending
                                    </Badge>
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                {value.task && (
                                  <div className="grid grid-cols-1 gap-4 p-4 rounded-md bg-gray-50 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Responsible:</span>
                                        <span className="ml-2">{value.task.responsible || "Not assigned"}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Planned:</span>
                                        <span className="ml-2">
                                          {value.task.planned ? formatDate(value.task.planned) : "Not scheduled"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Completed:</span>
                                        <span className="ml-2">
                                          {value.task.done ? formatDate(value.task.done) : "Not completed"}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">File:</span>
                                        <span className="ml-2">{renderFileLink(value.task.filePath)}</span>
                                      </div>
                                    </div>
                                    {value.task.comments && (
                                      <div className="col-span-1 md:col-span-2">
                                        <p className="font-medium">Comments:</p>
                                        <p className="p-2 mt-1 text-sm bg-white rounded">{value.task.comments}</p>
                                      </div>
                                    )}
                                    <div className="col-span-1 md:col-span-2">
                                      <div className="flex items-center">
                                        <Checkbox checked={value.task.check} disabled className="mr-2" />
                                        <span>Task marked as {value.task.check ? "completed" : "incomplete"}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          )
                        }
                        return null
                      })}
                    </Accordion>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No facilities data available</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate(`/facilities/create?massProductionId=${id}`)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Facilities
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pptuning">
              <Card>
                <CardHeader>
                  <CardTitle>Product/Process Tuning Details</CardTitle>
                  <CardDescription>P/P Tuning tasks and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  {massProduction.p_p_tuning ? (
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(massProduction.p_p_tuning).map(([key, value]) => {
                        if (
                          key !== "_id" &&
                          key !== "__v" &&
                          key !== "createdAt" &&
                          key !== "updatedAt" &&
                          typeof value === "object"
                        ) {
                          return (
                            <AccordionItem key={key} value={key}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
                                  {value.value ? (
                                    <Badge variant="success" className="ml-2">
                                      Completed
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="ml-2">
                                      Pending
                                    </Badge>
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                {value.task && (
                                  <div className="grid grid-cols-1 gap-4 p-4 rounded-md bg-gray-50 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Responsible:</span>
                                        <span className="ml-2">{value.task.responsible || "Not assigned"}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Planned:</span>
                                        <span className="ml-2">
                                          {value.task.planned ? formatDate(value.task.planned) : "Not scheduled"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Completed:</span>
                                        <span className="ml-2">
                                          {value.task.done ? formatDate(value.task.done) : "Not completed"}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">File:</span>
                                        <span className="ml-2">{renderFileLink(value.task.filePath)}</span>
                                      </div>
                                    </div>
                                    {value.task.comments && (
                                      <div className="col-span-1 md:col-span-2">
                                        <p className="font-medium">Comments:</p>
                                        <p className="p-2 mt-1 text-sm bg-white rounded">{value.task.comments}</p>
                                      </div>
                                    )}
                                    <div className="col-span-1 md:col-span-2">
                                      <div className="flex items-center">
                                        <Checkbox checked={value.task.check} disabled className="mr-2" />
                                        <span>Task marked as {value.task.check ? "completed" : "incomplete"}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          )
                        }
                        return null
                      })}
                    </Accordion>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No P/P tuning data available</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate(`/p_p_tuning/create?massProductionId=${id}`)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create P/P Tuning
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processqualif">
              <Card>
                <CardHeader>
                  <CardTitle>Process Qualification Details</CardTitle>
                  <CardDescription>Process qualification tasks and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  {massProduction.process_qualif ? (
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(massProduction.process_qualif).map(([key, value]) => {
                        if (
                          key !== "_id" &&
                          key !== "__v" &&
                          key !== "createdAt" &&
                          key !== "updatedAt" &&
                          typeof value === "object"
                        ) {
                          return (
                            <AccordionItem key={key} value={key}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
                                  {value.value ? (
                                    <Badge variant="success" className="ml-2">
                                      Completed
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="ml-2">
                                      Pending
                                    </Badge>
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                {value.task && (
                                  <div className="grid grid-cols-1 gap-4 p-4 rounded-md bg-gray-50 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Responsible:</span>
                                        <span className="ml-2">{value.task.responsible || "Not assigned"}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Planned:</span>
                                        <span className="ml-2">
                                          {value.task.planned ? formatDate(value.task.planned) : "Not scheduled"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Completed:</span>
                                        <span className="ml-2">
                                          {value.task.done ? formatDate(value.task.done) : "Not completed"}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">File:</span>
                                        <span className="ml-2">{renderFileLink(value.task.filePath)}</span>
                                      </div>
                                    </div>
                                    {value.task.comments && (
                                      <div className="col-span-1 md:col-span-2">
                                        <p className="font-medium">Comments:</p>
                                        <p className="p-2 mt-1 text-sm bg-white rounded">{value.task.comments}</p>
                                      </div>
                                    )}
                                    <div className="col-span-1 md:col-span-2">
                                      <div className="flex items-center">
                                        <Checkbox checked={value.task.check} disabled className="mr-2" />
                                        <span>Task marked as {value.task.check ? "completed" : "incomplete"}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          )
                        }
                        return null
                      })}
                    </Accordion>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No process qualification data available</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate(`/process-qualification/create?massProductionId=${id}`)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Process Qualification
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qualificationconfirmation">
              <Card>
                <CardHeader>
                  <CardTitle>Qualification Confirmation Details</CardTitle>
                  <CardDescription>Qualification confirmation tasks and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  {massProduction.qualification_confirmation ? (
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(massProduction.qualification_confirmation).map(([key, value]) => {
                        if (
                          key !== "_id" &&
                          key !== "__v" &&
                          key !== "createdAt" &&
                          key !== "updatedAt" &&
                          typeof value === "object"
                        ) {
                          return (
                            <AccordionItem key={key} value={key}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
                                  {value.value ? (
                                    <Badge variant="success" className="ml-2">
                                      Completed
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="ml-2">
                                      Pending
                                    </Badge>
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                {value.task && (
                                  <div className="grid grid-cols-1 gap-4 p-4 rounded-md bg-gray-50 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Responsible:</span>
                                        <span className="ml-2">{value.task.responsible || "Not assigned"}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Planned:</span>
                                        <span className="ml-2">
                                          {value.task.planned ? formatDate(value.task.planned) : "Not scheduled"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">Completed:</span>
                                        <span className="ml-2">
                                          {value.task.done ? formatDate(value.task.done) : "Not completed"}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="font-medium">File:</span>
                                        <span className="ml-2">{renderFileLink(value.task.filePath)}</span>
                                      </div>
                                    </div>
                                    {value.task.comments && (
                                      <div className="col-span-1 md:col-span-2">
                                        <p className="font-medium">Comments:</p>
                                        <p className="p-2 mt-1 text-sm bg-white rounded">{value.task.comments}</p>
                                      </div>
                                    )}
                                    <div className="col-span-1 md:col-span-2">
                                      <div className="flex items-center">
                                        <Checkbox checked={value.task.check} disabled className="mr-2" />
                                        <span>Task marked as {value.task.check ? "completed" : "incomplete"}</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          )
                        }
                        return null
                      })}
                    </Accordion>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No qualification confirmation data available</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate(`/qualification-confirmation/create?massProductionId=${id}`)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Qualification Confirmation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <ContactUs />
    </div>
  )
}

export default MassProductionDetails

