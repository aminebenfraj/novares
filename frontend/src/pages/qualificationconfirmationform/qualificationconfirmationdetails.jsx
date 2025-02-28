"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  getQualificationConfirmationById,
  deleteQualificationConfirmation,
} from "../../apis/qualificationconfirmationapi"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Edit, Trash2, ArrowLeft, FileText, Calendar, User, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"

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

const QualificationConfirmationDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [qualificationConfirmation, setQualificationConfirmation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchQualificationConfirmation()
  }, []) // Updated dependency array

  const fetchQualificationConfirmation = async () => {
    if (!id) {
      setError("Invalid Qualification Confirmation ID")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await getQualificationConfirmationById(id)
      setQualificationConfirmation(data)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch qualification confirmation:", error)
      setError("Failed to fetch qualification confirmation. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this qualification confirmation?")) {
      try {
        await deleteQualificationConfirmation(id)
        navigate("/qualification-confirmation")
      } catch (error) {
        console.error("Failed to delete qualification confirmation:", error)
        setError("Failed to delete qualification confirmation. Please try again.")
      }
    }
  }

  const handleEdit = () => {
    navigate(`/qualification-confirmation/edit/${id}`)
  }

  const handleBack = () => {
    navigate("/qualification-confirmation")
  }

  const getCompletionStatus = () => {
    if (!qualificationConfirmation) return { status: "Not Started", variant: "secondary" }

    const completedTasks = qualificationConfirmationFields.filter(
      (field) => qualificationConfirmation[field]?.value,
    ).length
    const totalTasks = qualificationConfirmationFields.length

    if (completedTasks === 0) return { status: "Not Started", variant: "secondary" }
    if (completedTasks === totalTasks) return { status: "Completed", variant: "success" }
    return { status: "In Progress", variant: "warning" }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  }

  if (!qualificationConfirmation) {
    return <div className="flex items-center justify-center h-screen">No data available</div>
  }

  const { status, variant } = getCompletionStatus()

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={handleBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Qualification Confirmation Details</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">ID: {qualificationConfirmation._id}</CardTitle>
                  <CardDescription>
                    Created: {new Date(qualificationConfirmation.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant={variant}>{status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Completion</h3>
                  <p className="text-2xl font-bold">
                    {qualificationConfirmationFields.filter((field) => qualificationConfirmation[field]?.value).length}{" "}
                    / {qualificationConfirmationFields.length}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="text-2xl font-bold">
                    {new Date(qualificationConfirmation.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="mb-2 text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-2xl font-bold">{status}</p>
                </div>
              </div>
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
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Detailed View</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>Summary of all qualification confirmation items</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {qualificationConfirmationFields.map((field) => (
                        <TableRow key={field}>
                          <TableCell className="font-medium">
                            {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </TableCell>
                          <TableCell>
                            {qualificationConfirmation[field]?.value ? (
                              <Badge variant="success" className="flex items-center justify-center w-24">
                                <CheckCircle className="w-4 h-4 mr-1" /> Completed
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="flex items-center justify-center w-24">
                                <XCircle className="w-4 h-4 mr-1" /> Pending
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed View</CardTitle>
                  <CardDescription>Detailed information for each item</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-6">
                      {qualificationConfirmationFields.map((field) => (
                        <Card
                          key={field}
                          className="border-l-4"
                          style={{ borderLeftColor: qualificationConfirmation[field]?.value ? "#10b981" : "#d1d5db" }}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">
                              {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </CardTitle>
                            <CardDescription>
                              Status: {qualificationConfirmation[field]?.value ? "Completed" : "Pending"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {qualificationConfirmation[field]?.task && (
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex items-center">
                                  <User className="w-5 h-5 mr-2 text-gray-500" />
                                  <span className="font-medium">Responsible:</span>
                                  <span className="ml-2">
                                    {qualificationConfirmation[field]?.task.responsible || "Not assigned"}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                                  <span className="font-medium">Planned:</span>
                                  <span className="ml-2">
                                    {qualificationConfirmation[field]?.task.planned
                                      ? format(new Date(qualificationConfirmation[field]?.task.planned), "PPP")
                                      : "Not scheduled"}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle className="w-5 h-5 mr-2 text-gray-500" />
                                  <span className="font-medium">Completed:</span>
                                  <span className="ml-2">
                                    {qualificationConfirmation[field]?.task.done
                                      ? format(new Date(qualificationConfirmation[field]?.task.done), "PPP")
                                      : "Not completed"}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <FileText className="w-5 h-5 mr-2 text-gray-500" />
                                  <span className="font-medium">File:</span>
                                  <span className="ml-2">
                                    {qualificationConfirmation[field]?.task.filePath || "No file attached"}
                                  </span>
                                </div>
                                {qualificationConfirmation[field]?.task.comments && (
                                  <div className="md:col-span-2">
                                    <p className="font-medium">Comments:</p>
                                    <p className="mt-1 text-gray-600">
                                      {qualificationConfirmation[field]?.task.comments}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>All tasks associated with this qualification confirmation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Responsible</TableHead>
                        <TableHead>Planned Date</TableHead>
                        <TableHead>Completion Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {qualificationConfirmationFields.map((field) => (
                        <TableRow key={field}>
                          <TableCell className="font-medium">
                            {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </TableCell>
                          <TableCell>{qualificationConfirmation[field]?.task?.responsible || "Not assigned"}</TableCell>
                          <TableCell>
                            {qualificationConfirmation[field]?.task?.planned
                              ? format(new Date(qualificationConfirmation[field]?.task.planned), "PP")
                              : "Not scheduled"}
                          </TableCell>
                          <TableCell>
                            {qualificationConfirmation[field]?.task?.done
                              ? format(new Date(qualificationConfirmation[field]?.task.done), "PP")
                              : "Not completed"}
                          </TableCell>
                          <TableCell>
                            {qualificationConfirmation[field]?.value ? (
                              <Badge variant="success">Completed</Badge>
                            ) : (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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

export default QualificationConfirmationDetails

