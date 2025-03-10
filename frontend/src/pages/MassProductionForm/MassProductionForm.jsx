"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, Save, RotateCcw, Loader2, Check, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// API Imports
import { getAllCustomers } from "../../apis/customerApi"
import { getAllpd } from "../../apis/ProductDesignation-api"
import { createMassProduction } from "../../apis/massProductionApi"
import { createKickOff } from "../../apis/kickOffApi"
import { createfacilities } from "../../apis/facilitiesApi"
import { createP_P_Tuning } from "../../apis/p-p-tuning-api"
import { createOkForLunch } from "../../apis/okForLunch"
import { createFeasibility } from "../../apis/feasabilityApi"
import { createQualificationProcess } from "../../apis/process_qualifApi"
import { createQualificationConfirmation } from "../../apis/qualificationconfirmationapi"
import { createValidationForOffer } from "../../apis/validationForOfferApi"
import { createDesign } from "../../apis/designApi"
import { createCheckin } from "../../apis/checkIn"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Step titles for the stepper
const STEP_TITLES = [
  "Mass Production",
  "Checkin",
  "Feasibility",
  "Validation For Offer",
  "Kick Off",
  "Design",
  "Facilities",
  "P-P Tuning",
  "Process Qualification",
  "Qualification Confirmation",
  "OK for Launch",
]

// Task fields for forms with nested task structure
const TASK_FIELDS = {
  check: false,
  responsible: "",
  planned: "",
  done: "",
  comments: "",
  filePath: null,
}

// Create a task object with default values
const createTaskObject = (value = false) => ({
  value,
  task: { ...TASK_FIELDS },
})

// Create a form state object with task fields
const createFormWithTasks = (fields) => {
  return Object.fromEntries(fields.map((field) => [field, createTaskObject()]))
}

