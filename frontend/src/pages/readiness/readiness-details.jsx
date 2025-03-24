"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getReadinessById, deleteReadiness } from "../../apis/readiness/readinessApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Mail,
  User,
  FileText,
} from "lucide-react"
import MainLayout from "@/components/MainLayout"
import { fieldDefinitions } from "../../components/readiness/readinessUtils"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const ReadinessDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [readiness, setReadiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("general")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Fetch readiness details
  useEffect(() => {
    const fetchReadinessDetails = async () => {
      try {
        setLoading(true)
        const response = await getReadinessById(id)
        setReadiness(response.data)
      } catch (error) {
        console.error("Error fetching readiness details:", error)

        // Provide a more specific error message based on the error
        let errorMessage = "Failed to fetch readiness details"

        if (error.response?.status === 500) {
          if (error.response.data?.error?.includes("strictPopulate")) {
            errorMessage = "Database schema mismatch. Please contact your administrator."
          } else {
            errorMessage = "Server error. Please try again later."
          }
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchReadinessDetails()
    }
  }, [id, toast])

  // Handle delete action
  const handleDelete = async () => {
    try {
      await deleteReadiness(id)
      toast({
        title: "Success",
        description: "Readiness entry deleted successfully",
      })
      navigate("/readiness")
    } catch (error) {
      console.error("Error deleting readiness entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete readiness entry",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case "on-going":
        return (
          <Badge variant="default" className="bg-blue-500">
            On-going
          </Badge>
        )
      case "stand-by":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Stand-by
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="default" className="bg-green-500">
            Closed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="default" className="bg-red-500">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Calculate completion percentage for a section
  const calculateSectionCompletion = (sectionData, sectionFields) => {
    if (!sectionData) return 0

    const totalFields = Object.keys(sectionFields).length
    let completedFields = 0

    Object.keys(sectionFields).forEach((field) => {
      if (sectionData[field] && sectionData[field].value === true) {
        completedFields++
      }
    })

    return Math.round((completedFields / totalFields) * 100)
  }

  // Calculate overall completion
  const calculateOverallCompletion = () => {
    if (!readiness) return 0

    const sections = [
      { data: readiness.Documentation, fields: fieldDefinitions.Documentation },
      { data: readiness.Logistics, fields: fieldDefinitions.Logistics },
      { data: readiness.Maintenance, fields: fieldDefinitions.Maintenance },
      { data: readiness.Packaging, fields: fieldDefinitions.Packaging },
      { data: readiness.ProcessStatusIndustrials, fields: fieldDefinitions.ProcessStatusIndustrials },
      { data: readiness.ProductProcess, fields: fieldDefinitions.ProductProcess },
      { data: readiness.RunAtRateProduction, fields: fieldDefinitions.RunAtRateProduction },
      { data: readiness.Safety, fields: fieldDefinitions.Safety },
      { data: readiness.Supp, fields: fieldDefinitions.Supp },
      { data: readiness.ToolingStatus, fields: fieldDefinitions.ToolingStatus },
      { data: readiness.Training, fields: fieldDefinitions.Training },
    ]

    let totalCompletion = 0
    let validSections = 0

    sections.forEach((section) => {
      if (section.data) {
        totalCompletion += calculateSectionCompletion(section.data, section.fields)
        validSections++
      }
    })

    return validSections > 0 ? Math.round(totalCompletion / validSections) : 0
  }

  // Render validation section
  const renderValidationSection = (sectionData, sectionFields, sectionTitle) => {
    if (!sectionData) {
      return (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No {sectionTitle} data available</p>
        </div>
      )
    }

    const completion = calculateSectionCompletion(sectionData, sectionFields)

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Completion</span>
            <span className="text-sm font-medium">{completion}%</span>
          </div>
          <Progress value={completion} className="h-2" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(sectionFields).map((field) => {
            const fieldData = sectionData[field] || {}
            const isCompleted = fieldData.value === true

            return (
              <Card key={field} className={`border ${isCompleted ? "border-green-200" : "border-gray-200"}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm font-medium">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2 text-gray-400" />
                    )}
                    {sectionFields[field]}
                  </CardTitle>
                </CardHeader>
                {fieldData.details && (
                  <CardContent className="pt-0 text-xs">
                    {fieldData.details.validation_check && (
                      <div className="mt-1">
                        <span className="font-semibold">Status:</span>{" "}
                        {fieldData.details.ok_nok === "OK" ? (
                          <span className="text-green-600">OK</span>
                        ) : (
                          <span className="text-red-600">NOK</span>
                        )}
                      </div>
                    )}
                    {fieldData.details.who && (
                      <div className="mt-1">
                        <span className="font-semibold">Validated by:</span> {fieldData.details.who}
                      </div>
                    )}
                    {fieldData.details.when && (
                      <div className="mt-1">
                        <span className="font-semibold">Date:</span> {fieldData.details.when}
                      </div>
                    )}
                    {fieldData.details.comment && (
                      <div className="mt-1">
                        <span className="font-semibold">Comment:</span> {fieldData.details.comment}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-6 mx-auto">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading readiness details...</span>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!readiness) {
    return (
      <MainLayout>
        <div className="container py-6 mx-auto">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="w-12 h-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">Readiness entry not found</h3>
            <p className="mt-1 mb-4 text-muted-foreground">
              The readiness entry you're looking for doesn't exist or has been deleted
            </p>
            <Button onClick={() => navigate("/readiness")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Readiness List
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const overallCompletion = calculateOverallCompletion()

  return (
    <MainLayout>
      <motion.div className="container py-6 mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/readiness")} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="flex items-center text-2xl font-bold">
                {readiness.project_name}
                <span className="ml-3">{getStatusBadge(readiness.status)}</span>
              </h1>
              <p className="text-muted-foreground">ID: {readiness.id}</p>
            </div>
          </div>
          <div className="flex mt-4 space-x-2 md:mt-0">
            <Button variant="outline" onClick={() => navigate(`/readiness/${id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col space-y-1.5">
                <span className="flex items-center text-sm font-medium text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  Assigned To
                </span>
                <span>{readiness.assignedEmail || "N/A"}</span>
              </div>
              <div className="flex flex-col space-y-1.5">
                <span className="flex items-center text-sm font-medium text-muted-foreground">
                  <User className="w-4 h-4 mr-2" />
                  Role
                </span>
                <span>{readiness.assignedRole || "N/A"}</span>
              </div>
              <div className="flex flex-col space-y-1.5">
                <span className="flex items-center text-sm font-medium text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Created
                </span>
                <span>{formatDate(readiness.createdAt)}</span>
              </div>
              <div className="flex flex-col space-y-1.5">
                <span className="flex items-center text-sm font-medium text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  Last Updated
                </span>
                <span>{formatDate(readiness.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm font-medium">{overallCompletion}%</span>
              </div>
              <Progress value={overallCompletion} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap mb-6">
            <TabsTrigger value="general" className="flex-grow">
              General
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex-grow">
              Documentation
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex-grow">
              Logistics
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex-grow">
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="packaging" className="flex-grow">
              Packaging
            </TabsTrigger>
            <TabsTrigger value="process" className="flex-grow">
              Process Status
            </TabsTrigger>
            <TabsTrigger value="product" className="flex-grow">
              Product Process
            </TabsTrigger>
            <TabsTrigger value="production" className="flex-grow">
              Production
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex-grow">
              Safety
            </TabsTrigger>
            <TabsTrigger value="supp" className="flex-grow">
              Supp
            </TabsTrigger>
            <TabsTrigger value="tooling" className="flex-grow">
              Tooling Status
            </TabsTrigger>
            <TabsTrigger value="training" className="flex-grow">
              Training
            </TabsTrigger>
          </TabsList>

          <motion.div key={activeTab} initial="hidden" animate="visible" variants={slideUp} exit={{ opacity: 0 }}>
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Basic information about this readiness entry</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {readiness.description ? (
                    <div className="space-y-2">
                      <h3 className="font-medium">Description</h3>
                      <p className="text-muted-foreground">{readiness.description}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No description provided</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentation">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>Documentation requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Documentation, fieldDefinitions.Documentation, "documentation")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logistics">
              <Card>
                <CardHeader>
                  <CardTitle>Logistics</CardTitle>
                  <CardDescription>Logistics requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Logistics, fieldDefinitions.Logistics, "logistics")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance</CardTitle>
                  <CardDescription>Maintenance requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Maintenance, fieldDefinitions.Maintenance, "maintenance")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="packaging">
              <Card>
                <CardHeader>
                  <CardTitle>Packaging</CardTitle>
                  <CardDescription>Packaging requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Packaging, fieldDefinitions.Packaging, "packaging")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="process">
              <Card>
                <CardHeader>
                  <CardTitle>Process Status Industrials</CardTitle>
                  <CardDescription>Process status requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(
                    readiness.ProcessStatusIndustrials,
                    fieldDefinitions.ProcessStatusIndustrials,
                    "process status",
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="product">
              <Card>
                <CardHeader>
                  <CardTitle>Product Process</CardTitle>
                  <CardDescription>Product process requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(
                    readiness.ProductProcess,
                    fieldDefinitions.ProductProcess,
                    "product process",
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="production">
              <Card>
                <CardHeader>
                  <CardTitle>Run At Rate Production</CardTitle>
                  <CardDescription>Production requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(
                    readiness.RunAtRateProduction,
                    fieldDefinitions.RunAtRateProduction,
                    "production",
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety">
              <Card>
                <CardHeader>
                  <CardTitle>Safety</CardTitle>
                  <CardDescription>Safety requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Safety, fieldDefinitions.Safety, "safety")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="supp">
              <Card>
                <CardHeader>
                  <CardTitle>Supp</CardTitle>
                  <CardDescription>Supp requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>{renderValidationSection(readiness.Supp, fieldDefinitions.Supp, "supp")}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tooling">
              <Card>
                <CardHeader>
                  <CardTitle>Tooling Status</CardTitle>
                  <CardDescription>Tooling requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.ToolingStatus, fieldDefinitions.ToolingStatus, "tooling status")}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="training">
              <Card>
                <CardHeader>
                  <CardTitle>Training</CardTitle>
                  <CardDescription>Training requirements for this readiness entry</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderValidationSection(readiness.Training, fieldDefinitions.Training, "training")}
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the readiness entry
                <span className="font-semibold"> {readiness.project_name}</span>. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </MainLayout>
  )
}

export default ReadinessDetails

