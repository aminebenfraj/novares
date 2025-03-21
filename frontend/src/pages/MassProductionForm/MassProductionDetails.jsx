"use client"

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  DollarSign,
  BarChart,
  FileSpreadsheet,
  Layers,
  Tag,
  Truck,
  PenToolIcon as Tool,
  Zap,
  Box,
  Award,
  Briefcase,
  Check,
  Lightbulb,
  Workflow,
  FileQuestion,
  Gauge,
  ListChecks,
  Milestone,
} from "lucide-react"
import { format } from "date-fns"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const MassProductionDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [massProduction, setMassProduction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [completionPercentage, setCompletionPercentage] = useState(0)

  // State for each section's data
  const [feasibilityData, setFeasibilityData] = useState(null)
  const [okForLunchData, setOkForLunchData] = useState(null)
  const [kickOffData, setKickOffData] = useState(null)
  const [processQualifData, setProcessQualifData] = useState(null)
  const [facilitiesData, setFacilitiesData] = useState(null)
  const [ppTuningData, setPPTuningData] = useState(null)
  const [validationForOfferData, setValidationForOfferData] = useState(null)
  const [qualificationConfirmationData, setQualificationConfirmationData] = useState(null)

  // Loading states for each section
  const [sectionLoading, setSectionLoading] = useState({
    feasibility: false,
    okForLunch: false,
    kickOff: false,
    processQualif: false,
    facilities: false,
    ppTuning: false,
    validationForOffer: false,
    qualificationConfirmation: false,
  })

  useEffect(() => {
    fetchMassProduction()
  }, [id])

  // Add a new useEffect to update the completion percentage when massProduction changes
  useEffect(() => {
    if (massProduction) {
      const percentage = calculateCompletionPercentage(massProduction)
      setCompletionPercentage(percentage)
    }
  }, [massProduction])

  // Add useEffect to fetch data for the active tab
  useEffect(() => {
    if (massProduction) {
      fetchSectionData(activeTab)
    }
  }, [activeTab, massProduction])

  const fetchSectionData = async (section) => {
    if (!massProduction) return

    // Set loading state for the section
    setSectionLoading((prev) => ({ ...prev, [section]: true }))

    try {
      switch (section) {
        case "feasibility":
          if (!feasibilityData && (massProduction.feasibility || massProduction.feasability)) {
            await fetchFeasibilityData()
          }
          break
        case "okforlunch":
          if (!okForLunchData && massProduction.ok_for_lunch) {
            await fetchOkForLunchData()
          }
          break
        case "kickoff":
          if (!kickOffData && massProduction.kick_off) {
            await fetchKickOffData()
          }
          break
        case "processqualif":
          if (!processQualifData && massProduction.process_qualif) {
            await fetchProcessQualifData()
          }
          break
        case "facilities":
          if (!facilitiesData && massProduction.facilities) {
            await fetchFacilitiesData()
          }
          break
        case "pptuning":
          if (!ppTuningData && massProduction.p_p_tuning) {
            await fetchPPTuningData()
          }
          break
        case "validationforoffer":
          if (!validationForOfferData && massProduction.validation_for_offer) {
            await fetchValidationForOfferData()
          }
          break
        case "qualificationconfirmation":
          if (!qualificationConfirmationData && massProduction.qualification_confirmation) {
            await fetchQualificationConfirmationData()
          }
          break
        default:
          break
      }
    } catch (error) {
      console.error(`Failed to fetch ${section} data:`, error)
    } finally {
      setSectionLoading((prev) => ({ ...prev, [section]: false }))
    }
  }

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

  const fetchFeasibilityData = async () => {
    if (!massProduction) return

    const feasibilityId = massProduction.feasibility || massProduction.feasability
    if (!feasibilityId) return

    try {
      console.log(
        "Fetching feasibility with ID:",
        typeof feasibilityId === "object" ? feasibilityId._id : feasibilityId,
      )
      const feasibilityResponse = await getFeasibilityById(
        typeof feasibilityId === "object" ? feasibilityId._id : feasibilityId,
      )
      console.log("Fetched feasibility data:", feasibilityResponse)

      if (feasibilityResponse && feasibilityResponse.data) {
        setFeasibilityData(feasibilityResponse.data)
      }
    } catch (error) {
      console.error("Failed to fetch feasibility data:", error)
    }
  }

  // Update the fetchOkForLunchData function to better handle checkin data
  const fetchOkForLunchData = async () => {
    if (!massProduction || !massProduction.ok_for_lunch) return

    const okForLunchId =
      typeof massProduction.ok_for_lunch === "object" ? massProduction.ok_for_lunch._id : massProduction.ok_for_lunch

    try {
      console.log("Fetching OK for lunch with ID:", okForLunchId)
      const response = await getOkForLunchById(okForLunchId)
      console.log("Fetched OK for lunch data:", response)

      if (response && response.data) {
        // Ensure checkin data is properly structured
        if (response.data.checkin) {
          console.log("OK for Launch checkin data:", response.data.checkin)
        }
        setOkForLunchData(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch OK for lunch data:", error)
    }
  }

  const fetchKickOffData = async () => {
    if (!massProduction || !massProduction.kick_off) return

    const kickOffId =
      typeof massProduction.kick_off === "object" ? massProduction.kick_off._id : massProduction.kick_off

    try {
      console.log("Fetching kick-off with ID:", kickOffId)
      const response = await getKickOffById(kickOffId)
      console.log("Fetched kick-off data:", response)

      if (response && response.data) {
        setKickOffData(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch kick-off data:", error)
    }
  }

  const fetchProcessQualifData = async () => {
    if (!massProduction || !massProduction.process_qualif) return

    const processQualifId =
      typeof massProduction.process_qualif === "object"
        ? massProduction.process_qualif._id
        : massProduction.process_qualif

    try {
      console.log("Fetching process qualification with ID:", processQualifId)
      const response = await getProcessQualificationById(processQualifId)
      console.log("Fetched process qualification data:", response)

      if (response && response.data) {
        setProcessQualifData(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch process qualification data:", error)
    }
  }

  const fetchFacilitiesData = async () => {
    if (!massProduction || !massProduction.facilities) return

    const facilitiesId =
      typeof massProduction.facilities === "object" ? massProduction.facilities._id : massProduction.facilities

    try {
      console.log("Fetching facilities with ID:", facilitiesId)
      const response = await getfacilitiesById(facilitiesId)
      console.log("Fetched facilities data:", response)

      if (response && response.data) {
        setFacilitiesData(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch facilities data:", error)
    }
  }

  const fetchPPTuningData = async () => {
    if (!massProduction || !massProduction.p_p_tuning) return

    const ppTuningId =
      typeof massProduction.p_p_tuning === "object" ? massProduction.p_p_tuning._id : massProduction.p_p_tuning

    try {
      console.log("Fetching P/P tuning with ID:", ppTuningId)
      const response = await getP_P_TuningById(ppTuningId)
      console.log("Fetched P/P tuning data:", response)

      if (response && response.data) {
        setPPTuningData(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch P/P tuning data:", error)
    }
  }

  // Update the fetchValidationForOfferData function to better handle checkin data
  const fetchValidationForOfferData = async () => {
    if (!massProduction || !massProduction.validation_for_offer) return

    const validationForOfferId =
      typeof massProduction.validation_for_offer === "object"
        ? massProduction.validation_for_offer._id
        : massProduction.validation_for_offer

    try {
      console.log("Fetching validation for offer with ID:", validationForOfferId)
      const response = await getValidationForOfferById(validationForOfferId)
      console.log("Fetched validation for offer data:", response)

      if (response && response.data) {
        // Ensure checkin data is properly structured
        if (response.data.checkin) {
          console.log("Validation for Offer checkin data:", response.data.checkin)
        }
        setValidationForOfferData(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch validation for offer data:", error)
    }
  }

  const fetchQualificationConfirmationData = async () => {
    if (!massProduction || !massProduction.qualification_confirmation) return

    const qualificationConfirmationId =
      typeof massProduction.qualification_confirmation === "object"
        ? massProduction.qualification_confirmation._id
        : massProduction.qualification_confirmation

    try {
      console.log("Fetching qualification confirmation with ID:", qualificationConfirmationId)
      const response = await getQualificationConfirmationById(qualificationConfirmationId)
      console.log("Fetched qualification confirmation data:", response)

      if (response && response.data) {
        setQualificationConfirmationData(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch qualification confirmation data:", error)
    }
  }

  const calculateCompletionPercentage = (data) => {
    if (!data) return 0

    const stages = [
      data.feasibility || data.feasability,
      data.validation_for_offer,
      data.ok_for_lunch,
      data.kick_off,
      data.design,
      data.facilities,
      data.p_p_tuning,
      data.process_qualif,
      data.qualification_confirmation,
    ]

    const completedStages = stages.filter((stage) => {
      if (!stage) return false

      // Check if stage has a 'check' property that is true
      if (stage.check === true) return true

      // Check if stage has a 'value' property that is true
      if (stage.value === true) return true

      // If stage is an object with nested properties
      if (typeof stage === "object") {
        // Check if any property has a 'check' or 'value' that is true
        return Object.values(stage).some((prop) => {
          if (typeof prop === "object" && prop !== null) {
            return prop.check === true || prop.value === true
          }
          return false
        })
      }

      return false
    }).length

    const percentage = Math.round((completedStages / stages.length) * 100)
    return percentage
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

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const renderTaskStatus = (task) => {
    if (!task)
      return (
        <Badge variant="outline" className="bg-slate-100 text-slate-500">
          Not Started
        </Badge>
      )

    // Handle different task structures
    if (task.check !== undefined) {
      return (
        <Badge variant={task.check ? "success" : "warning"} className="flex items-center shadow-sm">
          {task.check ? (
            <>
              <CheckCircle className="w-3 h-3 mr-1" /> Completed
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 mr-1" /> In Progress
            </>
          )}
        </Badge>
      )
    } else if (task.value !== undefined) {
      return (
        <Badge variant={task.value ? "success" : "warning"} className="flex items-center shadow-sm">
          {task.value ? (
            <>
              <CheckCircle className="w-3 h-3 mr-1" /> Completed
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 mr-1" /> In Progress
            </>
          )}
        </Badge>
      )
    } else {
      // For objects that might have a different structure
      const isCompleted = Object.values(task).some(
        (val) => val && typeof val === "object" && (val.check === true || val.value === true),
      )

      return (
        <Badge variant={isCompleted ? "success" : "warning"} className="flex items-center shadow-sm">
          {isCompleted ? (
            <>
              <CheckCircle className="w-3 h-3 mr-1" /> Completed
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 mr-1" /> In Progress
            </>
          )}
        </Badge>
      )
    }
  }

  const renderFileLink = (filePath) => {
    if (!filePath) return <span className="text-gray-400">No file attached</span>

    const fileUrl =
      typeof filePath === "string"
        ? filePath.startsWith("http")
          ? filePath
          : `http://localhost:5000/${filePath}`
        : null

    if (!fileUrl) return <span className="text-gray-400">Invalid file path</span>

    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-blue-500 hover:text-blue-700"
      >
        <FileText className="w-4 h-4 mr-1" />
        View File
      </a>
    )
  }

  // Add a helper function to ensure we properly extract checkin data
  // Add this function before the renderGenericSection function

  const extractCheckinData = (data) => {
    if (!data) return {}

    // If checkin is directly on the data object
    if (data.checkin) {
      return data.checkin
    }

    // If checkin might be nested in a different property
    for (const key in data) {
      if (data[key] && typeof data[key] === "object" && data[key].checkin) {
        return data[key].checkin
      }
    }

    // If checkin fields might be directly on the data object
    const checkinFields = [
      "project_manager",
      "business_manager",
      "engineering_leader_manager",
      "quality_leader",
      "plant_quality_leader",
      "industrial_engineering",
      "launch_manager_method",
      "maintenance",
      "purchasing",
      "logistics",
      "sales",
      "economic_financial_leader",
    ]

    const extractedCheckin = {}
    let hasCheckinFields = false

    checkinFields.forEach((field) => {
      if (field in data) {
        extractedCheckin[field] = data[field]
        hasCheckinFields = true
      }
    })

    return hasCheckinFields ? extractedCheckin : {}
  }

  const renderGenericSection = (data, title, description, createPath, icon) => {
    if (!data) {
      return (
        <div className="p-8 text-center">
          <p className="text-gray-500">No {title.toLowerCase()} data available</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(`/${createPath}/create?massProductionId=${id}`)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create {title}
          </Button>
        </div>
      )
    }

    console.log(`Rendering ${title} data:`, data)

    // Extract checkin data if available
    const checkinData = extractCheckinData(data)
    console.log(`${title} checkin data:`, checkinData)

    // Filter out metadata fields
    const dataFields = Object.entries(data || {}).filter(
      ([key]) => !["_id", "__v", "createdAt", "updatedAt", "checkin"].includes(key),
    )

    const progress = calculateCompletionPercentage(data)

    return (
      <div className="space-y-6">
        {/* Section Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-2 shadow-md">
            <CardHeader className="pb-2 bg-slate-50">
              <CardTitle className="text-base font-medium flex items-center text-slate-800">
                {icon || <BarChart className="w-4 h-4 mr-2 text-blue-500" />}
                Completion Status
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Financial summary card if applicable */}
          {dataFields.some(([_, value]) => value?.details?.cost || value?.details?.sales_price) && (
            <Card className="border-2 shadow-md">
              <CardHeader className="pb-2 bg-slate-50">
                <CardTitle className="text-base font-medium flex items-center text-slate-800">
                  <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Total Cost</span>
                    <span className="font-medium">
                      {formatCurrency(
                        dataFields
                          .filter(([_, value]) => value?.details?.cost)
                          .reduce((sum, [_, value]) => sum + Number(value.details.cost), 0),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Sales Price</span>
                    <span className="font-medium">
                      {formatCurrency(
                        dataFields
                          .filter(([_, value]) => value?.details?.sales_price)
                          .reduce((sum, [_, value]) => sum + Number(value.details.sales_price), 0),
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-2 shadow-md">
            <CardHeader className="pb-2 bg-slate-50">
              <CardTitle className="text-base font-medium flex items-center text-slate-800">
                <CheckSquare className="w-4 h-4 mr-2 text-indigo-500" />
                Approval Status
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Approved Items</span>
                  <span className="font-medium">
                    {dataFields.filter(([_, value]) => value?.value === true || value?.check === true).length} /{" "}
                    {dataFields.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending Items</span>
                  <span className="font-medium">
                    {dataFields.filter(([_, value]) => value?.value !== true && value?.check !== true).length} /{" "}
                    {dataFields.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkin Information */}
        {Object.keys(checkinData).length > 0 && (
          <Card className="border-2 border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <CheckSquare className="w-5 h-5 mr-2 text-primary" />
                Approval Checklist
              </CardTitle>
              <CardDescription>Stakeholders who have approved this {title.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent className="bg-white pt-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {Object.entries(checkinData).map(([role, isChecked]) => {
                  // Handle both boolean values and string values that might be "true"/"false"
                  const checked = isChecked === true || isChecked === "true"

                  // Format the role name for display
                  const formatRoleName = (role) => {
                    return role
                      .replace(/_/g, " ")
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")
                  }

                  return (
                    <div
                      key={role}
                      className={`flex items-center space-x-3 p-3 rounded-md ${checked ? "bg-slate-100 border border-primary/20" : "bg-slate-50 border border-slate-200"} shadow-sm`}
                    >
                      <Checkbox checked={checked} disabled className={checked ? "bg-primary border-primary" : ""} />
                      <span className={`${checked ? "font-medium text-slate-900" : "text-slate-500"}`}>
                        {formatRoleName(role)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section Details */}
        <Card className="border-2 shadow-md">
          <CardHeader className="bg-slate-50">
            <CardTitle className="text-slate-800 text-xl">{title} Details</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <ScrollArea className="h-[500px] pr-4">
              <Accordion type="multiple" className="w-full">
                {dataFields.map(([key, value], index) => {
                  if (typeof value === "object" && value !== null) {
                    // Get appropriate icon based on the field name
                    const getIcon = (fieldName) => {
                      const iconMap = {
                        product: <Package className="w-4 h-4 text-blue-500" />,
                        raw_material: <Layers className="w-4 h-4 text-amber-500" />,
                        packaging: <Box className="w-4 h-4 text-green-500" />,
                        purchased_part: <Tag className="w-4 h-4 text-purple-500" />,
                        injection_cycle_time: <Clock className="w-4 h-4 text-red-500" />,
                        moulding_labor: <User className="w-4 h-4 text-indigo-500" />,
                        press_size: <Zap className="w-4 h-4 text-yellow-500" />,
                        assembly: <Tool className="w-4 h-4 text-cyan-500" />,
                        logistics: <Truck className="w-4 h-4 text-orange-500" />,
                        quality: <Award className="w-4 h-4 text-emerald-500" />,
                        management: <Briefcase className="w-4 h-4 text-violet-500" />,
                        approval: <Check className="w-4 h-4 text-green-500" />,
                        concept: <Lightbulb className="w-4 h-4 text-yellow-500" />,
                        process: <Workflow className="w-4 h-4 text-blue-500" />,
                        documentation: <FileQuestion className="w-4 h-4 text-purple-500" />,
                        performance: <Gauge className="w-4 h-4 text-red-500" />,
                        checklist: <ListChecks className="w-4 h-4 text-indigo-500" />,
                        milestone: <Milestone className="w-4 h-4 text-cyan-500" />,
                        default: <FileSpreadsheet className="w-4 h-4 text-gray-500" />,
                      }

                      // Find matching key in the iconMap
                      const matchingKey = Object.keys(iconMap).find((k) => fieldName.toLowerCase().includes(k))
                      return matchingKey ? iconMap[matchingKey] : iconMap.default
                    }

                    const isApproved = value.value === true || value.check === true

                    return (
                      <AccordionItem
                        key={key}
                        value={`item-${index}`}
                        className="border border-slate-200 rounded-md mb-2 overflow-hidden"
                      >
                        <AccordionTrigger className="hover:no-underline py-4 px-3 bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              {getIcon(key)}
                              <span className="ml-2 font-medium capitalize text-slate-800">
                                {key.replace(/_/g, " ")}
                              </span>
                            </div>
                            <Badge variant={isApproved ? "success" : "secondary"} className="ml-2 shadow-sm">
                              {isApproved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 pb-4 px-3 bg-white">
                          {value.details && (
                            <div className="grid grid-cols-1 gap-4 p-4 rounded-md bg-slate-50 border border-slate-200 shadow-sm md:grid-cols-2">
                              {value.details.description && (
                                <div className="space-y-2 md:col-span-2">
                                  <h4 className="font-medium text-sm">Description</h4>
                                  <p className="text-sm bg-background p-3 rounded-md">{value.details.description}</p>
                                </div>
                              )}

                              {value.details.cost !== undefined && (
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">Cost</h4>
                                  <p className="text-sm bg-background p-3 rounded-md flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                                    {formatCurrency(value.details.cost)}
                                  </p>
                                </div>
                              )}

                              {value.details.sales_price !== undefined && (
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">Sales Price</h4>
                                  <p className="text-sm bg-background p-3 rounded-md flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1 text-blue-500" />
                                    {formatCurrency(value.details.sales_price)}
                                  </p>
                                </div>
                              )}

                              {value.details.comments && (
                                <div className="space-y-2 md:col-span-2">
                                  <h4 className="font-medium text-sm">Comments</h4>
                                  <p className="text-sm bg-background p-3 rounded-md italic">
                                    {value.details.comments}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {value.task && (
                            <div className="grid grid-cols-1 gap-4 p-4 rounded-md bg-slate-50 border border-slate-200 shadow-sm md:grid-cols-2">
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
                                  <p className="p-2 mt-1 text-sm bg-background rounded">{value.task.comments}</p>
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
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderFeasibilitySection = () => {
    if (sectionLoading.feasibility) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
        </div>
      )
    }

    return renderGenericSection(
      feasibilityData || massProduction?.feasibility || massProduction?.feasability,
      "Feasibility",
      "Detailed assessment of project feasibility",
      "feasibility",
      <BarChart className="w-4 h-4 mr-2 text-blue-500" />,
    )
  }

  // Update the renderOkForLunchSection and renderValidationForOfferSection functions
  // to ensure they properly display the checkin data

  const renderOkForLunchSection = () => {
    if (sectionLoading.okForLunch) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
        </div>
      )
    }

    // Log the data to help with debugging
    if (okForLunchData) {
      console.log("Rendering OK for Launch data:", okForLunchData)
      console.log("OK for Launch checkin data:", extractCheckinData(okForLunchData))
    }

    return renderGenericSection(
      okForLunchData || massProduction?.ok_for_lunch,
      "OK for Launch",
      "Launch approval and readiness assessment",
      "okforlunch",
      <CheckSquare className="w-4 h-4 mr-2 text-green-500" />,
    )
  }

  const renderValidationForOfferSection = () => {
    if (sectionLoading.validationForOffer) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
        </div>
      )
    }

    // Log the data to help with debugging
    if (validationForOfferData) {
      console.log("Rendering Validation for Offer data:", validationForOfferData)
      console.log("Validation for Offer checkin data:", extractCheckinData(validationForOfferData))
    }

    return renderGenericSection(
      validationForOfferData || massProduction?.validation_for_offer,
      "Validation For Offer",
      "Offer validation tasks and progress",
      "validationforoffer",
      <FileCheck className="w-4 h-4 mr-2 text-indigo-500" />,
    )
  }

  const renderKickOffSection = () => {
    if (sectionLoading.kickOff) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
        </div>
      )
    }

    return renderGenericSection(
      kickOffData || massProduction?.kick_off,
      "Kick Off",
      "Project initiation and kickoff details",
      "kickoff",
      <Calendar className="w-4 h-4 mr-2 text-amber-500" />,
    )
  }

  const renderProcessQualifSection = () => {
    if (sectionLoading.processQualif) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
        </div>
      )
    }

    return renderGenericSection(
      processQualifData || massProduction?.process_qualif,
      "Process Qualification",
      "Process qualification tasks and progress",
      "process-qualification",
      <ShieldCheck className="w-4 h-4 mr-2 text-red-500" />,
    )
  }

  const renderFacilitiesSection = () => {
    if (sectionLoading.facilities) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
        </div>
      )
    }

    return renderGenericSection(
      facilitiesData || massProduction?.facilities,
      "Facilities",
      "Facilities tasks and progress",
      "facilities",
      <Factory className="w-4 h-4 mr-2 text-orange-500" />,
    )
  }

  const renderPPTuningSection = () => {
    if (sectionLoading.ppTuning) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
        </div>
      )
    }

    return renderGenericSection(
      ppTuningData || massProduction?.p_p_tuning,
      "P/P Tuning",
      "Product/Process tuning tasks and progress",
      "p-p-tuning",
      <Settings className="w-4 h-4 mr-2 text-cyan-500" />,
    )
  }

  const renderQualificationConfirmationSection = () => {
    if (sectionLoading.qualificationConfirmation) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading data...</p>
        </div>
      )
    }

    return renderGenericSection(
      qualificationConfirmationData || massProduction?.qualification_confirmation,
      "Qualification Confirmation",
      "Qualification confirmation tasks and progress",
      "qualification-confirmation",
      <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />,
    )
  }

  const renderDesignSection = () => {
    if (!massProduction?.design) {
      return (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No design data available</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(`/design/create?massProductionId=${id}`)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Design
          </Button>
        </div>
      )
    }

    return (
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
                    {value &&
                      typeof value === "object" &&
                      (value.value !== undefined ? (
                        <Badge variant={value.value ? "success" : "secondary"} className="ml-2">
                          {value.value ? "Completed" : "Pending"}
                        </Badge>
                      ) : value.check !== undefined ? (
                        <Badge variant={value.check ? "success" : "secondary"} className="ml-2">
                          {value.check ? "Completed" : "Pending"}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="ml-2">
                          {Object.values(value).some(
                            (v) => v && typeof v === "object" && (v.check === true || v.value === true),
                          )
                            ? "Completed"
                            : "Pending"}
                        </Badge>
                      ))}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {value && typeof value === "object" && value.task && (
                    <div className="grid grid-cols-1 gap-4 p-4 rounded-md bg-muted/30 md:grid-cols-2">
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
                          <p className="p-2 mt-1 text-sm bg-background rounded">{value.task.comments}</p>
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
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          </div>
          <p className="mt-4 text-lg font-medium text-foreground">Loading mass production details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="p-8 text-center bg-card rounded-lg shadow-lg">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h2 className="mb-2 text-2xl font-bold text-foreground">Error</h2>
          <p className="mb-6 text-muted-foreground">{error}</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
        </div>
      </div>
    )
  }

  if (!massProduction) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="p-8 text-center bg-card rounded-lg shadow-lg">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-warning" />
          <h2 className="mb-2 text-2xl font-bold text-foreground">Not Found</h2>
          <p className="mb-6 text-muted-foreground">The requested mass production record could not be found.</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
        </div>
      </div>
    )
  }

  const statusBadge = getStatusBadge(massProduction.status)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Button variant="outline" onClick={handleBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mass Production Details</h1>
              <p className="text-muted-foreground">View and manage production details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEdit} variant="outline">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Project Overview Card */}
          <Card className="border-2 shadow-md">
            <CardHeader className="bg-slate-50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-slate-800 text-xl font-semibold">{massProduction.project_n}</CardTitle>
                    <Badge variant={statusBadge.variant} className="flex items-center">
                      {statusBadge.icon}
                      {massProduction.status}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">ID: {massProduction.id}</CardDescription>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1">
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">Progress:</span>
                    <Progress value={completionPercentage} className="w-24 h-2" />
                    <span className="text-sm font-medium ml-2">{completionPercentage}%</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last updated: {formatDate(massProduction.updatedAt || new Date())}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Customer</h3>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
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
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Assigned To</h3>
                    <p className="font-medium">{massProduction.assignedRole || "Not assigned"}</p>
                    <p className="text-xs text-muted-foreground">{massProduction.assignedEmail || ""}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Key Dates</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Initial Request</p>
                        <p className="font-medium">{formatDate(massProduction.initial_request)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Next Review</p>
                        <p className="font-medium">{formatDate(massProduction.next_review)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">PPAP Submission</p>
                        <p className="font-medium">{formatDate(massProduction.ppap_submission_date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">SOP</p>
                        <p className="font-medium">{formatDate(massProduction.sop)}</p>
                      </div>
                    </div>
                  </div>

                  {massProduction.days_until_ppap_submission !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">PPAP Timeline</h3>
                      <div className="flex items-center">
                        <Badge
                          variant={massProduction.days_until_ppap_submission > 30 ? "outline" : "warning"}
                          className="mr-2"
                        >
                          {massProduction.days_until_ppap_submission} days remaining
                        </Badge>
                        <Progress
                          value={Math.min(100, ((60 - massProduction.days_until_ppap_submission) / 60) * 100)}
                          className="flex-1 h-2"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Product Designations</h3>
                  {massProduction.product_designation && massProduction.product_designation.length > 0 ? (
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
                  ) : (
                    <p className="text-muted-foreground">No product designations available</p>
                  )}

                  {massProduction.description && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                      <p className="p-3 rounded-md bg-muted/50 text-sm">{massProduction.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="mb-6">
            <div className="bg-slate-50 p-4 rounded-lg border">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="overview" className="font-medium">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="feasibility" className="font-medium">
                      Feasibility
                    </TabsTrigger>
                    <TabsTrigger value="validationforoffer" className="font-medium">
                      Validation
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsList className="w-full">
                  <TabsTrigger value="okforlunch" className="w-full font-medium">
                    OK for Launch
                  </TabsTrigger>
                </TabsList>
                <TabsList className="w-full">
                  <TabsTrigger value="kickoff" className="w-full font-medium">
                    Kick Off
                  </TabsTrigger>
                </TabsList>
                <TabsList className="w-full">
                  <TabsTrigger value="design" className="w-full font-medium">
                    Design
                  </TabsTrigger>
                </TabsList>
                <TabsList className="w-full">
                  <TabsTrigger value="facilities" className="w-full font-medium">
                    Facilities
                  </TabsTrigger>
                </TabsList>
                <TabsList className="w-full">
                  <TabsTrigger value="pptuning" className="w-full font-medium">
                    P/P Tuning
                  </TabsTrigger>
                </TabsList>
                <TabsList className="w-full">
                  <TabsTrigger value="processqualif" className="w-full font-medium">
                    Process Qualif
                  </TabsTrigger>
                </TabsList>
                <TabsList className="w-full">
                  <TabsTrigger value="qualificationconfirmation" className="w-full font-medium">
                    Qualif Confirm
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="overview">
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-slate-800 text-xl">Project Overview</CardTitle>
                  <CardDescription>Summary of all project phases</CardDescription>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card className="bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2 bg-slate-50">
                          <CardTitle className="flex items-center text-base font-medium text-slate-800">
                            <Clipboard className="w-4 h-4 mr-2 text-blue-500" />
                            Feasibility
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {renderTaskStatus(massProduction.feasibility || massProduction.feasability)}
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2 bg-slate-50">
                          <CardTitle className="flex items-center text-base font-medium text-slate-800">
                            <FileCheck className="w-4 h-4 mr-2 text-indigo-500" />
                            Validation For Offer
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.validation_for_offer)}</CardContent>
                      </Card>

                      <Card className="bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2 bg-slate-50">
                          <CardTitle className="flex items-center text-base font-medium text-slate-800">
                            <CheckSquare className="w-4 h-4 mr-2 text-green-500" />
                            OK For Launch
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.ok_for_lunch)}</CardContent>
                      </Card>

                      <Card className="bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2 bg-slate-50">
                          <CardTitle className="flex items-center text-base font-medium text-slate-800">
                            <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                            Kick Off
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.kick_off)}</CardContent>
                      </Card>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card className="bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2 bg-slate-50">
                          <CardTitle className="flex items-center text-base font-medium text-slate-800">
                            <Package className="w-4 h-4 mr-2 text-purple-500" />
                            Design
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.design)}</CardContent>
                      </Card>

                      <Card className="bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2 bg-slate-50">
                          <CardTitle className="flex items-center text-base font-medium text-slate-800">
                            <Factory className="w-4 h-4 mr-2 text-orange-500" />
                            Facilities
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.facilities)}</CardContent>
                      </Card>

                      <Card className="bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2 bg-slate-50">
                          <CardTitle className="flex items-center text-base font-medium text-slate-800">
                            <Settings className="w-4 h-4 mr-2 text-cyan-500" />
                            P/P Tuning
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.p_p_tuning)}</CardContent>
                      </Card>

                      <Card className="bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2 bg-slate-50">
                          <CardTitle className="flex items-center text-base font-medium text-slate-800">
                            <ShieldCheck className="w-4 h-4 mr-2 text-red-500" />
                            Process Qualification
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.process_qualif)}</CardContent>
                      </Card>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Card className="md:col-span-1 bg-white border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2 bg-slate-50">
                          <CardTitle className="flex items-center text-base font-medium text-slate-800">
                            <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                            Qualification Confirmation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>{renderTaskStatus(massProduction.qualification_confirmation)}</CardContent>
                      </Card>

                      <Card className="md:col-span-2 border-2 shadow-md">
                        <CardHeader className="bg-slate-50">
                          <CardTitle className="text-slate-800 text-xl text-base font-medium">
                            Project Timeline
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Milestone</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>Initial Request</TableCell>
                                <TableCell>{formatDate(massProduction.initial_request)}</TableCell>
                                <TableCell>
                                  <Badge variant="success">Completed</Badge>
                                </TableCell>
                              </TableRow>
                              {massProduction.mlo && (
                                <TableRow>
                                  <TableCell>MLO</TableCell>
                                  <TableCell>{formatDate(massProduction.mlo)}</TableCell>
                                  <TableCell>
                                    <Badge variant={new Date(massProduction.mlo) < new Date() ? "success" : "warning"}>
                                      {new Date(massProduction.mlo) < new Date() ? "Completed" : "Scheduled"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              )}
                              {massProduction.tko && (
                                <TableRow>
                                  <TableCell>TKO</TableCell>
                                  <TableCell>{formatDate(massProduction.tko)}</TableCell>
                                  <TableCell>
                                    <Badge variant={new Date(massProduction.tko) < new Date() ? "success" : "warning"}>
                                      {new Date(massProduction.tko) < new Date() ? "Completed" : "Scheduled"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              )}
                              {massProduction.ppap_submission_date && (
                                <TableRow>
                                  <TableCell>PPAP Submission</TableCell>
                                  <TableCell>{formatDate(massProduction.ppap_submission_date)}</TableCell>
                                  <TableCell>
                                    <Badge variant={massProduction.ppap_submitted ? "success" : "warning"}>
                                      {massProduction.ppap_submitted ? "Submitted" : "Pending"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              )}
                              {massProduction.sop && (
                                <TableRow>
                                  <TableCell>SOP</TableCell>
                                  <TableCell>{formatDate(massProduction.sop)}</TableCell>
                                  <TableCell>
                                    <Badge variant={new Date(massProduction.sop) < new Date() ? "success" : "warning"}>
                                      {new Date(massProduction.sop) < new Date() ? "Completed" : "Scheduled"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feasibility">
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-slate-800 text-xl">Feasibility Assessment</CardTitle>
                  <CardDescription>Detailed feasibility analysis and approval status</CardDescription>
                </CardHeader>
                <CardContent>{renderFeasibilitySection()}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="validationforoffer">
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-slate-800 text-xl">Validation For Offer</CardTitle>
                  <CardDescription>Validation for offer details and approval status</CardDescription>
                </CardHeader>
                <CardContent>{renderValidationForOfferSection()}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="okforlunch">
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-slate-800 text-xl">OK For Launch</CardTitle>
                  <CardDescription>Launch approval and readiness assessment</CardDescription>
                </CardHeader>
                <CardContent>{renderOkForLunchSection()}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kickoff">
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-slate-800 text-xl">Kick Off</CardTitle>
                  <CardDescription>Project initiation and kickoff details</CardDescription>
                </CardHeader>
                <CardContent>{renderKickOffSection()}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design">
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-slate-800 text-xl">Design Details</CardTitle>
                  <CardDescription>Design tasks and progress</CardDescription>
                </CardHeader>
                <CardContent>{renderDesignSection()}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="facilities">
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-slate-800 text-xl">Facilities Details</CardTitle>
                  <CardDescription>Facilities tasks and progress</CardDescription>
                </CardHeader>
                <CardContent>{renderFacilitiesSection()}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pptuning">
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-slate-800 text-xl">P/P Tuning Details</CardTitle>
                  <CardDescription>Product/Process tuning tasks and progress</CardDescription>
                </CardHeader>
                <CardContent>{renderPPTuningSection()}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="processqualif">
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-slate-800 text-xl">Process Qualification Details</CardTitle>
                  <CardDescription>Process qualification tasks and progress</CardDescription>
                </CardHeader>
                <CardContent>{renderProcessQualifSection()}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qualificationconfirmation">
              <Card className="border-2 shadow-md">
                <CardHeader className="bg-slate-50">
                  <CardTitle className="text-slate-800 text-xl">Qualification Confirmation Details</CardTitle>
                  <CardDescription>Qualification confirmation tasks and progress</CardDescription>
                </CardHeader>
                <CardContent>{renderQualificationConfirmationSection()}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {process.env.NODE_ENV !== "production" && (
            <details className="mt-8 border-2 border-slate-200 rounded-md p-4 bg-slate-50">
              <summary className="font-medium cursor-pointer text-slate-700 flex items-center">
                <FileQuestion className="w-4 h-4 mr-2 text-slate-500" />
                Debug Information
              </summary>
              <div className="mt-3 p-3 bg-slate-100 rounded-md overflow-auto max-h-96 border border-slate-200">
                <pre className="text-xs text-slate-800">{JSON.stringify(massProduction, null, 2)}</pre>
              </div>
            </details>
          )}
        </motion.div>
      </div>
      <ContactUs />
    </div>
  )
}

export default MassProductionDetails

