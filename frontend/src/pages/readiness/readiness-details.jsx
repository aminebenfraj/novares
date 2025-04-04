"use client"
  
import MainLayout from "@/components/MainLayout"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getReadinessById, deleteReadiness } from "../../apis/readiness/readinessApi"
import { getDocumentationById } from "../../apis/readiness/documentationApi"
import { getLogisticsById } from "../../apis/readiness/logisticsApi"
import { getMaintenanceById } from "../../apis/readiness/maintenanceApi"
import { getPackagingById } from "../../apis/readiness/packagingApi"
import { getProcessStatusIndustrialsById } from "../../apis/readiness/processStatusIndustrialsApi"
import { getProductProcessesById } from "../../apis/readiness/productProcessesApi"
import { getRunAtRateProductionById } from "../../apis/readiness/runAtRateProductionApi"
import { getSafetyById } from "../../apis/readiness/safetyApi"
import { getSuppById } from "../../apis/readiness/suppApi"
import { getToolingStatusById } from "../../apis/readiness/toolingStatusApi"
import { getTrainingById } from "../../apis/readiness/trainingApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  AlertTriangle,
  ChevronRight,
  CircleAlert,
  Factory,
  HelpCircle,
  LayoutDashboard,
  Package,
  PenLine,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  XCircle,
  FileTextIcon as FileText2,
  PenToolIcon as Tool,
  Wrench,
  Truck,
  Users,
  GraduationCap,
  Cog,
} from "lucide-react"

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const ReadinessDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [readiness, setReadiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // State for section data
  const [sectionData, setSectionData] = useState({
    documentation: null,
    logistics: null,
    maintenance: null,
    packaging: null,
    processStatusIndustrials: null,
    productProcess: null,
    runAtRateProduction: null,
    safety: null,
    supp: null,
    toolingStatus: null,
    training: null,
  })

  // State for section loading
  const [sectionLoading, setSectionLoading] = useState({
    documentation: false,
    logistics: false,
    maintenance: false,
    packaging: false,
    processStatusIndustrials: false,
    productProcess: false,
    runAtRateProduction: false,
    safety: false,
    supp: false,
    toolingStatus: false,
    training: false,
  })

  // Fetch main data on component mount
  useEffect(() => {
    fetchReadiness()
  }, [id])

  // Calculate completion percentage when data changes
  useEffect(() => {
    if (readiness) {
      const percentage = calculateCompletionPercentage(readiness)
      setCompletionPercentage(percentage)
    }
  }, [readiness])

  // Fetch section data when tab changes
  useEffect(() => {
    if (readiness && activeTab !== "overview") {
      fetchSectionData(activeTab)
    }
  }, [activeTab, readiness])

  const fetchReadiness = async () => {
    if (!id) {
      setError("Invalid Readiness ID")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log("Fetching readiness with ID:", id)
      const response = await getReadinessById(id)
      console.log("Fetched readiness data:", response)

      if (!response) {
        throw new Error("Failed to fetch readiness data")
      }

      setReadiness(response)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch readiness:", error)
      setError("Failed to fetch readiness. Please try again later.")
      toast({
        title: "Error",
        description: "Failed to fetch readiness details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSectionData = async (section) => {
    if (!readiness) return

    // Map tab value to section key
    const sectionKey = getSectionKeyFromTab(section)
    if (!sectionKey) return

    // Set loading state for the section
    setSectionLoading((prev) => ({ ...prev, [sectionKey]: true }))

    try {
      switch (sectionKey) {
        case "documentation":
          if (!sectionData.documentation && readiness.Documentation) {
            await fetchDocumentationData()
          }
          break
        case "logistics":
          if (!sectionData.logistics && readiness.Logistics) {
            await fetchLogisticsData()
          }
          break
        case "maintenance":
          if (!sectionData.maintenance && readiness.Maintenance) {
            await fetchMaintenanceData()
          }
          break
        case "packaging":
          if (!sectionData.packaging && readiness.Packaging) {
            await fetchPackagingData()
          }
          break
        case "processStatusIndustrials":
          if (!sectionData.processStatusIndustrials && readiness.ProcessStatusIndustrials) {
            await fetchProcessStatusIndustrialsData()
          }
          break
        case "productProcess":
          if (!sectionData.productProcess && readiness.ProductProcess) {
            await fetchProductProcessData()
          }
          break
        case "runAtRateProduction":
          if (!sectionData.runAtRateProduction && readiness.RunAtRateProduction) {
            await fetchRunAtRateProductionData()
          }
          break
        case "safety":
          if (!sectionData.safety && readiness.Safety) {
            await fetchSafetyData()
          }
          break
        case "supp":
          if (!sectionData.supp && readiness.Suppliers) {
            await fetchSuppData()
          }
          break
        case "toolingStatus":
          if (!sectionData.toolingStatus && readiness.ToolingStatus) {
            await fetchToolingStatusData()
          }
          break
        case "training":
          if (!sectionData.training && readiness.Training) {
            await fetchTrainingData()
          }
          break
      }
    } catch (error) {
      console.error(`Failed to fetch ${sectionKey} data:`, error)
      toast({
        title: "Error",
        description: `Failed to load ${sectionKey} data. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setSectionLoading((prev) => ({ ...prev, [sectionKey]: false }))
    }
  }

  const getSectionKeyFromTab = (tabValue) => {
    const mapping = {
      documentation: "documentation",
      logistics: "logistics",
      maintenance: "maintenance",
      packaging: "packaging",
      processstatus: "processStatusIndustrials",
      productprocess: "productProcess",
      production: "runAtRateProduction",
      safety: "safety",
      suppliers: "supp",
      tooling: "toolingStatus",
      training: "training",
    }
    return mapping[tabValue]
  }

  const fetchDocumentationData = async () => {
    if (!readiness) return

    const documentationId = readiness.Documentation
    if (!documentationId) return

    try {
      const id = typeof documentationId === "object" ? documentationId._id : documentationId
      console.log("Fetching documentation with ID:", id)
      const response = await getDocumentationById(id)
      console.log("Fetched documentation data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, documentation: data }))
    } catch (error) {
      console.error("Failed to fetch documentation data:", error)
    }
  }

  const fetchLogisticsData = async () => {
    if (!readiness) return

    const logisticsId = readiness.Logistics
    if (!logisticsId) return

    try {
      const id = typeof logisticsId === "object" ? logisticsId._id : logisticsId
      console.log("Fetching logistics with ID:", id)
      const response = await getLogisticsById(id)
      console.log("Fetched logistics data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, logistics: data }))
    } catch (error) {
      console.error("Failed to fetch logistics data:", error)
    }
  }

  const fetchMaintenanceData = async () => {
    if (!readiness) return

    const maintenanceId = readiness.Maintenance
    if (!maintenanceId) return

    try {
      const id = typeof maintenanceId === "object" ? maintenanceId._id : maintenanceId
      console.log("Fetching maintenance with ID:", id)
      const response = await getMaintenanceById(id)
      console.log("Fetched maintenance data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, maintenance: data }))
    } catch (error) {
      console.error("Failed to fetch maintenance data:", error)
    }
  }

  const fetchPackagingData = async () => {
    if (!readiness) return

    const packagingId = readiness.Packaging
    if (!packagingId) return

    try {
      const id = typeof packagingId === "object" ? packagingId._id : packagingId
      console.log("Fetching packaging with ID:", id)
      const response = await getPackagingById(id)
      console.log("Fetched packaging data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, packaging: data }))
    } catch (error) {
      console.error("Failed to fetch packaging data:", error)
    }
  }

  const fetchProcessStatusIndustrialsData = async () => {
    if (!readiness) return

    const processStatusId = readiness.ProcessStatusIndustrials
    if (!processStatusId) return

    try {
      const id = typeof processStatusId === "object" ? processStatusId._id : processStatusId
      console.log("Fetching process status with ID:", id)
      const response = await getProcessStatusIndustrialsById(id)
      console.log("Fetched process status data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, processStatusIndustrials: data }))
    } catch (error) {
      console.error("Failed to fetch process status data:", error)
    }
  }

  const fetchProductProcessData = async () => {
    if (!readiness) return

    const productProcessId = readiness.ProductProcess
    if (!productProcessId) return

    try {
      const id = typeof productProcessId === "object" ? productProcessId._id : productProcessId
      console.log("Fetching product process with ID:", id)
      const response = await getProductProcessesById(id)
      console.log("Fetched product process data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, productProcess: data }))
    } catch (error) {
      console.error("Failed to fetch product process data:", error)
    }
  }

  const fetchRunAtRateProductionData = async () => {
    if (!readiness) return

    const productionId = readiness.RunAtRateProduction
    if (!productionId) return

    try {
      const id = typeof productionId === "object" ? productionId._id : productionId
      console.log("Fetching production with ID:", id)
      const response = await getRunAtRateProductionById(id)
      console.log("Fetched production data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, runAtRateProduction: data }))
    } catch (error) {
      console.error("Failed to fetch production data:", error)
    }
  }

  const fetchSafetyData = async () => {
    if (!readiness) return

    const safetyId = readiness.Safety
    if (!safetyId) return

    try {
      const id = typeof safetyId === "object" ? safetyId._id : safetyId
      console.log("Fetching safety with ID:", id)
      const response = await getSafetyById(id)
      console.log("Fetched safety data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, safety: data }))
    } catch (error) {
      console.error("Failed to fetch safety data:", error)
    }
  }

  const fetchSuppData = async () => {
    if (!readiness) return

    const suppId = readiness.Suppliers
    if (!suppId) return

    try {
      const id = typeof suppId === "object" ? suppId._id : suppId
      console.log("Fetching suppliers with ID:", id)
      const response = await getSuppById(id)
      console.log("Fetched suppliers data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, supp: data }))
    } catch (error) {
      console.error("Failed to fetch suppliers data:", error)
    }
  }

  const fetchToolingStatusData = async () => {
    if (!readiness) return

    const toolingId = readiness.ToolingStatus
    if (!toolingId) return

    try {
      const id = typeof toolingId === "object" ? toolingId._id : toolingId
      console.log("Fetching tooling status with ID:", id)
      const response = await getToolingStatusById(id)
      console.log("Fetched tooling status data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, toolingStatus: data }))
    } catch (error) {
      console.error("Failed to fetch tooling status data:", error)
    }
  }

  const fetchTrainingData = async () => {
    if (!readiness) return

    const trainingId = readiness.Training
    if (!trainingId) return

    try {
      const id = typeof trainingId === "object" ? trainingId._id : trainingId
      console.log("Fetching training with ID:", id)
      const response = await getTrainingById(id)
      console.log("Fetched training data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, training: data }))
    } catch (error) {
      console.error("Failed to fetch training data:", error)
    }
  }

  const calculateCompletionPercentage = (data) => {
    if (!data) return 0

    const stages = [
      { key: "documentation", data: data.Documentation },
      { key: "logistics", data: data.Logistics },
      { key: "maintenance", data: data.Maintenance },
      { key: "packaging", data: data.Packaging },
      { key: "processStatusIndustrials", data: data.ProcessStatusIndustrials },
      { key: "productProcess", data: data.ProductProcess },
      { key: "runAtRateProduction", data: data.RunAtRateProduction },
      { key: "safety", data: data.Safety },
      { key: "supp", data: data.Suppliers },
      { key: "toolingStatus", data: data.ToolingStatus },
      { key: "training", data: data.Training },
    ]

    // Count total stages and completed stages
    const totalStages = stages.length
    const completedStages = stages.filter((stage) => isStageCompleted(stage.data)).length

    return Math.round((completedStages / totalStages) * 100)
  }

  const isStageCompleted = (stage) => {
    if (!stage) return false

    // Check if stage has a 'check' property that is true
    if (stage.check === true) return true

    // Check if stage has a 'value' property that is true
    if (stage.value === true) return true

    // If stage is an object with nested properties
    if (typeof stage === "object") {
      // For objects with task properties, check if all tasks are completed
      const tasks = Object.entries(stage).filter(
        ([key, value]) => typeof value === "object" && value !== null && !key.startsWith("_") && key !== "checkin",
      )

      if (tasks.length > 0) {
        // Calculate percentage of completed tasks
        const completedTasks = tasks.filter(
          ([_, value]) => value.value === true || value.check === true || (value.task && value.task.check === true),
        ).length

        // Consider completed if at least 80% of tasks are done
        return completedTasks / tasks.length >= 0.8
      }

      // Check if any property has a 'check' or 'value' that is true
      return Object.values(stage).some((prop) => {
        if (typeof prop === "object" && prop !== null) {
          return prop.check === true || prop.value === true
        }
        return false
      })
    }

    return false
  }

  const getStageStatus = (stage) => {
    if (!stage) return { status: "missing", label: "Missing", color: "gray", percentage: 0 }

    if (isStageCompleted(stage)) {
      return { status: "completed", label: "Completed", color: "green", percentage: 100 }
    }

    // Calculate percentage for in-progress stages
    const percentage = calculateStagePercentage(stage)
    return {
      status: "inProgress",
      label: "In Progress",
      color: "amber",
      percentage: percentage,
    }
  }

  const calculateStagePercentage = (stage) => {
    if (!stage) return 0

    // If it's a simple object with a direct check or value
    if (stage.check !== undefined || stage.value !== undefined) {
      return stage.check || stage.value ? 100 : 0
    }

    // For complex objects with tasks
    const tasks = Object.entries(stage).filter(
      ([key, value]) => typeof value === "object" && value !== null && !key.startsWith("_") && key !== "checkin",
    )

    if (tasks.length === 0) return 0

    const completedTasks = tasks.filter(
      ([_, value]) => value.value === true || value.check === true || (value.task && value.task.check === true),
    ).length

    return Math.round((completedTasks / tasks.length) * 100)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  const handleEdit = () => {
    navigate(`/readiness/edit/${id}`)
  }

  const handleBack = () => {
    navigate("/readiness")
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteReadiness(id)
      toast({
        title: "Success",
        description: "Readiness entry deleted successfully",
      })
      navigate("/readiness")
    } catch (error) {
      console.error("Failed to delete readiness entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete readiness entry",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
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

  // Render loading skeleton
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background">
          <div className="container px-4 py-8 mx-auto">
            <div className="flex items-center mb-6">
              <Skeleton className="w-24 h-10 mr-4" />
              <Skeleton className="w-64 h-10" />
            </div>

            <div className="space-y-6">
              <Skeleton className="w-full h-64 rounded-lg" />
              <Skeleton className="w-full rounded-lg h-96" />
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Render error state
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background">
          <div className="container px-4 py-8 mx-auto">
            <Alert variant="destructive" className="mb-6">
              <CircleAlert className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Render not found state
  if (!readiness) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background">
          <div className="container px-4 py-8 mx-auto">
            <Alert className="mb-6">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>Not Found</AlertTitle>
              <AlertDescription>The requested readiness entry could not be found.</AlertDescription>
            </Alert>

            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const statusBadge = getStatusBadge(readiness.status)

  // Define stage data for the dashboard
  const stages = [
    {
      id: "documentation",
      name: "Documentation",
      icon: <FileText2 className="w-5 h-5 text-blue-500" />,
      data: readiness.Documentation,
      path: "documentation",
    },
    {
      id: "logistics",
      name: "Logistics",
      icon: <Truck className="w-5 h-5 text-indigo-500" />,
      data: readiness.Logistics,
      path: "logistics",
    },
    {
      id: "maintenance",
      name: "Maintenance",
      icon: <Wrench className="w-5 h-5 text-green-500" />,
      data: readiness.Maintenance,
      path: "maintenance",
    },
    {
      id: "packaging",
      name: "Packaging",
      icon: <Package className="w-5 h-5 text-amber-500" />,
      data: readiness.Packaging,
      path: "packaging",
    },
    {
      id: "processStatusIndustrials",
      name: "Process Status",
      icon: <Cog className="w-5 h-5 text-purple-500" />,
      data: readiness.ProcessStatusIndustrials,
      path: "process-status",
    },
    {
      id: "productProcess",
      name: "Product Process",
      icon: <Settings className="w-5 h-5 text-orange-500" />,
      data: readiness.ProductProcess,
      path: "product-process",
    },
    {
      id: "runAtRateProduction",
      name: "Production",
      icon: <Factory className="w-5 h-5 text-cyan-500" />,
      data: readiness.RunAtRateProduction,
      path: "production",
    },
    {
      id: "safety",
      name: "Safety",
      icon: <ShieldCheck className="w-5 h-5 text-red-500" />,
      data: readiness.Safety,
      path: "safety",
    },
    {
      id: "supp",
      name: "Suppliers",
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      data: readiness.Suppliers,
      path: "suppliers",
    },
    {
      id: "toolingStatus",
      name: "Tooling Status",
      icon: <Tool className="w-5 h-5 text-pink-500" />,
      data: readiness.ToolingStatus,
      path: "tooling-status",
    },
    {
      id: "training",
      name: "Training",
      icon: <GraduationCap className="w-5 h-5 text-yellow-500" />,
      data: readiness.Training,
      path: "training",
    },
  ]

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-8 mx-auto">
          {/* Header with actions */}
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <Button variant="outline" onClick={handleBack} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Readiness Dashboard</h1>
                <p className="text-muted-foreground">Manage and track readiness progress</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEdit} variant="outline">
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure you want to delete?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete the readiness entry and all associated
                      data.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleting}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                      {deleting ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Project Overview Card */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-2 shadow-md">
                <CardHeader className="pb-4 bg-slate-50">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-semibold text-slate-800">{readiness.project_name}</CardTitle>
                        <Badge variant={statusBadge.variant} className="flex items-center">
                          {statusBadge.icon}
                          {readiness.status}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">ID: {readiness.id}</CardDescription>
                    </div>
                    <div className="flex flex-col items-start gap-1 md:items-end">
                      <div className="flex items-center">
                        <span className="mr-2 text-sm text-muted-foreground">Overall Progress:</span>
                        <span className="text-sm font-medium">{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="w-full h-2 md:w-40" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Assigned Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Assigned To</h3>
                        <div className="flex items-center p-3 border rounded-md bg-slate-50 border-slate-200">
                          <Avatar className="w-10 h-10 mr-3">
                            <AvatarImage src="/placeholder-user.jpg" alt="Assigned User" />
                            <AvatarFallback>{readiness.assignedEmail?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{readiness.assignedEmail || "Not assigned"}</p>
                            <p className="text-xs text-muted-foreground">{readiness.assignedRole || "No role"}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Project Details</h3>
                        <div className="p-3 border rounded-md bg-slate-50 border-slate-200">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-slate-500" />
                            <p className="font-medium">Project Information</p>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {readiness.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Key Dates */}
                    <div className="space-y-4">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Key Dates</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 border rounded-md bg-slate-50 border-slate-200">
                          <p className="text-xs text-muted-foreground">Created</p>
                          <p className="font-medium">{formatDate(readiness.createdAt)}</p>
                        </div>
                        <div className="p-3 border rounded-md bg-slate-50 border-slate-200">
                          <p className="text-xs text-muted-foreground">Last Updated</p>
                          <p className="font-medium">{formatDate(readiness.updatedAt)}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Completion Timeline</h3>
                        <div className="p-3 border rounded-md bg-slate-50 border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Progress:</span>
                            <Badge
                              variant={
                                completionPercentage > 70
                                  ? "success"
                                  : completionPercentage > 30
                                    ? "outline"
                                    : "warning"
                              }
                            >
                              {completionPercentage}% complete
                            </Badge>
                          </div>
                          <Progress value={completionPercentage} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* Status Overview */}
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Status Overview</h3>
                      <div className="h-full p-3 border rounded-md bg-slate-50 border-slate-200">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Documentation</span>
                            <Badge
                              variant={
                                getStageStatus(readiness.Documentation).status === "completed" ? "success" : "outline"
                              }
                            >
                              {getStageStatus(readiness.Documentation).percentage}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Logistics</span>
                            <Badge
                              variant={
                                getStageStatus(readiness.Logistics).status === "completed" ? "success" : "outline"
                              }
                            >
                              {getStageStatus(readiness.Logistics).percentage}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Process Status</span>
                            <Badge
                              variant={
                                getStageStatus(readiness.ProcessStatusIndustrials).status === "completed"
                                  ? "success"
                                  : "outline"
                              }
                            >
                              {getStageStatus(readiness.ProcessStatusIndustrials).percentage}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Safety</span>
                            <Badge
                              variant={getStageStatus(readiness.Safety).status === "completed" ? "success" : "outline"}
                            >
                              {getStageStatus(readiness.Safety).percentage}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Process Stages Dashboard */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-xl text-slate-800">
                      <LayoutDashboard className="w-5 h-5 mr-2 text-primary" />
                      Process Stages
                    </CardTitle>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <HelpCircle className="w-5 h-5" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">Process Stages Overview</h4>
                          <p className="text-sm">
                            This dashboard shows the status of each process stage. Click on a stage to view details or
                            add missing information.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="success" className="gap-1">
                              <CheckCircle className="w-3 h-3" /> Completed
                            </Badge>
                            <Badge variant="warning" className="gap-1">
                              <Clock className="w-3 h-3" /> In Progress
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <Plus className="w-3 h-3" /> Missing
                            </Badge>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <CardDescription>Track the status of each process stage and add missing information</CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {stages.map((stage) => {
                      const status = getStageStatus(stage.data)
                      return (
                        <motion.div key={stage.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Card
                            className={`border-l-4 ${
                              status.status === "completed"
                                ? "border-l-green-500"
                                : status.status === "inProgress"
                                  ? "border-l-amber-500"
                                  : "border-l-slate-300"
                            } hover:shadow-md transition-all cursor-pointer`}
                            onClick={() => {
                              if (status.status === "missing") {
                                navigate(`/${stage.path}/create?readinessId=${id}`)
                              } else {
                                navigate(
                                  `/${stage.path}/edit/${
                                    typeof stage.data === "object" && stage.data._id
                                      ? stage.data._id
                                      : typeof stage.data === "string"
                                        ? stage.data
                                        : id
                                  }`,
                                )
                              }
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {stage.icon}
                                  <h3 className="ml-2 font-medium">{stage.name}</h3>
                                </div>
                                {status.status === "completed" ? (
                                  <Badge variant="success" className="gap-1">
                                    <CheckCircle className="w-3 h-3" /> Completed
                                  </Badge>
                                ) : status.status === "inProgress" ? (
                                  <Badge variant="warning" className="gap-1">
                                    <Clock className="w-3 h-3" /> {status.percentage}% Done
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="gap-1">
                                    <Plus className="w-3 h-3" /> Add
                                  </Badge>
                                )}
                              </div>
                              <div className="mt-3">
                                {status.status !== "missing" && (
                                  <Progress value={status.percentage} className="h-2 mb-2" />
                                )}
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {status.status === "missing"
                                      ? "Click to add information"
                                      : status.status === "completed"
                                        ? "All requirements met"
                                        : `${status.percentage}% complete`}
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Missing Information Card */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 shadow-md border-amber-200">
                <CardHeader className="bg-amber-50">
                  <CardTitle className="flex items-center text-xl text-amber-800">
                    <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                    Missing Information
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    The following information is missing or incomplete
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {stages
                      .filter((stage) => getStageStatus(stage.data).status === "missing")
                      .map((stage) => (
                        <Button
                          key={stage.id}
                          variant="outline"
                          className="justify-start border-amber-200 hover:border-amber-300 hover:bg-amber-50"
                          onClick={() => navigate(`/${stage.path}/create?readinessId=${id}`)}
                        >
                          <Plus className="w-4 h-4 mr-2 text-amber-500" />
                          Add {stage.name} Information
                        </Button>
                      ))}

                    {stages
                      .filter((stage) => getStageStatus(stage.data).status === "inProgress")
                      .map((stage) => (
                        <Button
                          key={stage.id}
                          variant="outline"
                          className="justify-start border-slate-200"
                          onClick={() => {
                            navigate(
                              `/${stage.path}/edit/${
                                typeof stage.data === "object" && stage.data._id
                                  ? stage.data._id
                                  : typeof stage.data === "string"
                                    ? stage.data
                                    : id
                              }`,
                            )
                          }}
                        >
                          <PenLine className="w-4 h-4 mr-2 text-slate-500" />
                          Complete {stage.name} Information ({getStageStatus(stage.data).percentage}% done)
                        </Button>
                      ))}

                    {stages.filter(
                      (stage) =>
                        getStageStatus(stage.data).status === "missing" ||
                        getStageStatus(stage.data).status === "inProgress",
                    ).length === 0 && (
                      <div className="col-span-2 p-4 text-center border border-green-200 rounded-md bg-green-50">
                        <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                        <p className="font-medium text-green-800">All information is complete!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section Details */}
            {activeTab !== "overview" && (
              <motion.div
                variants={itemVariants}
                id="section-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 shadow-md">
                  <CardHeader className="bg-slate-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-xl text-slate-800">
                        {stages.find((s) => s.id === activeTab)?.icon}
                        <span className="ml-2">{stages.find((s) => s.id === activeTab)?.name} Details</span>
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/${stages.find((s) => s.id === activeTab)?.path}/edit/${id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </div>
                    <CardDescription>Detailed information about this process stage</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    {sectionLoading[activeTab] ? (
                      <div className="flex flex-col items-center justify-center p-12">
                        <div className="w-10 h-10 border-4 rounded-full border-slate-200 border-t-primary animate-spin"></div>
                        <p className="mt-4 font-medium text-slate-600">Loading data...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* This would be replaced with the actual section content */}
                        <p className="text-muted-foreground">
                          Detailed information for {stages.find((s) => s.id === activeTab)?.name} would be displayed
                          here.
                        </p>

                        {/* Example content - would be replaced with actual data */}
                        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Completion Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span className="font-medium">
                                    {getStageStatus(stages.find((s) => s.id === activeTab)?.data).percentage}%
                                  </span>
                                </div>
                                <Progress
                                  value={getStageStatus(stages.find((s) => s.id === activeTab)?.data).percentage}
                                  className="h-2"
                                />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Validation Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Status</span>
                                  <Badge
                                    variant={
                                      getStageStatus(stages.find((s) => s.id === activeTab)?.data).status ===
                                      "completed"
                                        ? "success"
                                        : getStageStatus(stages.find((s) => s.id === activeTab)?.data).status ===
                                            "inProgress"
                                          ? "warning"
                                          : "outline"
                                    }
                                  >
                                    {getStageStatus(stages.find((s) => s.id === activeTab)?.data).label}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Last Updated</span>
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(readiness.updatedAt)}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <Button
                          className="mt-4"
                          onClick={() => {
                            const stage = stages.find((s) => s.id === activeTab)
                            if (stage) {
                              navigate(
                                `/${stage.path}/edit/${
                                  typeof stage.data === "object" && stage.data._id
                                    ? stage.data._id
                                    : typeof stage.data === "string"
                                      ? stage.data
                                      : id
                                }`,
                              )
                            }
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit {stages.find((s) => s.id === activeTab)?.name}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ReadinessDetails

