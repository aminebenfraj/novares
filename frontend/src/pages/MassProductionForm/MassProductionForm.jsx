"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { createKickOff } from "../../apis/kickOffApi"
import { createDesign } from "../../apis/designApi"
import { createfacilities } from "../../apis/facilitiesApi"
import { createFeasibility } from "../../apis/feasabilityApi"
import { createQualificationProcess } from "../../apis/process_qualifApi"
import { createQualificationConfirmation } from "../../apis/qualificationconfirmationapi"
import { getAllCustomers } from "../../apis/customerApi"
import { getAllpd, createPD } from "../../apis/ProductDesignation-api"
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
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Upload, CalendarIcon, Plus, X, RefreshCw } from "lucide-react"
import MainLayout from "@/components/MainLayout"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Define role fields for checkin
const roleFields = [
  { id: "Project_Manager", label: "Project Manager" },
  { id: "Business_Manager", label: "Business Manager" },
  { id: "Financial_Leader", label: "Financial Leader" },
  { id: "Manufacturing_Eng_Manager", label: "Manufacturing Eng. Manager" },
  { id: "Manufacturing_Eng_Leader", label: "Manufacturing Eng. Leader" },
  { id: "Methodes_UAP1_3", label: "Methodes UAP1&3" },
  { id: "Methodes_UAP2", label: "Methodes UAP2" },
  { id: "Maintenance_Manager", label: "Maintenance Manager" },
  { id: "Maintenance_Leader_UAP2", label: "Maintenance Leader UAP2" },
  { id: "Prod_Plant_Manager_UAP1", label: "Prod. Plant Manager UAP1" },
  { id: "Prod_Plant_Manager_UAP2", label: "Prod. Plant Manager UAP2" },
  { id: "Quality_Manager", label: "Quality Manager" },
  { id: "Quality_Leader_UAP1", label: "Quality Leader UAP1" },
  { id: "Quality_Leader_UAP2", label: "Quality Leader UAP2" },
  { id: "Quality_Leader_UAP3", label: "Quality Leader UAP3" },
]

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

