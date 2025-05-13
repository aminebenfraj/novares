"use client"

import MainLayout from "@/components/MainLayout"
import { useState, useEffect } from "react"
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
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import ContactUs from "@/components/ContactUs"

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
  User,
  XCircle,
} from "lucide-react"
import { getDesignById } from "../../apis/designApi"

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

const MassProductionDashboard = () => {
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

  const navigateToEditPage = (path, stageData) => {
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
  }

  // Fetch main data on component mount
  useEffect(() => {
    fetchMassProduction()
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
      console.log("Fetching mass production with ID:", id)
      const response = await getMassProductionById(id)
      console.log("Fetched mass production data:", response)

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
      console.log("Fetching feasibility with ID:", id)
      const response = await getFeasibilityById(id)
      console.log("Fetched feasibility data:", response)

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

      console.log("Fetching validation for offer with ID:", id)
      const response = await getValidationForOfferById(id)
      console.log("Fetched validation for offer data:", response)

      // Handle different response structures
      let data
      if (response && response.data) {
        data = response.data
      } else {
        data = response
      }

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

      console.log("Fetching OK for launch with ID:", id)
      const response = await getOkForLunchById(id)
      console.log("Fetched OK for launch data:", response)

      // Handle different response structures
      let data
      if (response && response.data) {
        data = response.data
      } else {
        data = response
      }

      setSectionData((prev) => ({ ...prev, okForLaunch: data }))
    } catch (error) {
      console.error("Failed to fetch OK for launch data:", error)
    }
  }

  const fetchKickOffData = async () => {
    if (!massProduction || !massProduction.kick_off) return

    try {
      const id = typeof massProduction.kick_off === "object" ? massProduction.kick_off._id : massProduction.kick_off

      console.log("Fetching kick-off with ID:", id)
      const response = await getKickOffById(id)
      console.log("Fetched kick-off data:", response)

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

      console.log("Fetching design with ID:", id)
      const response = await getDesignById(id)
      console.log("Fetched design data:", response)

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

      console.log("Fetching facilities with ID:", id)
      const response = await getfacilitiesById(id)
      console.log("Fetched facilities data:", response)

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

      console.log("Fetching P/P tuning with ID:", id)
      const response = await getP_P_TuningById(id)
      console.log("Fetched P/P tuning data:", response)

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

      console.log("Fetching process qualification with ID:", id)
      const response = await getProcessQualificationById(id)
      console.log("Fetched process qualification data:", response)

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

      console.log("Fetching qualification confirmation with ID:", id)
      const response = await getQualificationConfirmationById(id)
      console.log("Fetched qualification confirmation data:", response)

      const data = response.data || response
      setSectionData((prev) => ({ ...prev, qualifConfirm: data }))
    } catch (error) {
      console.error("Failed to fetch qualification confirmation data:", error)
    }
  }

  const calculateCompletionPercentage = (data) => {
    if (!data) return 0

    const stages = [
      { key: "feasibility", data: data.feasibility || data.feasability },
      { key: "validation", data: data.validation_for_offer },
      { key: "okForLaunch", data: data.ok_for_lunch },
      { key: "kickOff", data: data.kick_off },
      { key: "design", data: data.design },
      { key: "facilities", data: data.facilities },
      { key: "ppTuning", data: data.p_p_tuning },
      { key: "processQualif", data: data.process_qualif },
      { key: "qualifConfirm", data: data.qualification_confirmation },
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

  const Milestone = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-milestone"
    >
      <path d="M12 5v14M5 12H3m16 0h-2M5.7 5.7l-1.4-1.4M18.3 5.7l1.4-1.4M5.7 18.3l-1.4 1.4M18.3 18.3l1.4 1.4" />
    </svg>
  )

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

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Project Overview Card */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-2 shadow-md">
                <CardHeader className="pb-4 bg-slate-50">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-semibold text-slate-800">
                          {massProduction.project_n}
                        </CardTitle>
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
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Customer</h3>
                        <div className="flex items-center p-3 border rounded-md bg-slate-50 border-slate-200">
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

                      <div>
                        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Assigned To</h3>
                        <div className="p-3 border rounded-md bg-slate-50 border-slate-200">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-slate-500" />
                            <p className="font-medium">{massProduction.assignedRole || "Not assigned"}</p>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{massProduction.assignedEmail || ""}</p>
                        </div>
                      </div>
                    </div>

                    {/* Key Dates */}
                    <div className="space-y-4">
                      <h3 className="mb-2 text-sm font-medium text-muted-foreground">Basic Information</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 border rounded-md bg-slate-50 border-slate-200">
                          <p className="text-xs text-muted-foreground">Initial Request</p>
                          <p className="font-medium">{formatDate(massProduction.initial_request)}</p>
                        </div>
                        <div className="p-3 border rounded-md bg-slate-50 border-slate-200">
                          <p className="text-xs text-muted-foreground">Closure Date</p>
                          <p className="font-medium">{formatDate(massProduction.closure_date)}</p>
                        </div>
                        <div className="p-3 border rounded-md bg-slate-50 border-slate-200">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Customer Offer:</span>
                            <span className="font-medium">
                              {massProduction.customer_offer === "fulfilled" ? "Fulfilled" : "Expected/In Progress"}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 border rounded-md bg-slate-50 border-slate-200">
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
                        <div className="h-full p-3 border rounded-md bg-slate-50 border-slate-200">
                          <div className="flex flex-wrap gap-2">
                            {massProduction.product_designation.map((product) => (
                              <TooltipProvider key={product._id || product}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline" className="px-3 py-1 cursor-help">
                                      {product.part_name || (typeof product === "string" ? product : "Unknown")}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Reference: {product.reference || "N/A"}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          </div>

                          {massProduction.description && (
                            <div className="mt-4">
                              <h4 className="mb-1 text-xs font-medium text-muted-foreground">Description</h4>
                              <p className="p-2 text-sm bg-white border rounded-md border-slate-100">
                                {massProduction.description}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full p-4 border rounded-md bg-slate-50 border-slate-200">
                          <p className="text-center text-muted-foreground">No product designations available</p>
                        </div>
                      )}
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

            {/* Timeline Card */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="flex items-center text-xl text-slate-800">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    Project Timeline
                  </CardTitle>
                  <CardDescription>Key milestones and dates for this mass production</CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200 ml-6"></div>

                    <div className="relative space-y-8">
                      {/* Initial Request */}
                      <div className="flex">
                        <div className="z-10 flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full">
                          <Calendar className="w-6 h-6 text-blue-600" />
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
                            <Milestone className="w-6 h-6 text-indigo-600" />
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
                            <Milestone className="w-6 h-6 text-purple-600" />
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

export default MassProductionDashboard