export default function MassProductionStepper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState([])
  const [productDesignations, setProductDesignations] = useState([])
  const { toast } = useToast()
  const navigate = useNavigate()

  // Initialize form state
  const [formState, setFormState] = useState({
    massProduction: {},
    checkin: {},
    feasibility: {},
    validationForOffer: {},
    kickOff: {},
    design: {},
    facilities: {},
    ppTuning: {},
    processQualification: {},
    qualificationConfirmation: {},
    okForLunch: {},
  })

  // Initialize forms for each step
  const massProductionForm = useForm({
    defaultValues: {
      id: "",
      status: "on-going",
      status_type: "ok",
      project_n: "",
      product_designation: [],
      description: "",
      customer: "",
      technical_skill: "sc",
      initial_request: "",
      request_original: "internal",
      next_review: "",
      mlo: "",
      tko: "",
      cv: "",
      pt1: "",
      pt2: "",
      sop: "",
      ppap_submission_date: "",
      closure: "",
    },
  })

  const checkinForm = useForm({
    defaultValues: {
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
    },
  })

  // List of feasibility fields
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

  // Create feasibility form with detailed structure based on the FeasabilityDetail model
  const feasibilityForm = useForm({
    defaultValues: feasibilityFields.reduce((acc, field) => {
      acc[field] = {
        value: false,
        details: {
          description: "",
          cost: 0,
          sales_price: 0,
          comments: "",
        },
      }
      return acc
    }, {}),
  })

  const validationForOfferForm = useForm({
    defaultValues: {
      name: "",
      check: false,
      date: "",
      upload: null,
    },
  })

  // Create forms with task structure using the Task model
  const kickOffForm = useForm({
    defaultValues: createFormWithTasks([
      "timeScheduleApproved",
      "modificationLaunchOrder",
      "projectRiskAssessment",
      "standardsImpact",
      "validationOfCosts",
    ]),
  })

  const designForm = useForm({
    defaultValues: createFormWithTasks([
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
    ]),
  })

  const facilitiesForm = useForm({
    defaultValues: createFormWithTasks([
      "reception_of_modified_means",
      "reception_of_modified_tools",
      "reception_of_modified_fixtures",
      "reception_of_modified_parts",
      "control_plan",
    ]),
  })

  const ppTuningForm = useForm({
    defaultValues: createFormWithTasks([
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
    ]),
  })

  const processQualificationForm = useForm({
    defaultValues: createFormWithTasks([
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
    ]),
  })

  const qualificationConfirmationForm = useForm({
    defaultValues: createFormWithTasks([
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
    ]),
  })

  const okForLunchForm = useForm({
    defaultValues: {
      check: false,
      date: "",
      upload: null,
    },
  })

  // Array of forms for easier access
  const forms = [
    massProductionForm,
    checkinForm,
    feasibilityForm,
    validationForOfferForm,
    kickOffForm,
    designForm,
    facilitiesForm,
    ppTuningForm,
    processQualificationForm,
    qualificationConfirmationForm,
    okForLunchForm,
  ]

  // Fetch customers and product designations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, productDesignationsData] = await Promise.all([getAllCustomers(), getAllpd()])
        setCustomers(customersData)
        setProductDesignations(productDesignationsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load initial data. Please refresh the page.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  // Get current form data
  const getCurrentFormData = useCallback(() => {
    return forms[currentStep - 1].getValues()
  }, [currentStep])

  // Save current form data to state
  const saveCurrentFormData = useCallback(() => {
    const stepKey = Object.keys(formState)[currentStep - 1]
    const currentFormData = getCurrentFormData()

    setFormState((prevState) => ({
      ...prevState,
      [stepKey]: currentFormData,
    }))
  }, [currentStep, formState, getCurrentFormData])

  // Handle step navigation
  const nextStep = async () => {
    saveCurrentFormData()

    if (currentStep < STEP_TITLES.length) {
      setCurrentStep(currentStep + 1)

      toast({
        title: `Step ${currentStep + 1}: ${STEP_TITLES[currentStep]}`,
        description: "Your progress has been saved",
      })

      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    saveCurrentFormData()

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goToStep = (step) => {
    if (step === currentStep) return

    saveCurrentFormData()
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Save all form data before submission
      saveCurrentFormData()

      // Create checkin record
      const checkinResponse = await createCheckin(formState.checkin)
      const checkinId = checkinResponse._id

      // Create mass production record
      const massProductionData = {
        ...formState.massProduction,
        assignedRole: "Manager",
        assignedEmail: "manager@example.com",
      }
      const massProductionResponse = await createMassProduction(massProductionData)
      const massProductionId = massProductionResponse._id

      // Create all related records with proper references
      const feasibilityResponse = await createFeasibility({
        ...formState.feasibility,
        checkin: checkinId,
      })

      const validationResponse = await createValidationForOffer({
        ...formState.validationForOffer,
        checkin: checkinId,
      })

      const kickOffResponse = await createKickOff(formState.kickOff)
      const designResponse = await createDesign(formState.design)
      const facilitiesResponse = await createfacilities(formState.facilities)
      const ppTuningResponse = await createP_P_Tuning(formState.ppTuning)
      const processQualResponse = await createQualificationProcess(formState.processQualification)
      const qualConfirmResponse = await createQualificationConfirmation(formState.qualificationConfirmation)

      const okForLunchResponse = await createOkForLunch({
        ...formState.okForLunch,
        checkin: checkinId,
      })

      // Update mass production with references to all created records
      const updateData = {
        feasability: feasibilityResponse._id,
        validation_for_offer: [validationResponse._id],
        kick_off: kickOffResponse._id,
        design: designResponse._id,
        facilities: facilitiesResponse._id,
        p_p_tuning: ppTuningResponse._id,
        process_qualif: processQualResponse._id,
        qualification_confirmation: qualConfirmResponse._id,
        ok_for_lunch: okForLunchResponse._id,
      }

      // In a real application, you would update the mass production record here
      // await updateMassProduction(massProductionId, updateData)

      toast({
        title: "Success",
        description: "Mass Production process created successfully!",
      })

      // Navigate to the mass production list or detail page
      navigate("/mass-productions")
    } catch (error) {
      console.error("Error creating Mass Production process:", error)
      toast({
        title: "Error",
        description: "Failed to create Mass Production process. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Reset the entire form
  const resetForm = () => {
    forms.forEach((form) => form.reset())

    setFormState({
      massProduction: {},
      checkin: {},
      feasibility: {},
      validationForOffer: {},
      kickOff: {},
      design: {},
      facilities: {},
      ppTuning: {},
      processQualification: {},
      qualificationConfirmation: {},
      okForLunch: {},
    })

    setCurrentStep(1)

    toast({
      title: "Form Reset",
      description: "All form data has been cleared",
    })
  }

  // Handle checkbox change for task accordions
  const handleCheckboxChange = (form, field, value) => {
    // For forms with nested value structure
    if (typeof form.getValues()[field] === "object" && form.getValues()[field] !== null) {
      form.setValue(`${field}.value`, value)

      // Also update the formState to ensure it's saved when moving between steps
      const stepKey = Object.keys(formState)[currentStep - 1]
      setFormState((prevState) => ({
        ...prevState,
        [stepKey]: {
          ...prevState[stepKey],
          [field]: {
            ...prevState[stepKey][field],
            value: value,
          },
        },
      }))
    } else {
      // For simple boolean fields (like in checkinForm)
      form.setValue(field, value)

      // Also update the formState
      const stepKey = Object.keys(formState)[currentStep - 1]
      setFormState((prevState) => ({
        ...prevState,
        [stepKey]: {
          ...prevState[stepKey],
          [field]: value,
        },
      }))
    }
  }

  // Handle task field changes
  const handleTaskChange = (e, form, field, taskField) => {
    const value = taskField === "check" ? e.target.checked : e.target.value

    form.setValue(`${field}.task.${taskField}`, value)

    // Update formState
    const stepKey = Object.keys(formState)[currentStep - 1]
    setFormState((prevState) => ({
      ...prevState,
      [stepKey]: {
        ...prevState[stepKey],
        [field]: {
          ...prevState[stepKey][field],
          task: {
            ...prevState[stepKey][field]?.task,
            [taskField]: value,
          },
        },
      },
    }))
  }

  // Handle file upload for tasks
  const handleFileChange = (e, form, field) => {
    const file = e.target.files?.[0] || null

    form.setValue(`${field}.task.filePath`, file)

    // Update formState
    const stepKey = Object.keys(formState)[currentStep - 1]
    setFormState((prevState) => ({
      ...prevState,
      [stepKey]: {
        ...prevState[stepKey],
        [field]: {
          ...prevState[stepKey][field],
          task: {
            ...prevState[stepKey][field]?.task,
            filePath: file,
          },
        },
      },
    }))
  }

  // Handle feasibility detail changes
  const handleFeasibilityDetailChange = (e, field, type) => {
    const value = type === "cost" || type === "sales_price" ? Number.parseFloat(e.target.value) : e.target.value

    feasibilityForm.setValue(`${field}.details.${type}`, value)

    // Update formState
    const stepKey = Object.keys(formState)[currentStep - 1]
    setFormState((prevState) => ({
      ...prevState,
      [stepKey]: {
        ...prevState[stepKey],
        [field]: {
          ...prevState[stepKey][field],
          details: {
            ...prevState[stepKey][field]?.details,
            [type]: value,
          },
        },
      },
    }))
  }

  // Reusable component for task lists
  const TaskList = ({ items, form, nestedValue = true }) => {
    return (
      <div className="space-y-4">
        {items.map((item) => {
          const checked = nestedValue ? form.getValues()[item.id]?.value : form.getValues()[item.id]

          return (
            <div key={item.id} className="flex items-start p-3 space-x-3 border rounded-md bg-card">
              <Checkbox
                id={item.id}
                checked={checked}
                onCheckedChange={(checked) => handleCheckboxChange(form, item.id, checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={item.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
              </div>
              {item.tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-6 h-6 p-0 ml-auto rounded-full">
                        <Info className="w-4 h-4" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{item.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Reusable component for task accordions
  const TaskAccordion = ({ items, form }) => {
    return (
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={item.id} value={`item-${index}`}>
            <AccordionTrigger className="text-lg font-semibold">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={form.getValues()[item.id]?.value}
                  onCheckedChange={(checked) => handleCheckboxChange(form, item.id, checked)}
                />
                <Label htmlFor={item.id} className="text-left">
                  {item.label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Label>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`${item.id}-responsible`}>Responsible</Label>
                  <Input
                    id={`${item.id}-responsible`}
                    type="text"
                    value={form.getValues()[item.id]?.task?.responsible || ""}
                    onChange={(e) => handleTaskChange(e, form, item.id, "responsible")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${item.id}-planned`}>Planned Date</Label>
                  <Input
                    id={`${item.id}-planned`}
                    type="date"
                    value={form.getValues()[item.id]?.task?.planned || ""}
                    onChange={(e) => handleTaskChange(e, form, item.id, "planned")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${item.id}-done`}>Completion Date</Label>
                  <Input
                    id={`${item.id}-done`}
                    type="date"
                    value={form.getValues()[item.id]?.task?.done || ""}
                    onChange={(e) => handleTaskChange(e, form, item.id, "done")}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`${item.id}-comments`}>Comments</Label>
                  <Textarea
                    id={`${item.id}-comments`}
                    value={form.getValues()[item.id]?.task?.comments || ""}
                    onChange={(e) => handleTaskChange(e, form, item.id, "comments")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${item.id}-file`}>Upload File</Label>
                  <Input id={`${item.id}-file`} type="file" onChange={(e) => handleFileChange(e, form, item.id)} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${item.id}-check`}
                    checked={form.getValues()[item.id]?.task?.check || false}
                    onCheckedChange={(checked) => handleTaskChange({ target: { checked } }, form, item.id, "check")}
                  />
                  <Label htmlFor={`${item.id}-check`}>Mark as Completed</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Form {...massProductionForm}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={massProductionForm.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={massProductionForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="on-going">On-Going</SelectItem>
                          <SelectItem value="stand-by">Stand-By</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={massProductionForm.control}
                  name="project_n"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={massProductionForm.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer._id} value={customer._id}>
                              {customer.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={massProductionForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={massProductionForm.control}
                  name="technical_skill"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Technical Skill</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="sc" />
                            </FormControl>
                            <FormLabel className="font-normal">SC</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="tc" />
                            </FormControl>
                            <FormLabel className="font-normal">TC</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={massProductionForm.control}
                  name="request_original"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Request Original</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="internal" />
                            </FormControl>
                            <FormLabel className="font-normal">Internal</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="customer" />
                            </FormControl>
                            <FormLabel className="font-normal">Customer</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-lg font-medium">Key Dates</h3>
                <Tabs defaultValue="dates" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="dates">Dates</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                  </TabsList>
                  <TabsContent value="dates" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {[
                        { id: "initial_request", label: "Initial Request" },
                        { id: "mlo", label: "MLO" },
                        { id: "tko", label: "TKO" },
                        { id: "cv", label: "CV" },
                        { id: "pt1", label: "PT1" },
                        { id: "pt2", label: "PT2" },
                        { id: "sop", label: "SOP" },
                        { id: "ppap_submission_date", label: "PPAP Submission" },
                        { id: "closure", label: "Closure" },
                        { id: "next_review", label: "Next Review" },
                      ].map((date) => (
                        <FormField
                          key={date.id}
                          control={massProductionForm.control}
                          name={date.id}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{date.label}</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="products">
                    <FormField
                      control={massProductionForm.control}
                      name="product_designation"
                      render={({ field }) => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Product Designation</FormLabel>
                            <FormDescription>Select the product designations for this mass production.</FormDescription>
                          </div>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {productDesignations.map((item) => (
                              <FormItem
                                key={item._id}
                                className="flex flex-row items-start p-3 space-x-3 space-y-0 border rounded-md"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item._id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item._id])
                                        : field.onChange(field.value?.filter((value) => value !== item._id) || [])
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.part_name}</FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </form>
          </Form>
        )
      case 2:
        return (
          <Form {...checkinForm}>
            <form className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stakeholder Check-in</CardTitle>
                  <CardDescription>Select the stakeholders involved in this mass production process.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {[
                      { id: "project_manager", label: "Project Manager" },
                      { id: "business_manager", label: "Business Manager" },
                      { id: "engineering_leader_manager", label: "Engineering Leader/Manager" },
                      { id: "quality_leader", label: "Quality Leader" },
                      { id: "plant_quality_leader", label: "Plant Quality Leader" },
                      { id: "industrial_engineering", label: "Industrial Engineering" },
                      { id: "launch_manager_method", label: "Launch Manager/Method" },
                      { id: "maintenance", label: "Maintenance" },
                      { id: "purchasing", label: "Purchasing" },
                      { id: "logistics", label: "Logistics" },
                      { id: "sales", label: "Sales" },
                      { id: "economic_financial_leader", label: "Economic/Financial Leader" },
                    ].map((item) => (
                      <FormField
                        key={item.id}
                        control={checkinForm.control}
                        name={item.id}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start p-3 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        )
      case 3:
        return (
          <Form {...feasibilityForm}>
            <form className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                {feasibilityFields.map((field, index) => (
                  <AccordionItem key={field} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={field}
                          checked={feasibilityForm.getValues()[field]?.value}
                          onCheckedChange={(checked) => handleCheckboxChange(feasibilityForm, field, checked)}
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
                            value={feasibilityForm.getValues()[field]?.details?.description || ""}
                            onChange={(e) => handleFeasibilityDetailChange(e, field, "description")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-cost`}>Cost</Label>
                          <Input
                            id={`${field}-cost`}
                            type="number"
                            value={feasibilityForm.getValues()[field]?.details?.cost || 0}
                            onChange={(e) => handleFeasibilityDetailChange(e, field, "cost")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-sales-price`}>Sales Price</Label>
                          <Input
                            id={`${field}-sales-price`}
                            type="number"
                            value={feasibilityForm.getValues()[field]?.details?.sales_price || 0}
                            onChange={(e) => handleFeasibilityDetailChange(e, field, "sales_price")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-comments`}>Comments</Label>
                          <Textarea
                            id={`${field}-comments`}
                            value={feasibilityForm.getValues()[field]?.details?.comments || ""}
                            onChange={(e) => handleFeasibilityDetailChange(e, field, "comments")}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </form>
          </Form>
        )
      case 4:
        return (
          <Form {...validationForOfferForm}>
            <form className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={validationForOfferForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Offer Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter offer name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={validationForOfferForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={validationForOfferForm.control}
                      name="upload"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Upload File (optional)</FormLabel>
                          <FormControl>
                            <Input type="file" onChange={(e) => onChange(e.target.files?.[0] || null)} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={validationForOfferForm.control}
                      name="check"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 col-span-full">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Approve Offer</FormLabel>
                            <FormDescription>Check this box to approve the offer</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        )
      case 5:
        return (
          <Form {...kickOffForm}>
            <form className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kick Off Checklist</CardTitle>
                  <CardDescription>Define the kick-off parameters for the mass production process.</CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskAccordion
                    items={[
                      { id: "timeScheduleApproved", label: "Time Schedule Approved" },
                      { id: "modificationLaunchOrder", label: "Modification Launch Order" },
                      { id: "projectRiskAssessment", label: "Project Risk Assessment" },
                      { id: "standardsImpact", label: "Standards Impact" },
                      { id: "validationOfCosts", label: "Validation Of Costs" },
                    ]}
                    form={kickOffForm}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>
        )
      case 6:
        return (
          <Form {...designForm}>
            <form className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Design Checklist</CardTitle>
                  <CardDescription>Configure the design parameters for mass production.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Validation & Modification</h3>
                      <TaskAccordion
                        items={[
                          { id: "Validation_of_the_validation", label: "Validation Of The Validation" },
                          { id: "Modification_of_bought_product", label: "Modification Of Bought Product" },
                          { id: "Modification_of_tolerance", label: "Modification Of Tolerance" },
                          { id: "Modification_of_checking_fixtures", label: "Modification Of Checking Fixtures" },
                        ]}
                        form={designForm}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">FMEA & Documentation</h3>
                      <TaskAccordion
                        items={[
                          { id: "Modification_of_Product_FMEA", label: "Modification Of Product FMEA" },
                          { id: "Modification_of_part_list_form", label: "Modification Of Part List Form" },
                          { id: "Modification_of_control_plan", label: "Modification Of Control Plan" },
                          { id: "Modification_of_Process_FMEA", label: "Modification Of Process FMEA" },
                        ]}
                        form={designForm}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Production & Tools</h3>
                      <TaskAccordion
                        items={[
                          {
                            id: "Modification_of_production_facilities",
                            label: "Modification Of Production Facilities",
                          },
                          { id: "Modification_of_tools", label: "Modification Of Tools" },
                          { id: "Modification_of_packaging", label: "Modification Of Packaging" },
                          { id: "Modification_of_information_system", label: "Modification Of Information System" },
                          { id: "Updating_of_drawings", label: "Updating Of Drawings" },
                        ]}
                        form={designForm}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        )
      case 7:
        return (
          <Form {...facilitiesForm}>
            <form className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Facilities Checklist</CardTitle>
                  <CardDescription>Configure the facilities required for mass production.</CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskAccordion
                    items={[
                      { id: "reception_of_modified_means", label: "Reception Of Modified Means" },
                      { id: "reception_of_modified_tools", label: "Reception Of Modified Tools" },
                      { id: "reception_of_modified_fixtures", label: "Reception Of Modified Fixtures" },
                      { id: "reception_of_modified_parts", label: "Reception Of Modified Parts" },
                      { id: "control_plan", label: "Control Plan" },
                    ]}
                    form={facilitiesForm}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>
        )
      case 8:
        return (
          <Form {...ppTuningForm}>
            <form className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>P-P Tuning Checklist</CardTitle>
                  <CardDescription>Configure the product-process tuning parameters.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Validation Tests</h3>
                      <TaskAccordion
                        items={[
                          { id: "product_process_tuning", label: "Product Process Tuning" },
                          { id: "functional_validation_test", label: "Functional Validation Test" },
                          { id: "dimensional_validation_test", label: "Dimensional Validation Test" },
                          { id: "aspect_validation_test", label: "Aspect Validation Test" },
                        ]}
                        form={ppTuningForm}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Supplier & Manufacturing</h3>
                      <TaskAccordion
                        items={[
                          { id: "supplier_order_modification", label: "Supplier Order Modification" },
                          { id: "acceptation_of_supplier", label: "Acceptation Of Supplier" },
                          { id: "capability", label: "Capability" },
                          { id: "manufacturing_of_control_parts", label: "Manufacturing Of Control Parts" },
                        ]}
                        form={ppTuningForm}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Training & Documentation</h3>
                      <TaskAccordion
                        items={[
                          { id: "product_training", label: "Product Training" },
                          { id: "process_training", label: "Process Training" },
                          { id: "purchase_file", label: "Purchase File" },
                          { id: "means_technical_file_data", label: "Means Technical File Data" },
                          { id: "means_technical_file_manufacturing", label: "Means Technical File Manufacturing" },
                          { id: "means_technical_file_maintenance", label: "Means Technical File Maintenance" },
                          { id: "tooling_file", label: "Tooling File" },
                          { id: "product_file", label: "Product File" },
                          { id: "internal_process", label: "Internal Process" },
                        ]}
                        form={ppTuningForm}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        )
      case 9:
        return (
          <Form {...processQualificationForm}>
            <form className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Process Qualification Checklist</CardTitle>
                  <CardDescription>Define the process qualification parameters.</CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskAccordion
                    items={[
                      { id: "updating_of_capms", label: "Updating Of CAPMS" },
                      { id: "modification_of_customer_logistics", label: "Modification Of Customer Logistics" },
                      { id: "qualification_of_supplier", label: "Qualification Of Supplier" },
                      { id: "presentation_of_initial_samples", label: "Presentation Of Initial Samples" },
                      { id: "filing_of_initial_samples", label: "Filing Of Initial Samples" },
                      {
                        id: "information_on_modification_implementation",
                        label: "Information On Modification Implementation",
                      },
                      { id: "full_production_run", label: "Full Production Run" },
                      { id: "request_for_dispensation", label: "Request For Dispensation" },
                      { id: "process_qualification", label: "Process Qualification" },
                      { id: "initial_sample_acceptance", label: "Initial Sample Acceptance" },
                    ]}
                    form={processQualificationForm}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>
        )
      case 10:
        return (
          <Form {...qualificationConfirmationForm}>
            <form className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Qualification Confirmation Checklist</CardTitle>
                  <CardDescription>Confirm the qualification parameters for mass production.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Stock & Version Management</h3>
                      <TaskAccordion
                        items={[
                          { id: "using_up_old_stock", label: "Using Up Old Stock" },
                          { id: "using_up_safety_stocks", label: "Using Up Safety Stocks" },
                          { id: "updating_version_number_mould", label: "Updating Version Number Mould" },
                          {
                            id: "updating_version_number_product_label",
                            label: "Updating Version Number Product Label",
                          },
                        ]}
                        form={qualificationConfirmationForm}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Packaging & Labeling</h3>
                      <TaskAccordion
                        items={[
                          {
                            id: "management_of_manufacturing_programmes",
                            label: "Management Of Manufacturing Programmes",
                          },
                          {
                            id: "specific_spotting_of_packaging_with_label",
                            label: "Specific Spotting Of Packaging With Label",
                          },
                          {
                            id: "management_of_galia_identification_labels",
                            label: "Management Of Galia Identification Labels",
                          },
                          { id: "preservation_measure", label: "Preservation Measure" },
                          {
                            id: "product_traceability_label_modification",
                            label: "Product Traceability Label Modification",
                          },
                        ]}
                        form={qualificationConfirmationForm}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Information & Updates</h3>
                      <TaskAccordion
                        items={[
                          { id: "information_to_production", label: "Information To Production" },
                          { id: "information_to_customer_logistics", label: "Information To Customer Logistics" },
                          { id: "information_to_customer_quality", label: "Information To Customer Quality" },
                          {
                            id: "updating_customer_programme_data_sheet",
                            label: "Updating Customer Programme Data Sheet",
                          },
                        ]}
                        form={qualificationConfirmationForm}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        )
      case 11:
        return (
          <Form {...okForLunchForm}>
            <form className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>OK for Launch</CardTitle>
                  <CardDescription>Final approval for launching the mass production process.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={okForLunchForm.control}
                        name="check"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Approve Launch</FormLabel>
                              <FormDescription>
                                By checking this box, you confirm that this mass production process is approved for
                                launch
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={okForLunchForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Approval Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={okForLunchForm.control}
                      name="upload"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Upload Approval Document</FormLabel>
                          <FormControl>
                            <Input type="file" onChange={(e) => onChange(e.target.files?.[0] || null)} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        )
      default:
        return null
    }
  }

  // Main component render
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Mass Production Process</h1>
          <p className="mt-2 text-muted-foreground">Complete all steps to create a new mass production process.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Stepper Navigation - Desktop */}
          <div className="hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle>Progress</CardTitle>
                <CardDescription>
                  Step {currentStep} of {STEP_TITLES.length}
                </CardDescription>
                <Progress value={(currentStep / STEP_TITLES.length) * 100} className="h-2" />
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-1">
                    {STEP_TITLES.map((title, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          currentStep === index + 1 && "bg-accent text-accent-foreground",
                        )}
                        onClick={() => goToStep(index + 1)}
                      >
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "mr-2 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium",
                              currentStep > index + 1 ? "bg-primary text-primary-foreground border-primary" : "",
                              currentStep === index + 1 ? "border-primary text-primary" : "",
                            )}
                          >
                            {currentStep > index + 1 ? <Check className="w-3 h-3" /> : index + 1}
                          </div>
                          <span className="text-sm">{title}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Stepper Content */}
          <div className="w-full">
            {/* Mobile Stepper Navigation */}
            <Card className="mb-6 lg:hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Progress</CardTitle>
                  <Badge variant="outline" className="px-3 py-1">
                    {currentStep}/{STEP_TITLES.length}
                  </Badge>
                </div>
                <Progress value={(currentStep / STEP_TITLES.length) * 100} className="h-2" />
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[120px]">
                  <div className="space-y-1">
                    {STEP_TITLES.map((title, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          currentStep === index + 1 && "bg-accent text-accent-foreground",
                        )}
                        onClick={() => goToStep(index + 1)}
                      >
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "mr-2 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium",
                              currentStep > index + 1 ? "bg-primary text-primary-foreground border-primary" : "",
                              currentStep === index + 1 ? "border-primary text-primary" : "",
                            )}
                          >
                            {currentStep > index + 1 ? <Check className="w-3 h-3" /> : index + 1}
                          </div>
                          <span className="text-sm">{title}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Step Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{STEP_TITLES[currentStep - 1]}</CardTitle>
                  <Badge variant="outline" className="px-3 py-1">
                    Step {currentStep} of {STEP_TITLES.length}
                  </Badge>
                </div>
                <CardDescription>
                  {currentStep === 1 && "Enter the basic information for the mass production process."}
                  {currentStep === 2 && "Select the stakeholders involved in this mass production process."}
                  {currentStep === 3 && "Evaluate the feasibility of the mass production process."}
                  {currentStep === 4 && "Validate the offer details for this mass production."}
                  {currentStep === 5 && "Define the kick-off parameters for the mass production process."}
                  {currentStep === 6 && "Configure the design parameters for mass production."}
                  {currentStep === 7 && "Configure the facilities required for mass production."}
                  {currentStep === 8 && "Configure the product-process tuning parameters."}
                  {currentStep === 9 && "Define the process qualification parameters."}
                  {currentStep === 10 && "Confirm the qualification parameters for mass production."}
                  {currentStep === 11 && "Final approval for launching the mass production process."}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Step Content */}
            <Card className="mb-6">
              <CardContent className="pt-6">{renderStepContent()}</CardContent>
            </Card>

            {/* Navigation Buttons */}
            <Card>
              <CardFooter className="flex items-center justify-between p-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex gap-2">
                  {currentStep === 11 && (
                    <Button type="button" variant="outline" onClick={resetForm} className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset Form</span>
                    </Button>
                  )}

                  <Button type="button" onClick={nextStep} disabled={loading} className="flex items-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>{currentStep === 11 ? "Submit" : "Next"}</span>
                        {currentStep === 11 ? <Save className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