const MassPdCreate = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState([])
  const [productDesignations, setProductDesignations] = useState([])
  const [selectedProductDesignations, setSelectedProductDesignations] = useState([])
  const [newProductDesignations, setNewProductDesignations] = useState([])
  const [isCreatingPD, setIsCreatingPD] = useState(false)
  const [refreshingPD, setRefreshingPD] = useState(false)

  // New product designation form state
  const [newPD, setNewPD] = useState({
    part_name: "",
    reference: "",
  })

  // Initial form state with all required fields
  const [formData, setFormData] = useState({
    id: "",
    status: "on-going",
    project_n: "",
    product_designation: [],
    description: "",
    customer: "",
    technical_skill: "sc",
    initial_request: new Date().toLocaleString
().split("T")[0],
    request_original: "customer",
    customer_offer: "fulfilled",
    customer_order: "fulfilled",
    ppap_submission_date: "",
    ppap_submitted: false,
    closure: "",
    comment: "",
    mlo: "",
    tko: "",
    cv: "",
    pt1: "",
    pt2: "",
    sop: "",
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
      acc[field] = {
        value: false,
        task: { check: false, responsible: "", planned: "", done: "", comments: "", filePath: null },
      }
      return acc
    }, {}),
  )

  // Design form state
  const [designData, setDesignData] = useState(
    designFields.reduce((acc, field) => {
      acc[field] = {
        value: false,
        task: { check: false, responsible: "", planned: "", done: "", comments: "", filePath: null },
      }
      return acc
    }, {}),
  )

  // Facilities form state
  const [facilitiesData, setFacilitiesData] = useState(
    facilitiesFields.reduce((acc, field) => {
      acc[field] = {
        value: false,
        task: { check: false, responsible: "", planned: "", done: "", comments: "", filePath: null },
      }
      return acc
    }, {}),
  )

  // P_P_Tuning form state
  const [ppTuningData, setPPTuningData] = useState(
    ppTuningFields.reduce((acc, field) => {
      acc[field] = {
        value: false,
        task: { check: false, responsible: "", planned: "", done: "", comments: "", filePath: null },
      }
      return acc
    }, {}),
  )

  // Process Qualification form state
  const [processQualifData, setProcessQualifData] = useState(
    processQualifFields.reduce((acc, field) => {
      acc[field] = {
        value: false,
        task: { check: false, responsible: "", planned: "", done: "", comments: "", filePath: null },
      }
      return acc
    }, {}),
  )

  // Qualification Confirmation form state
  const [qualificationConfirmationData, setQualificationConfirmationData] = useState(
    qualificationConfirmationFields.reduce((acc, field) => {
      acc[field] = {
        value: false,
        task: { check: false, responsible: "", planned: "", done: "", comments: "", filePath: null },
      }
      return acc
    }, {}),
  )

  // OkForLunch data state
  const [okForLunchData, setOkForLunchData] = useState({
    check: false,
    upload: null,
    date: new Date().toLocaleString
().split("T")[0],
    comments: "",
  })

  // ValidationForOffer data state
  const [validationForOfferData, setValidationForOfferData] = useState({
    name: "",
    check: false,
    upload: null,
    date: new Date().toLocaleString
().split("T")[0],
    comments: "",
  })

  // Checkin data for ValidationForOffer
  const [validationForOfferCheckinData, setValidationForOfferCheckinData] = useState(
    roleFields.reduce((acc, field) => {
      acc[field.id] = {
        value: false,
        comment: "",
        date: new Date().toLocaleString
(),
        name: "",
      }
      return acc
    }, {}),
  )

  // Checkin data for OkForLunch
  const [okForLunchCheckinData, setOkForLunchCheckinData] = useState(
    roleFields.reduce((acc, field) => {
      acc[field.id] = {
        value: false,
        comment: "",
        date: new Date().toLocaleString
(),
        name: "",
      }
      return acc
    }, {}),
  )

  // Checkin data for Feasibility
  const [feasibilityCheckinData, setFeasibilityCheckinData] = useState(
    roleFields.reduce((acc, field) => {
      acc[field.id] = {
        value: false,
        comment: "",
        date: new Date().toLocaleString
(),
        name: "",
      }
      return acc
    }, {}),
  )

  // Fetch customers and product designations on component mount
  useEffect(() => {
    fetchData()
  }, [])

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
        // Normalize product designations data
        const normalizedDesignations = productDesignationsData.map((pd) => ({
          _id: pd.id, // Use id from API response as _id
          part_name: pd.part_name,
          reference: pd.reference || "",
        }))

        setProductDesignations(normalizedDesignations)
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

  const refreshProductDesignations = async () => {
    setRefreshingPD(true)
    try {
      const productDesignationsData = await getAllpd()

      if (Array.isArray(productDesignationsData)) {
        // Normalize product designations data
        const normalizedDesignations = productDesignationsData.map((pd) => ({
          _id: pd.id, // Use id from API response as _id
          part_name: pd.part_name,
          reference: pd.reference || "",
        }))

        setProductDesignations(normalizedDesignations)
        toast({
          title: "Success",
          description: "Product designations refreshed successfully",
        })
      }
    } catch (error) {
      console.error("Error refreshing product designations:", error)
      toast({
        title: "Error",
        description: "Failed to refresh product designations",
        variant: "destructive",
      })
    } finally {
      setRefreshingPD(false)
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

  // Handle ok for lunch changes
  const handleOkForLunchChange = (field, value) => {
    setOkForLunchData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle validation for offer changes
  const handleValidationForOfferChange = (field, value) => {
    setValidationForOfferData((prev) => ({ ...prev, [field]: value }))
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

  const handleValidationForOfferFileChange = (e) => {
    setValidationForOfferData((prev) => ({ ...prev, upload: e.target.files[0] }))
  }

  // Handle file upload for various sections
  const handleKickOffFileChange = (field, file) => {
    setKickOffData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        task: { ...prev[field].task, filePath: file },
      },
    }))
  }

  const handleDesignFileChange = (field, file) => {
    setDesignData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        task: { ...prev[field].task, filePath: file },
      },
    }))
  }

  const handleFacilitiesFileChange = (field, file) => {
    setFacilitiesData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        task: { ...prev[field].task, filePath: file },
      },
    }))
  }

  const handlePPTuningFileChange = (field, file) => {
    setPPTuningData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        task: { ...prev[field].task, filePath: file },
      },
    }))
  }

  const handleProcessQualifFileChange = (field, file) => {
    setProcessQualifData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        task: { ...prev[field].task, filePath: file },
      },
    }))
  }

  const handleQualificationConfirmationFileChange = (field, file) => {
    setQualificationConfirmationData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        task: { ...prev[field].task, filePath: file },
      },
    }))
  }

  // Handle new product designation input changes
  const handleNewPDChange = (e) => {
    const { name, value } = e.target
    setNewPD((prev) => ({ ...prev, [name]: value }))
  }

  // Create a new product designation
  const createNewProductDesignation = async () => {
    if (!newPD.part_name) {
      toast({
        title: "Error",
        description: "Part name is required",
        variant: "destructive",
      })
      return
    }

    setIsCreatingPD(true)
    try {
      // Only send the required fields to avoid id conflicts
      const response = await createPD({
        part_name: newPD.part_name,
        reference: newPD.reference || "",
      })

      if (response && response.data) {
        // Extract the ID from the response
        const newId = response.data.id || (response.data.data && response.data.data.id)

        if (!newId) {
          throw new Error("Failed to get ID from server response")
        }

        // Create a new product designation object with the correct ID
        const newProductDesignation = {
          _id: newId,
          part_name: newPD.part_name,
          reference: newPD.reference || "",
          isNew: true,
        }

        // Add to new product designations list
        setNewProductDesignations((prev) => [...prev, newProductDesignation])

        // Automatically select the new product designation
        setSelectedProductDesignations((prev) => [...prev, newId])

        // Reset the form
        setNewPD({
          part_name: "",
          reference: "",
        })

        toast({
          title: "Success",
          description: "Product designation created successfully",
        })
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      console.error("Error creating product designation:", error)
      // Improved error message with more details
      const errorMessage = error.response?.data?.error || error.message || "Failed to create product designation"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsCreatingPD(false)
    }
  }

  // Remove a newly created product designation
  const removeNewProductDesignation = (id) => {
    setNewProductDesignations((prev) => prev.filter((pd) => pd._id !== id))
    setSelectedProductDesignations((prev) => prev.filter((pdId) => pdId !== id))
  }

  // Add this effect to handle automatic closure date setting
  useEffect(() => {
    if (formData.status === "closed" || formData.status === "cancelled") {
      setFormData((prev) => ({
        ...prev,
        closure: new Date().toLocaleString
().split("T")[0],
      }))
    }
  }, [formData.status])

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

      // Update product designations in form data
      const updatedFormData = {
        ...formData,
        product_designation: selectedProductDesignations,
      }

      // Create feasibility record with embedded checkin data
      const feasibilityResponse = await createFeasibility({
        ...feasibilityData,
        checkin: feasibilityCheckinData,
      })

      console.log("✅ Feasibility created successfully:", feasibilityResponse)

      // Extract the feasibility ID correctly from the nested response structure
      let feasibilityId = null
      if (feasibilityResponse && feasibilityResponse.data) {
        if (feasibilityResponse.data.data && feasibilityResponse.data.data.feasibility) {
          feasibilityId = feasibilityResponse.data.data.feasibility._id || feasibilityResponse.data.data.feasibility.id
        } else if (feasibilityResponse.data._id) {
          feasibilityId = feasibilityResponse.data._id
        } else if (feasibilityResponse.data.id) {
          feasibilityId = feasibilityResponse.data.id
        } else if (feasibilityResponse.data.feasibility) {
          feasibilityId = feasibilityResponse.data.feasibility._id || feasibilityResponse.data.feasibility.id
        }
      }

      if (!feasibilityId) {
        console.error(
          "Failed to extract feasibility ID from response. Response structure:",
          JSON.stringify(feasibilityResponse.data, null, 2),
        )

        if (feasibilityResponse.data && feasibilityResponse.data.data && feasibilityResponse.data.data.feasibility) {
          feasibilityId =
            feasibilityResponse.data.data.feasibility._id ||
            feasibilityResponse.data.data.feasibility.id ||
            feasibilityResponse.data.data.feasibility
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

      // Process data to handle file paths
      const processedKickOffData = { ...kickOffData }
      Object.keys(processedKickOffData).forEach((field) => {
        if (processedKickOffData[field].task.filePath instanceof File) {
          processedKickOffData[field].task.filePath = processedKickOffData[field].task.filePath.name
        }
      })

      // Create kick-off record
      const kickOffResponse = await createKickOff(processedKickOffData)

      // Process designData to handle file paths
      const processedDesignData = { ...designData }
      Object.keys(processedDesignData).forEach((field) => {
        if (processedDesignData[field].task.filePath instanceof File) {
          processedDesignData[field].task.filePath = processedDesignData[field].task.filePath.name
        }
      })

      // Create design record
      const designResponse = await createDesign(processedDesignData)

      // Process facilitiesData to handle file paths
      const processedFacilitiesData = { ...facilitiesData }
      Object.keys(processedFacilitiesData).forEach((field) => {
        if (processedFacilitiesData[field].task.filePath instanceof File) {
          processedFacilitiesData[field].task.filePath = processedFacilitiesData[field].task.filePath.name
        }
      })

      // Create facilities record
      const facilitiesResponse = await createfacilities(processedFacilitiesData)

      // Process ppTuningData to handle file paths
      const processedPPTuningData = { ...ppTuningData }
      Object.keys(processedPPTuningData).forEach((field) => {
        if (processedPPTuningData[field].task.filePath instanceof File) {
          processedPPTuningData[field].task.filePath = processedPPTuningData[field].task.filePath.name
        }
      })

      // Create P_P_Tuning record
      const ppTuningResponse = await createP_P_Tuning(processedPPTuningData)

      // Process processQualifData to handle file paths
      const processedProcessQualifData = { ...processQualifData }
      Object.keys(processedProcessQualifData).forEach((field) => {
        if (processedProcessQualifData[field].task.filePath instanceof File) {
          processedProcessQualifData[field].task.filePath = processedProcessQualifData[field].task.filePath.name
        }
      })

      // Create process qualification record
      const processQualifResponse = await createQualificationProcess(processedProcessQualifData)

      // Process qualificationConfirmationData to handle file paths
      const processedQualificationConfirmationData = { ...qualificationConfirmationData }
      Object.keys(processedQualificationConfirmationData).forEach((field) => {
        if (processedQualificationConfirmationData[field].task.filePath instanceof File) {
          processedQualificationConfirmationData[field].task.filePath =
            processedQualificationConfirmationData[field].task.filePath.name
        }
      })

      // Create qualification confirmation record
      const qualificationConfirmationResponse = await createQualificationConfirmation(
        processedQualificationConfirmationData,
      )

      // Create ok for lunch record with embedded checkin data
      const okForLunchFormData = new FormData()
      okForLunchFormData.append("check", okForLunchData.check)
      okForLunchFormData.append("date", okForLunchData.date)
      okForLunchFormData.append("comments", okForLunchData.comments || "")
      if (okForLunchData.upload) {
        okForLunchFormData.append("upload", okForLunchData.upload)
      }

      // Convert checkin data to the format expected by the API
      okForLunchFormData.append("checkin", JSON.stringify(okForLunchCheckinData))

      const okForLunchResponse = await createOkForLunch(okForLunchFormData)

      // Create validation for offer record with embedded checkin data
      const validationForOfferFormData = new FormData()
      validationForOfferFormData.append("name", validationForOfferData.name)
      validationForOfferFormData.append("check", validationForOfferData.check)
      validationForOfferFormData.append("date", validationForOfferData.date)
      validationForOfferFormData.append("comments", validationForOfferData.comments || "")
      if (validationForOfferData.upload) {
        validationForOfferFormData.append("upload", validationForOfferData.upload)
      }

      // Convert checkin data to the format expected by the API
      validationForOfferFormData.append("checkin", JSON.stringify(validationForOfferCheckinData))

      const validationForOfferResponse = await createValidationForOffer(validationForOfferFormData)

      // Create the mass production record with references to created records
      const massProductionData = {
        ...updatedFormData,
        feasibility: feasibilityId,
        kick_off: kickOffResponse.data._id || kickOffResponse.data.id,
        design: designResponse.data._id || designResponse.data.id,
        facilities: facilitiesResponse.data._id || facilitiesResponse.data.id,
        p_p_tuning: ppTuningResponse.data._id || ppTuningResponse.data.id,
        process_qualif: processQualifResponse.data._id || processQualifResponse.data.id,
        qualification_confirmation:
          qualificationConfirmationResponse.data._id || qualificationConfirmationResponse.data.id,
        ok_for_lunch: okForLunchResponse.data._id || okForLunchResponse.data.id,
        validation_for_offer: validationForOfferResponse.data._id || validationForOfferResponse.data.id,
        checkinRoles: roleFields.reduce((acc, role) => {
          acc[role.id] = { value: false }
          return acc
        }, {}),
      }

      // Create the mass production record
      await createMassProduction(massProductionData)

      toast({
        title: "Success",
        description:
          "Mass production record created successfully! Notification emails have been sent to all role holders.",
      })

      // Redirect to the mass production list page
      navigate("/masspd")
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
            <Button variant="outline" onClick={() => navigate("/masspd")} className="mr-4">
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
                <TabsTrigger value="product-designation">Product Designation</TabsTrigger>
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
                        <Label htmlFor="closure">Closure Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="closure"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.closure && "text-muted-foreground",
                              )}
                              disabled={formData.status === "closed" || formData.status === "cancelled"}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {formData.closure ? format(new Date(formData.closure), "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.closure ? new Date(formData.closure) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const formattedDate = date.toLocaleISOString().split("T")[0]
                                  setFormData((prev) => ({
                                    ...prev,
                                    closure: formattedDate,
                                  }))
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                              <SelectItem key={customer._id || customer.id} value={customer._id || customer.id}>
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
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="initial_request"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.initial_request && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {formData.initial_request
                                ? format(new Date(formData.initial_request), "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.initial_request ? new Date(formData.initial_request) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const formattedDate = date.toLocaleString
().split("T")[0]
                                  setFormData((prev) => ({
                                    ...prev,
                                    initial_request: formattedDate,
                                  }))
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                            <SelectItem value="fulfilled">Fulfilled</SelectItem>
                            <SelectItem value="expected/inprogress">Expected/In Progress</SelectItem>
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
                            <SelectItem value="fulfilled">Fulfilled</SelectItem>
                            <SelectItem value="expected/inprogress">Expected/In Progress</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ppap_submission_date">PPAP Submission Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="ppap_submission_date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.ppap_submission_date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {formData.ppap_submission_date
                              ? format(new Date(formData.ppap_submission_date), "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              formData.ppap_submission_date ? new Date(formData.ppap_submission_date) : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const formattedDate = date.toLocaleString
().split("T")[0]
                                setFormData((prev) => ({
                                  ...prev,
                                  ppap_submission_date: formattedDate,
                                }))
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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

                    {/* Ok For Lunch Section */}
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
                            <Label htmlFor="ok-for-lunch-check">Approve Launch</Label>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="ok-for-lunch-date">Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="ok-for-lunch-date"
                                  variant="outline"
                                  className="justify-start w-full font-normal text-left"
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  {okForLunchData.date ? format(new Date(okForLunchData.date), "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={okForLunchData.date ? new Date(okForLunchData.date) : undefined}
                                  onSelect={(date) => {
                                    if (date) {
                                      const formattedDate = date.toLocaleString
().split("T")[0]
                                      handleOkForLunchChange("date", formattedDate)
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="ok-for-lunch-comments">Comments</Label>
                            <Textarea
                              id="ok-for-lunch-comments"
                              value={okForLunchData.comments || ""}
                              onChange={(e) => handleOkForLunchChange("comments", e.target.value)}
                              placeholder="Add any comments about this approval"
                              className="min-h-[80px]"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="ok-for-lunch-upload">Upload Document</Label>
                            <div className="relative">
                              <Upload className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                              <Input
                                id="ok-for-lunch-upload"
                                type="file"
                                onChange={handleFileChange}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Validation For Offer Section */}
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
                              placeholder="Enter offer name"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="validation-for-offer-check"
                              checked={validationForOfferData.check}
                              onCheckedChange={(checked) => handleValidationForOfferChange("check", checked)}
                            />
                            <Label htmlFor="validation-for-offer-check">Approve Offer</Label>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="validation-for-offer-date">Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="validation-for-offer-date"
                                  variant="outline"
                                  className="justify-start w-full font-normal text-left"
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  {validationForOfferData.date
                                    ? format(new Date(validationForOfferData.date), "PPP")
                                    : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={
                                    validationForOfferData.date ? new Date(validationForOfferData.date) : undefined
                                  }
                                  onSelect={(date) => {
                                    if (date) {
                                      const formattedDate = date.toLocaleString
().split("T")[0]
                                      handleValidationForOfferChange("date", formattedDate)
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="validation-for-offer-comments">Comments</Label>
                            <Textarea
                              id="validation-for-offer-comments"
                              value={validationForOfferData.comments || ""}
                              onChange={(e) => handleValidationForOfferChange("comments", e.target.value)}
                              placeholder="Add any comments about this validation"
                              className="min-h-[80px]"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="validation-for-offer-upload">Upload Document</Label>
                            <div className="relative">
                              <Upload className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                              <Input
                                id="validation-for-offer-upload"
                                type="file"
                                onChange={handleValidationForOfferFileChange}
                                className="pl-10"
                              />
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
                    <h3 className="text-lg font-medium">Milestone Dates</h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="mlo">MLO</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="mlo"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.mlo && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {formData.mlo ? format(new Date(formData.mlo), "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.mlo ? new Date(formData.mlo) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const formattedDate = date.toLocaleString().split("T")[0]
                                  setFormData((prev) => ({
                                    ...prev,
                                    mlo: formattedDate,
                                  }))
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tko">TKO</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="tko"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.tko && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {formData.tko ? format(new Date(formData.tko), "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.tko ? new Date(formData.tko) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const formattedDate = date.toLocaleString
().split("T")[0]
                                  setFormData((prev) => ({
                                    ...prev,
                                    tko: formattedDate,
                                  }))
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cv">CV</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="cv"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.cv && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {formData.cv ? format(new Date(formData.cv), "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.cv ? new Date(formData.cv) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const formattedDate = date.toLocaleString
().split("T")[0]
                                  setFormData((prev) => ({
                                    ...prev,
                                    cv: formattedDate,
                                  }))
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pt1">PT1</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="pt1"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.pt1 && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {formData.pt1 ? format(new Date(formData.pt1), "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.pt1 ? new Date(formData.pt1) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const formattedDate = date.toLocaleString
().split("T")[0]
                                  setFormData((prev) => ({
                                    ...prev,
                                    pt1: formattedDate,
                                  }))
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pt2">PT2</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="pt2"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.pt2 && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {formData.pt2 ? format(new Date(formData.pt2), "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.pt2 ? new Date(formData.pt2) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const formattedDate = date.toLocaleString
().split("T")[0]
                                  setFormData((prev) => ({
                                    ...prev,
                                    pt2: formattedDate,
                                  }))
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sop">SOP</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="sop"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.sop && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              {formData.sop ? format(new Date(formData.sop), "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.sop ? new Date(formData.sop) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  const formattedDate = date.toLocaleString
().split("T")[0]
                                  setFormData((prev) => ({
                                    ...prev,
                                    sop: formattedDate,
                                  }))
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Product Designation Tab */}
              <TabsContent value="product-designation">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Designation</CardTitle>
                    <CardDescription>
                      Create and select product designations for this mass production record.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Create New Product Designation */}
                    <div>
                      <h3 className="mb-4 text-lg font-medium">Create New Product Designation</h3>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="part_name">
                                Part Name <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="part_name"
                                name="part_name"
                                value={newPD.part_name}
                                onChange={handleNewPDChange}
                                placeholder="Enter part name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="reference">Reference (Optional)</Label>
                              <Input
                                id="reference"
                                name="reference"
                                value={newPD.reference}
                                onChange={handleNewPDChange}
                                placeholder="Enter reference"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button
                              type="button"
                              onClick={createNewProductDesignation}
                              disabled={isCreatingPD || !newPD.part_name}
                            >
                              {isCreatingPD ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Creating...
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create Product Designation
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Newly Created Product Designations */}
                    {newProductDesignations.length > 0 && (
                      <div>
                        <h3 className="mb-4 text-lg font-medium">Newly Created Product Designations</h3>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="space-y-3">
                              {newProductDesignations.map((pd) => (
                                <div
                                  key={`new-${pd._id}`}
                                  className="flex items-center justify-between p-3 border rounded-md"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Checkbox
                                      id={`new-pd-${pd._id}`}
                                      checked={selectedProductDesignations.includes(pd._id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedProductDesignations((prev) => [...prev, pd._id])
                                        } else {
                                          setSelectedProductDesignations((prev) => prev.filter((id) => id !== pd._id))
                                        }
                                      }}
                                    />
                                    <div>
                                      <Label htmlFor={`new-pd-${pd._id}`} className="font-medium">
                                        {pd.part_name}
                                      </Label>
                                      {pd.reference && (
                                        <p className="text-sm text-muted-foreground">Ref: {pd.reference}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="bg-green-50">
                                      New
                                    </Badge>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive">
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Remove Product Designation</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to remove this newly created product designation?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => removeNewProductDesignation(pd._id)}>
                                            Remove
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Existing Product Designations */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">Existing Product Designations</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={refreshProductDesignations}
                          disabled={refreshingPD}
                        >
                          {refreshingPD ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                          )}
                          Refresh
                        </Button>
                      </div>
                      <Card>
                        <CardContent className="pt-6">
                          {productDesignations.length === 0 ? (
                            <div className="p-4 text-center border rounded-md bg-muted/20">
                              <p className="text-sm text-muted-foreground">
                                No existing product designations available. Create new ones above.
                              </p>
                            </div>
                          ) : (
                            <ScrollArea className="h-[300px] pr-4">
                              <div className="space-y-3">
                                {productDesignations.map((item) => (
                                  <div
                                    key={item._id}
                                    className="flex items-center justify-between p-3 border rounded-md"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <Checkbox
                                        id={`pd-${item._id}`}
                                        checked={selectedProductDesignations.includes(item._id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setSelectedProductDesignations((prev) => [...prev, item._id])
                                          } else {
                                            setSelectedProductDesignations((prev) =>
                                              prev.filter((id) => id !== item._id),
                                            )
                                          }
                                        }}
                                      />
                                      <div>
                                        <Label htmlFor={`pd-${item._id}`} className="font-medium">
                                          {item.part_name}
                                        </Label>
                                        {item.reference && (
                                          <p className="text-sm text-muted-foreground">Ref: {item.reference}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Selected Product Designations Summary */}
                    <div>
                      <h3 className="mb-4 text-lg font-medium">Selected Product Designations</h3>
                      <Card>
                        <CardContent className="pt-6">
                          {selectedProductDesignations.length === 0 ? (
                            <div className="p-4 text-center border rounded-md bg-muted/20">
                              <p className="text-sm text-muted-foreground">
                                No product designations selected. Please select at least one product designation.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {selectedProductDesignations.map((id) => {
                                // Find the product designation in either existing or new product designations
                                const pd = [...productDesignations, ...newProductDesignations].find(
                                  (item) => item._id === id,
                                )
                                if (!pd) return null

                                return (
                                  <div
                                    key={`selected-${id}`}
                                    className="flex items-center justify-between p-3 border rounded-md"
                                  >
                                    <div>
                                      <p className="font-medium">{pd.part_name}</p>
                                      {pd.reference && (
                                        <p className="text-sm text-muted-foreground">Ref: {pd.reference}</p>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {newProductDesignations.some((item) => item._id === id) && (
                                        <Badge variant="outline" className="bg-green-50">
                                          New
                                        </Badge>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          setSelectedProductDesignations((prev) => prev.filter((pdId) => pdId !== id))
                                        }}
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button type="submit" disabled={loading} className="px-8">
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

export default MassPdCreate
