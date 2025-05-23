"use client"

import { BreadcrumbPage } from "@/components/ui/breadcrumb"

import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getMassProductionById, deleteMassProduction } from "../../apis/massProductionApi"
import { getFeasibilityById } from "../../apis/feasabilityApi"
import { getOkForLunchById } from "../../apis/okForLunch"
import { getKickOffById } from "../../apis/kickOffApi"
import { getProcessQualificationById } from "../../apis/process_qualifApi"
import { getfacilitiesById } from "../../apis/facilitiesApi"
import { getP_P_TuningById } from "../../apis/p-p-tuning-api"
import { getValidationForOfferById } from "../../apis/validationForOfferApi"
import { getQualificationConfirmationById } from "../../apis/qualificationconfirmationApi"
import { getDesignById } from "../../apis/designApi"
import { getAllpd } from "../../apis/ProductDesignation-api"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import MainLayout from "@/components/MainLayout"
import ContactUs from "@/components/ContactUs"

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Icons
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  Edit,
  FileCheck,
  FileText,
  AlertTriangle,
  BarChart,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
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
  CalendarDays,
  Tag,
} from "lucide-react"

// Optimized animation variants with reduced motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Reduced from 0.1
      duration: 0.3, // Added explicit duration
    },
  },
}

const itemVariants = {
  hidden: { y: 10, opacity: 0 }, // Reduced y distance from 20 to 10
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween", // Changed from "spring" to "tween" for smoother animation
      duration: 0.2, // Reduced duration
    },
  },
}

const MassProductionDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [massProduction, setMassProduction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [productDesignations, setProductDesignations] = useState([])

  // State for section data
  const [sectionData, setSectionData] = useState({
    feasibility: null,
    validation: null,
    okForLaunch: null,
    kickOff: null,
    design: null,
    facilities: null,
    ppTuning: null,
    processQualif: null,
    qualifConfirm: null,
  })

  // State for section loading
  const [sectionLoading, setSectionLoading] = useState({
    feasibility: false,
    validation: false,
    okForLaunch: false,
    kickOff: false,
    design: false,
    facilities: false,
    ppTuning: false,
    processQualif: false,
    qualifConfirm: false,
  })

  const navigateToEditPage = useCallback(
    (path, stageData) => {
      // Store the current mass production ID in localStorage for fallback
      if (id) {
        localStorage.setItem("lastMassProductionId", id)
      }

      // Determine the correct ID to use for the edit page
      let editId
      if (stageData) {
        // If the stage data is an object with an _id property
        if (typeof stageData === "object" && stageData._id) {
          editId = stageData._id
        }
        // If the stage data is a string (direct ID reference)
        else if (typeof stageData === "string") {
          editId = stageData
        }
        // If we couldn't extract an ID, use the mass production ID
        else {
          editId = id
        }
      } else {
        editId = id
      }

      // Navigate to the edit page with the ID and a query parameter for the mass production ID
      navigate(`/${path}/edit/${editId}?massProductionId=${id}`)
    },
    [id, navigate],
  )

  // Fetch main data on component mount
  useEffect(() => {
    fetchMassProduction()
    fetchProductDesignations()
  }, [id])

  // Calculate completion percentage when data changes
  useEffect(() => {
    if (massProduction) {
      const percentage = calculateCompletionPercentage(massProduction)
      setCompletionPercentage(percentage)
    }
  }, [massProduction])

  // Fetch section data when tab changes
  useEffect(() => {
    if (massProduction && activeTab !== "overview") {
      fetchSectionData(activeTab)
    }
  }, [activeTab, massProduction])

  const fetchMassProduction = async () => {
    if (!id) {
      setError("Invalid Mass Production ID")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await getMassProductionById(id)

      if (!response) {
        throw new Error("Failed to fetch mass production data")
      }

      setMassProduction(response)
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

  const fetchProductDesignations = async () => {
    try {
      const data = await getAllpd()
      setProductDesignations(data || [])
    } catch (error) {
      console.error("Failed to fetch product designations:", error)
    }
  }

  const fetchSectionData = async (section) => {
    if (!massProduction) return

    // Map tab value to section key
    const sectionKey = getSectionKeyFromTab(section)
    if (!sectionKey) return

    // Set loading state for the section
    setSectionLoading((prev) => ({ ...prev, [sectionKey]: true }))

    try {
      switch (sectionKey) {
        case "feasibility":
          if (!sectionData.feasibility && (massProduction.feasibility || massProduction.feasability)) {
            await fetchFeasibilityData()
          }
          break
        case "validation":
          if (!sectionData.validation && massProduction.validation_for_offer) {
            await fetchValidationData()
          }
          break
        case "okForLaunch":
          if (!sectionData.okForLaunch && massProduction.ok_for_lunch) {
            await fetchOkForLaunchData()
          }
          break
        case "kickOff":
          if (!sectionData.kickOff && massProduction.kick_off) {
            await fetchKickOffData()
          }
          break
        case "design":
          if (!sectionData.design && massProduction.design) {
            await fetchDesignData()
          }
          break
        case "facilities":
          if (!sectionData.facilities && massProduction.facilities) {
            await fetchFacilitiesData()
          }
          break
        case "ppTuning":
          if (!sectionData.ppTuning && massProduction.p_p_tuning) {
            await fetchPPTuningData()
          }
          break
        case "processQualif":
          if (!sectionData.processQualif && massProduction.process_qualif) {
            await fetchProcessQualifData()
          }
          break
        case "qualifConfirm":
          if (!sectionData.qualifConfirm && massProduction.qualification_confirmation) {
            await fetchQualifConfirmData()
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
      feasibility: "feasibility",
      validation: "validation",
      okforlunch: "okForLaunch",
      kickoff: "kickOff",
      design: "design",
      facilities: "facilities",
      pptuning: "ppTuning",
      processqualif: "processQualif",
      qualifconfirm: "qualifConfirm",
    }
    return mapping[tabValue]
  }

  const fetchFeasibilityData = async () => {
    if (!massProduction) return

    const feasibilityId = massProduction.feasibility || massProduction.feasability
    if (!feasibilityId) return

    try {
      const id = typeof feasibilityId === "object" ? feasibilityId._id : feasibilityId
      const response = await getFeasibilityById(id)
      const data = response.data || response
      setSectionData((prev) => ({ ...prev, feasibility: data }))
    } catch (error) {
      console.error("Failed to fetch feasibility data:", error)
    }
  }

  const fetchValidationData = async () => {
    if (!massProduction || !massProduction.validation_for_offer) return

    try {
      const id =
        typeof massProduction.validation_for_offer === "object"
          ? massProduction.validation_for_offer._id
          : massProduction.validation_for_offer

      const response = await getValidationForOfferById(id)
      const data = response.data || response
      setSectionData((prev) => ({ ...prev, validation: data }))
    } catch (error) {
      console.error("Failed to fetch validation data:", error)
    }
  }

  const fetchOkForLaunchData = async () => {
    if (!massProduction || !massProduction.ok_for_lunch) return

    try {
      const id =
        typeof massProduction.ok_for_lunch === "object" ? massProduction.ok_for_lunch._id : massProduction.ok_for_lunch

      const response = await getOkForLunchById(id)
      const data = response.data || response
      setSectionData((prev) => ({ ...prev, okForLaunch: data }))
    } catch (error) {
      console.error("Failed to fetch OK for launch data:", error)
    }
  }

  const fetchKickOffData = async () => {
    if (!massProduction || !massProduction.kick_off) return

    try {
      const id = typeof massProduction.kick_off === "object" ? massProduction.kick_off._id : massProduction.kick_off
      const response = await getKickOffById(id)
      const data = response.data || response
      setSectionData((prev) => ({ ...prev, kickOff: data }))
    } catch (error) {
      console.error("Failed to fetch kick-off data:", error)
    }
  }

  const fetchDesignData = async () => {
    if (!massProduction || !massProduction.design) return

    try {
      const id = typeof massProduction.design === "object" ? massProduction.design._id : massProduction.design
      const response = await getDesignById(id)
      const data = response.data || response
      setSectionData((prev) => ({ ...prev, design: data }))
    } catch (error) {
      console.error("Failed to fetch design data:", error)
    }
  }

  const fetchFacilitiesData = async () => {
    if (!massProduction || !massProduction.facilities) return

    try {
      const id =
        typeof massProduction.facilities === "object" ? massProduction.facilities._id : massProduction.facilities
      const response = await getfacilitiesById(id)
      const data = response.data || response
      setSectionData((prev) => ({ ...prev, facilities: data }))
    } catch (error) {
      console.error("Failed to fetch facilities data:", error)
    }
  }

  const fetchPPTuningData = async () => {
    if (!massProduction || !massProduction.p_p_tuning) return

    try {
      const id =
        typeof massProduction.p_p_tuning === "object" ? massProduction.p_p_tuning._id : massProduction.p_p_tuning
      const response = await getP_P_TuningById(id)
      const data = response.data || response
      setSectionData((prev) => ({ ...prev, ppTuning: data }))
    } catch (error) {
      console.error("Failed to fetch P/P tuning data:", error)
    }
  }

  const fetchProcessQualifData = async () => {
    if (!massProduction || !massProduction.process_qualif) return

    try {
      const id =
        typeof massProduction.process_qualif === "object"
          ? massProduction.process_qualif._id
          : massProduction.process_qualif
      const response = await getProcessQualificationById(id)
      const data = response.data || response
      setSectionData((prev) => ({ ...prev, processQualif: data }))
    } catch (error) {
      console.error("Failed to fetch process qualification data:", error)
    }
  }

  const fetchQualifConfirmData = async () => {
    if (!massProduction || !massProduction.qualification_confirmation) return

    try {
      const id =
        typeof massProduction.qualification_confirmation === "object"
          ? massProduction.qualification_confirmation._id
          : massProduction.qualification_confirmation
      const response = await getQualificationConfirmationById(id)
      const data = response.data || response
      setSectionData((prev) => ({ ...prev, qualifConfirm: data }))
    } catch (error) {
      console.error("Failed to fetch qualification confirmation data:", error)
    }
  }

  const calculateCompletionPercentage = (data) => {
    if (!data) return 0

    const stages = [
      { key: "feasibility", data: data.feasibility || data.feasability, weight: 1.0 },
      { key: "validation", data: data.validation_for_offer, weight: 1.0 },
      { key: "okForLaunch", data: data.ok_for_lunch, weight: 1.0 },
      { key: "kickOff", data: data.kick_off, weight: 1.0 },
      { key: "design", data: data.design, weight: 1.0 },
      { key: "facilities", data: data.facilities, weight: 1.0 },
      { key: "ppTuning", data: data.p_p_tuning, weight: 1.0 },
      { key: "processQualif", data: data.process_qualif, weight: 1.0 },
      { key: "qualifConfirm", data: data.qualification_confirmation, weight: 1.0 },
    ]

    // Calculate total weight and weighted completion
    const totalWeight = stages.reduce((sum, stage) => sum + stage.weight, 0)
    let weightedCompletion = 0

    stages.forEach((stage) => {
      if (!stage.data) return

      // For completed stages
      if (isStageCompleted(stage.data)) {
        weightedCompletion += stage.weight
      }
      // For partially completed stages
      else if (typeof stage.data === "object") {
        const stagePercentage = calculateStagePercentage(stage.data)
        weightedCompletion += (stage.weight * stagePercentage) / 100
      }
    })

    return Math.round((weightedCompletion / totalWeight) * 100)
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

    // More granular status labels based on percentage
    let label = "In Progress"
    let color = "amber"

    if (percentage >= 75) {
      label = "Almost Complete"
      color = "green"
    } else if (percentage >= 50) {
      label = "Halfway Done"
      color = "amber"
    } else if (percentage >= 25) {
      label = "Started"
      color = "orange"
    } else if (percentage > 0) {
      label = "Just Started"
      color = "red"
    }

    return {
      status: "inProgress",
      label: label,
      color: color,
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

    let completedTasksCount = 0
    let totalTasksCount = 0

    // Count completed tasks with proper weighting
    tasks.forEach(([_, value]) => {
      totalTasksCount++

      if (value.value === true || value.check === true || (value.task && value.task.check === true)) {
        completedTasksCount++
      } else if (value.percentage !== undefined) {
        // If task has a percentage, add partial completion
        completedTasksCount += value.percentage / 100
      } else if (typeof value === "object" && Object.keys(value).some((k) => value[k] === true)) {
        // If any property is true, count as partially complete
        const trueProps = Object.values(value).filter((v) => v === true).length
        const totalProps = Object.keys(value).length
        completedTasksCount += trueProps / totalProps
      }
    })

    return Math.round((completedTasksCount / totalTasksCount) * 100)
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
    navigate(`/masspd/edit/${id}`)
  }

  const handleBack = () => {
    navigate("/masspd")
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
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

  // Get product designation details
  const getProductDesignationDetails = (designationId) => {
    return productDesignations.find((pd) => pd._id === designationId || pd.id === designationId)
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
  if (!massProduction) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-background">
          <div className="container px-4 py-8 mx-auto">
            <Alert className="mb-6">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>Not Found</AlertTitle>
              <AlertDescription>The requested mass production record could not be found.</AlertDescription>
            </Alert>

            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const statusBadge = getStatusBadge(massProduction.status)

  // Define stage data for the dashboard
  const stages = [
    {
      id: "feasibility",
      name: "Feasibility",
      icon: <BarChart className="w-5 h-5 text-blue-500" />,
      data: massProduction.feasibility || massProduction.feasability,
      path: "feasibility",
    },
    {
      id: "validation",
      name: "Validation For Offer",
      icon: <FileCheck className="w-5 h-5 text-indigo-500" />,
      data: massProduction.validation_for_offer,
      path: "validationforoffer",
    },
    {
      id: "okForLaunch",
      name: "OK For Launch",
      icon: <CheckSquare className="w-5 h-5 text-green-500" />,
      data: massProduction.ok_for_lunch,
      path: "okforlunch",
    },
    {
      id: "kickOff",
      name: "Kick Off",
      icon: <Calendar className="w-5 h-5 text-amber-500" />,
      data: massProduction.kick_off,
      path: "kickoff",
    },
    {
      id: "design",
      name: "Design",
      icon: <Package className="w-5 h-5 text-purple-500" />,
      data: massProduction.design,
      path: "design",
    },
    {
      id: "facilities",
      name: "Facilities",
      icon: <Factory className="w-5 h-5 text-orange-500" />,
      data: massProduction.facilities,
      path: "facilities",
    },
    {
      id: "ppTuning",
      name: "P/P Tuning",
      icon: <Settings className="w-5 h-5 text-cyan-500" />,
      data: massProduction.p_p_tuning,
      path: "p_p_tuning",
    },
    {
      id: "processQualif",
      name: "Process Qualification",
      icon: <ShieldCheck className="w-5 h-5 text-red-500" />,
      data: massProduction.process_qualif,
      path: "processqualification",
    },
    {
      id: "qualifConfirm",
      name: "Qualification Confirmation",
      icon: <ClipboardCheck className="w-5 h-5 text-emerald-500" />,
      data: massProduction.qualification_confirmation,
      path: "qualificationconfirmation",
    },
  ]

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-8 mx-auto">
          {/* Breadcrumb navigation */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/masspd">Mass Production</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{massProduction.project_n}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header with actions */}
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <Button variant="outline" onClick={handleBack} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mass Production Dashboard</h1>
                <p className="text-muted-foreground">Manage and track production progress</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate(`/masspd/edit/${id}`)} variant="outline">
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
                      This action cannot be undone. This will permanently delete the mass production record and all
                      associated data.
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
            transition={{ staggerChildren: 0.05 }}
          >
            {/* Project Overview Card */}
            <motion.div variants={itemVariants} transition={{ duration: 0.2 }}>
              <Card className="overflow-hidden border shadow-sm">
                <CardHeader className="pb-4 bg-muted/30">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-semibold">{massProduction.project_n}</CardTitle>
                        <Badge variant={statusBadge.variant} className="flex items-center">
                          {statusBadge.icon}
                          {massProduction.status}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">ID: {massProduction.id}</CardDescription>
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
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Customer</h3>
                        <div className="flex items-center p-3 border rounded-md bg-muted/30">
                          <Avatar className="w-10 h-10 mr-3">
                            <AvatarImage src="/placeholder-user.jpg" alt="Customer" />
                            <AvatarFallback>{massProduction.customer?.username?.charAt(0) || "C"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {massProduction.customer ? massProduction.customer.username : "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {massProduction.customer ? massProduction.customer.email : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Dates */}
                    <div className="space-y-4">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Basic Information</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 border rounded-md bg-muted/30">
                          <p className="text-xs text-muted-foreground">Initial Request</p>
                          <p className="font-medium">{formatDate(massProduction.initial_request)}</p>
                        </div>
                        <div className="p-3 border rounded-md bg-muted/30">
                          <p className="text-xs text-muted-foreground">Closure Date</p>
                          <p className="font-medium">
                            {massProduction.closure ? formatDate(massProduction.closure) : "N/A"}
                          </p>
                        </div>
                        <div className="p-3 border rounded-md bg-muted/30">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Customer Offer:</span>
                            <span className="font-medium">
                              {massProduction.customer_offer === "fulfilled" ? "Fulfilled" : "Expected/In Progress"}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 border rounded-md bg-muted/30">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Customer Order:</span>
                            <span className="font-medium">
                              {massProduction.customer_order === "fulfilled" ? "Fulfilled" : "Expected/In Progress"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Designations */}
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Product Designations</h3>
                      {massProduction.product_designation && massProduction.product_designation.length > 0 ? (
                        <div className="h-full p-3 border rounded-md bg-muted/30">
                          <div className="flex flex-wrap gap-2">
                            {massProduction.product_designation.map((product) => {
                              const productId = typeof product === "object" ? product._id : product
                              const productDetail = getProductDesignationDetails(productId)

                              return (
                                <TooltipProvider key={productId}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant="outline"
                                        className="flex items-center gap-1 px-3 py-1 cursor-help"
                                      >
                                        <Tag className="w-3 h-3" />
                                        {productDetail
                                          ? productDetail.part_name
                                          : typeof product === "object"
                                            ? product.part_name
                                            : "Unknown"}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Reference: {productDetail ? productDetail.reference : "N/A"}</p>
                                      {productDetail && productDetail.description && (
                                        <p className="mt-1 text-xs">{productDetail.description}</p>
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            })}
                          </div>

                          {massProduction.description && (
                            <div className="mt-4">
                              <h4 className="mb-1 text-xs font-medium text-muted-foreground">Description</h4>
                              <p className="p-2 text-sm bg-white border rounded-md border-muted/50">
                                {massProduction.description}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full p-4 border rounded-md bg-muted/30">
                          <p className="text-center text-muted-foreground">No product designations available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Process Stages Dashboard */}
            <motion.div variants={itemVariants} transition={{ duration: 0.2 }}>
              <Card className="border shadow-sm">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-xl">
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
                          <div className="flex flex-wrap items-center gap-2 mt-2">
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
                  <CardDescription>Track the status of each process stage</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {stages.map((stage) => {
                      const status = getStageStatus(stage.data)
                      return (
                        <motion.div
                          key={stage.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ type: "tween", duration: 0.1 }}
                        >
                          <Card
                            className={`border-l-4 ${
                              status.status === "completed"
                                ? "border-l-green-500"
                                : status.status === "inProgress"
                                  ? status.percentage >= 75
                                    ? "border-l-green-400"
                                    : status.percentage >= 50
                                      ? "border-l-amber-500"
                                      : status.percentage >= 25
                                        ? "border-l-orange-500"
                                        : "border-l-red-400"
                                  : "border-l-slate-300"
                            } hover:shadow-md transition-all cursor-pointer`}
                            onClick={() => {
                              if (status.status === "missing") {
                                navigate(`/${stage.path}/create?massProductionId=${id}`)
                              } else {
                                navigateToEditPage(stage.path, stage.data)
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
                                  <Badge
                                    variant={
                                      status.percentage >= 75
                                        ? "success"
                                        : status.percentage >= 50
                                          ? "warning"
                                          : "outline"
                                    }
                                    className="gap-1"
                                  >
                                    <Clock className="w-3 h-3" /> {status.percentage}%
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="gap-1">
                                    <Plus className="w-3 h-3" /> Add
                                  </Badge>
                                )}
                              </div>
                              <div className="mt-3">
                                {status.status !== "missing" && (
                                  <div className="relative w-full h-2 mb-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                      className={`absolute top-0 left-0 h-full ${
                                        status.percentage >= 90
                                          ? "bg-green-600"
                                          : status.percentage >= 75
                                            ? "bg-green-500"
                                            : status.percentage >= 50
                                              ? "bg-amber-500"
                                              : status.percentage >= 25
                                                ? "bg-orange-500"
                                                : "bg-red-500"
                                      }`}
                                      style={{ width: `${status.percentage}%` }}
                                    />
                                  </div>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {status.status === "missing"
                                      ? "Click to add information"
                                      : status.status === "completed"
                                        ? "All requirements met"
                                        : status.label}
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
            // Add a new component for tracking summary with shadcn components
            <motion.div variants={itemVariants} transition={{ duration: 0.2 }}>
              <Card className="border shadow-sm">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center text-xl">
                    <BarChart className="w-5 h-5 mr-2 text-primary" />
                    Tracking Summary
                  </CardTitle>
                  <CardDescription>Detailed progress tracking for this mass production</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Overall progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium">Overall Progress</h3>
                        <Badge
                          variant={
                            completionPercentage >= 75 ? "success" : completionPercentage >= 50 ? "warning" : "outline"
                          }
                        >
                          {completionPercentage}% Complete
                        </Badge>
                      </div>
                      <div className="relative w-full h-3 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`absolute top-0 left-0 h-full ${
                            completionPercentage >= 90
                              ? "bg-green-600"
                              : completionPercentage >= 75
                                ? "bg-green-500"
                                : completionPercentage >= 50
                                  ? "bg-amber-500"
                                  : completionPercentage >= 25
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                          }`}
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Stage progress breakdown */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {stages.map((stage) => {
                        const status = getStageStatus(stage.data)
                        return (
                          <div key={stage.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {stage.icon}
                                <span className="ml-2 text-sm font-medium">{stage.name}</span>
                              </div>
                              <span className="text-xs font-medium">{status.percentage}%</span>
                            </div>
                            <div className="relative w-full h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`absolute top-0 left-0 h-full ${
                                  status.percentage >= 90
                                    ? "bg-green-600"
                                    : status.percentage >= 75
                                      ? "bg-green-500"
                                      : status.percentage >= 50
                                        ? "bg-amber-500"
                                        : status.percentage >= 25
                                          ? "bg-orange-500"
                                          : "bg-red-500"
                                }`}
                                style={{ width: `${status.percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Completion estimate */}
                    <div className="p-4 border rounded-md bg-muted/30">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-medium">Estimated Completion</h3>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Current Progress:</span>
                          <span className="font-medium">{completionPercentage}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estimated Completion Date:</span>
                          <span className="font-medium">
                            {massProduction.sop
                              ? formatDate(massProduction.sop)
                              : completionPercentage >= 75
                                ? "On Track"
                                : completionPercentage >= 50
                                  ? "Possible Delays"
                                  : "Needs Attention"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={getStatusBadge(massProduction.status).variant} className="flex items-center">
                            {getStatusBadge(massProduction.status).icon}
                            {massProduction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Timeline Card */}
            <motion.div variants={itemVariants} transition={{ duration: 0.2 }}>
              <Card className="border shadow-sm">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center text-xl">
                    <CalendarDays className="w-5 h-5 mr-2 text-primary" />
                    Project Timeline
                  </CardTitle>
                  <CardDescription>Key milestones and dates for this mass production</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-muted ml-6"></div>

                    <div className="relative space-y-8">
                      {/* Initial Request */}
                      <div className="flex">
                        <div className="z-10 flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-primary/10">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium">Initial Request</h3>
                          <time className="text-sm text-muted-foreground">
                            {formatDate(massProduction.initial_request)}
                          </time>
                          <Badge variant="success" className="ml-2">
                            Completed
                          </Badge>
                        </div>
                      </div>

                      {/* MLO */}
                      {massProduction.mlo && (
                        <div className="flex">
                          <div className="z-10 flex items-center justify-center flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full">
                            <CalendarDays className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium">MLO</h3>
                            <time className="text-sm text-muted-foreground">{formatDate(massProduction.mlo)}</time>
                            <Badge
                              variant={new Date(massProduction.mlo) < new Date() ? "success" : "warning"}
                              className="ml-2"
                            >
                              {new Date(massProduction.mlo) < new Date() ? "Completed" : "Scheduled"}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* TKO */}
                      {massProduction.tko && (
                        <div className="flex">
                          <div className="z-10 flex items-center justify-center flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full">
                            <CalendarDays className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium">TKO</h3>
                            <time className="text-sm text-muted-foreground">{formatDate(massProduction.tko)}</time>
                            <Badge
                              variant={new Date(massProduction.tko) < new Date() ? "success" : "warning"}
                              className="ml-2"
                            >
                              {new Date(massProduction.tko) < new Date() ? "Completed" : "Scheduled"}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* PPAP Submission */}
                      {massProduction.ppap_submission_date && (
                        <div className="flex">
                          <div className="z-10 flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-amber-100">
                            <FileText className="w-6 h-6 text-amber-600" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium">PPAP Submission</h3>
                            <time className="text-sm text-muted-foreground">
                              {formatDate(massProduction.ppap_submission_date)}
                            </time>
                            <Badge variant={massProduction.ppap_submitted ? "success" : "warning"} className="ml-2">
                              {massProduction.ppap_submitted ? "Submitted" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* SOP */}
                      {massProduction.sop && (
                        <div className="flex">
                          <div className="z-10 flex items-center justify-center flex-shrink-0 w-12 h-12 bg-green-100 rounded-full">
                            <CheckSquare className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium">SOP</h3>
                            <time className="text-sm text-muted-foreground">{formatDate(massProduction.sop)}</time>
                            <Badge
                              variant={new Date(massProduction.sop) < new Date() ? "success" : "warning"}
                              className="ml-2"
                            >
                              {new Date(massProduction.sop) < new Date() ? "Completed" : "Scheduled"}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Missing Information Card */}
            <motion.div variants={itemVariants} transition={{ duration: 0.2 }}>
              <Card className="border shadow-sm border-amber-200">
                <CardHeader className="bg-amber-50">
                  <CardTitle className="flex items-center text-xl text-amber-800">
                    <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                    Action Items
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    Complete the following items to finalize this production record
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {stages
                      .filter((stage) => getStageStatus(stage.data).status === "missing")
                      .map((stage) => (
                        <Button
                          key={stage.id}
                          variant="outline"
                          className="justify-start border-amber-200 hover:border-amber-300 hover:bg-amber-50"
                          onClick={() => navigate(`/${stage.path}/create?massProductionId=${id}`)}
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
                          onClick={() => navigateToEditPage(stage.path, stage.data)}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border shadow-sm">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-xl">
                        {stages.find((s) => s.id === activeTab)?.icon}
                        <span className="ml-2">{stages.find((s) => s.id === activeTab)?.name} Details</span>
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigateToEditPage(
                            stages.find((s) => s.id === activeTab)?.path,
                            stages.find((s) => s.id === activeTab)?.data,
                          )
                        }
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </div>
                    <CardDescription>Detailed information about this process stage</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {sectionLoading[activeTab] ? (
                      <div className="flex flex-col items-center justify-center p-12">
                        <div className="w-10 h-10 border-4 rounded-full border-muted border-t-primary animate-spin"></div>
                        <p className="mt-4 font-medium text-muted-foreground">Loading data...</p>
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
                                  <span className="font-medium">65%</span>
                                </div>
                                <Progress value={65} className="h-2" />
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Approvals</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Project Manager</span>
                                  <Badge variant="success">Approved</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Quality Leader</span>
                                  <Badge variant="outline">Pending</Badge>
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
                              navigateToEditPage(stage.path, stage.data)
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
        <ContactUs />
      </div>
    </MainLayout>
  )
}

export default MassProductionDetails
