"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { ChevronLeft, ChevronRight, Save, RotateCcw, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
import { Navbar } from "../../components/Navbar"
import ContactUs from "../../components/ContactUs"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Checkbox } from "../../components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { toast } from "../../hooks/use-toast"
import { Separator } from "../../components/ui/separator"
import { ScrollArea } from "../../components/ui/scroll-area"

import { StepperNav } from "../../components/ui/stepper-nav"
import { TaskAccordion } from "../../components/ui/task-accordion"
import { DatePickerField } from "../../components/ui/date-picker-field"
import { StepHeader } from "../../components/ui/step-header"

export default function MassProductionStepper() {
  const [customers, setCustomers] = useState([])
  const [productDesignations, setProductDesignations] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [formState, setFormState] = useState({
    massProduction: {},
    feasibility: {},
    validationForOffer: {},
    kickOff: {},
    facilities: {},
    ppTuning: {},
    processQualification: {},
    qualificationConfirmation: {},
    okForLunch: {},
  })

  // Initialize forms for each step without zod validation
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
    },
  })

  const feasibilityForm = useForm({
    defaultValues: Object.fromEntries(
      [
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
      ].map((field) => [field, false]),
    ),
  })

  const validationForOfferForm = useForm({
    defaultValues: {
      name: "",
      check: false,
      date: "",
      upload: null,
    },
  })

  const kickOffForm = useForm({
    defaultValues: {
      timeScheduleApproved: false,
      modificationLaunchOrder: false,
      projectRiskAssessment: false,
      standardsImpact: false,
      validationOfCosts: false,
    },
  })

  const facilitiesForm = useForm({
    defaultValues: {
      reception_of_modified_means: false,
      reception_of_modified_tools: false,
      reception_of_modified_fixtures: false,
      reception_of_modified_parts: false,
      control_plan: false,
    },
  })

  const ppTuningForm = useForm({
    defaultValues: {
      product_process_tuning: false,
      functional_validation_test: false,
      dimensional_validation_test: false,
      aspect_validation_test: false,
      supplier_order_modification: false,
      acceptation_of_supplier: false,
      capability: false,
      manufacturing_of_control_parts: false,
      product_training: false,
      process_training: false,
      purchase_file: false,
      means_technical_file_data: false,
      means_technical_file_manufacturing: false,
      means_technical_file_maintenance: false,
      tooling_file: false,
      product_file: false,
      internal_process: false,
    },
  })

  const processQualificationForm = useForm({
    defaultValues: {
      updating_of_capms: false,
      modification_of_customer_logistics: false,
      qualification_of_supplier: false,
      presentation_of_initial_samples: false,
      filing_of_initial_samples: false,
      information_on_modification_implementation: false,
      full_production_run: false,
      request_for_dispensation: false,
      process_qualification: false,
      initial_sample_acceptance: false,
    },
  })

  const qualificationConfirmationForm = useForm({
    defaultValues: {
      using_up_old_stock: false,
      using_up_safety_stocks: false,
      updating_version_number_mould: false,
      updating_version_number_product_label: false,
      management_of_manufacturing_programmes: false,
      specific_spotting_of_packaging_with_label: false,
      management_of_galia_identification_labels: false,
      preservation_measure: false,
      product_traceability_label_modification: false,
      information_to_production: false,
      information_to_customer_logistics: false,
      information_to_customer_quality: false,
      updating_customer_programme_data_sheet: false,
    },
  })

  const okForLunchForm = useForm({
    defaultValues: {
      check: false,
      date: "",
      upload: null,
    },
  })

  // Fetch data on component mount
  useEffect(() => {
    getAllCustomers()
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customers:", error))

    getAllpd()
      .then((data) => setProductDesignations(data))
      .catch((error) => console.error("Error fetching product designations:", error))
  }, [])

  // Handle step navigation
  const nextStep = async () => {
    let stepData = {}

    // Get current step data
    switch (currentStep) {
      case 1:
        stepData = massProductionForm.getValues()
        break
      case 2:
        stepData = feasibilityForm.getValues()
        break
      case 3:
        stepData = validationForOfferForm.getValues()
        break
      case 4:
        stepData = kickOffForm.getValues()
        break
      case 5:
        stepData = facilitiesForm.getValues()
        break
      case 6:
        stepData = ppTuningForm.getValues()
        break
      case 7:
        stepData = processQualificationForm.getValues()
        break
      case 8:
        stepData = qualificationConfirmationForm.getValues()
        break
      case 9:
        stepData = okForLunchForm.getValues()
        break
    }

    // Update form state with current step data
    setFormState({
      ...formState,
      [Object.keys(formState)[currentStep - 1]]: stepData,
    })

    // Move to next step or submit if on last step
    if (currentStep < 9) {
      setDirection(1)
      setCurrentStep(currentStep + 1)

      // Show toast notification for step change
      toast({
        title: `Step ${currentStep + 1}: ${stepTitles[currentStep]}`,
        description: "Your progress has been saved",
        variant: "default",
      })

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1)
      setCurrentStep(currentStep - 1)

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goToStep = (step) => {
    if (step === currentStep) return

    setDirection(step > currentStep ? 1 : -1)
    setCurrentStep(step)

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Submit each form separately to their respective APIs
      await createMassProduction({
        ...formState.massProduction,
        assignedRole: "Manager",
        assignedEmail: "mohamedamine.benfredj@polytechnicien.tn",
      })

      // Transform feasibility data
      const feasibilityData = Object.keys(formState.feasibility).reduce((acc, field) => {
        acc[field] = {
          value: formState.feasibility[field],
          details: {
            description: "",
            cost: 0,
            sales_price: 0,
            comments: "",
          },
        }
        return acc
      }, {})
      await createFeasibility(feasibilityData)

      // Create formData for validationForOffer
      const validationForOfferFormData = new FormData()
      validationForOfferFormData.append("name", formState.validationForOffer.name)
      validationForOfferFormData.append("check", formState.validationForOffer.check)
      validationForOfferFormData.append("date", formState.validationForOffer.date)
      if (formState.validationForOffer.upload) {
        validationForOfferFormData.append("upload", formState.validationForOffer.upload)
      }
      await createValidationForOffer(validationForOfferFormData)

      // Transform kickOff data to match API expectations
      const kickOffData = Object.keys(formState.kickOff).reduce((acc, field) => {
        acc[field] = {
          value: formState.kickOff[field],
          task: {
            check: false,
            responsible: "",
            planned: "",
            done: "",
            comments: "",
            filePath: null,
          },
        }
        return acc
      }, {})
      await createKickOff(kickOffData)

      // Transform facilities data
      const facilitiesData = Object.keys(formState.facilities).reduce((acc, field) => {
        acc[field] = {
          value: formState.facilities[field],
          task: {
            check: false,
            responsible: "",
            planned: "",
            done: "",
            comments: "",
            filePath: null,
          },
        }
        return acc
      }, {})
      await createfacilities(facilitiesData)

      // Transform ppTuning data
      const ppTuningData = Object.keys(formState.ppTuning).reduce((acc, field) => {
        acc[field] = {
          value: formState.ppTuning[field],
          task: {
            check: false,
            responsible: "",
            planned: "",
            done: "",
            comments: "",
            filePath: null,
          },
        }
        return acc
      }, {})
      await createP_P_Tuning(ppTuningData)

      // Transform processQualification data
      const processQualificationData = Object.keys(formState.processQualification).reduce((acc, field) => {
        acc[field] = {
          value: formState.processQualification[field],
          task: {
            check: false,
            responsible: "",
            planned: "",
            done: "",
            comments: "",
            filePath: null,
          },
        }
        return acc
      }, {})
      await createQualificationProcess(processQualificationData)

      // Transform qualificationConfirmation data
      const qualificationConfirmationData = Object.keys(formState.qualificationConfirmation).reduce((acc, field) => {
        acc[field] = {
          value: formState.qualificationConfirmation[field],
          task: {
            check: false,
            responsible: "",
            planned: "",
            done: "",
            comments: "",
            filePath: null,
          },
        }
        return acc
      }, {})
      await createQualificationConfirmation(qualificationConfirmationData)

      // Create formData for okForLunch
      const okForLunchFormData = new FormData()
      okForLunchFormData.append("check", formState.okForLunch.check)
      okForLunchFormData.append("date", formState.okForLunch.date)
      if (formState.okForLunch.upload) {
        okForLunchFormData.append("upload", formState.okForLunch.upload)
      }
      await createOkForLunch(okForLunchFormData)

      toast({
        title: "Success",
        description: "Mass Production process created successfully!",
        variant: "success",
      })

      // Reset form and go to first step
      setCurrentStep(1)
      massProductionForm.reset()
      feasibilityForm.reset()
      validationForOfferForm.reset()
      kickOffForm.reset()
      facilitiesForm.reset()
      ppTuningForm.reset()
      processQualificationForm.reset()
      qualificationConfirmationForm.reset()
      okForLunchForm.reset()
      setFormState({
        massProduction: {},
        feasibility: {},
        validationForOffer: {},
        kickOff: {},
        facilities: {},
        ppTuning: {},
        processQualification: {},
        qualificationConfirmation: {},
        okForLunch: {},
      })
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
    massProductionForm.reset()
    feasibilityForm.reset()
    validationForOfferForm.reset()
    kickOffForm.reset()
    facilitiesForm.reset()
    ppTuningForm.reset()
    processQualificationForm.reset()
    qualificationConfirmationForm.reset()
    okForLunchForm.reset()
    setFormState({
      massProduction: {},
      feasibility: {},
      validationForOffer: {},
      kickOff: {},
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
      variant: "default",
    })
  }

  // Step titles
  const stepTitles = [
    "Mass Production",
    "Feasibility",
    "Validation For Offer",
    "Kick Off",
    "Facilities",
    "P-P Tuning",
    "Process Qualification",
    "Qualification Confirmation",
    "OK for Lunch",
  ]

  // Animation variants
  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      }
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      }
    },
  }

  // Handle checkbox change for task accordions
  const handleCheckboxChange = (form, field, value) => {
    form.setValue(field, value)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Mass Production</h1>
          <p className="mt-2 text-muted-foreground">Complete all steps to create a new mass production process.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Stepper Navigation - Desktop */}
          <div className="hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle>Progress</CardTitle>
                <CardDescription>
                  Step {currentStep} of {stepTitles.length}
                </CardDescription>
                <div className="w-full h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: `${((currentStep - 1) / stepTitles.length) * 100}%` }}
                    animate={{ width: `${(currentStep / stepTitles.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <StepperNav steps={stepTitles} currentStep={currentStep} onStepClick={goToStep} />
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
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-muted">
                    {currentStep}/{stepTitles.length}
                  </span>
                </div>
                <div className="w-full h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: `${((currentStep - 1) / stepTitles.length) * 100}%` }}
                    animate={{ width: `${(currentStep / stepTitles.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[120px]">
                  <StepperNav steps={stepTitles} currentStep={currentStep} onStepClick={goToStep} />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Step Header */}
            <StepHeader title={stepTitles[currentStep - 1]} currentStep={currentStep} totalSteps={stepTitles.length} />

            <AnimatePresence initial={false} custom={direction}>
              {/* Mass Production Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Mass Production Details</CardTitle>
                      <CardDescription>Enter the basic information for the mass production process.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...massProductionForm}>
                        <form className="space-y-8">
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                              control={massProductionForm.control}
                              name="id"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ID</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
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
                              name="status_type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Status Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="ok">OK</SelectItem>
                                      <SelectItem value="no">NO</SelectItem>
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
                                    <Input {...field} />
                                  </FormControl>
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
                                    <Textarea {...field} />
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
                              name="initial_request"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Initial Request</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
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

                          <Separator className="my-4" />

                          <FormField
                            control={massProductionForm.control}
                            name="product_designation"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel className="text-base">Product Designation</FormLabel>
                                  <FormDescription>
                                    Select the product designations for this mass production.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                                  {productDesignations.map((item) => (
                                    <FormField
                                      key={item.id}
                                      control={massProductionForm.control}
                                      name="product_designation"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={item.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, item.id])
                                                    : field.onChange(field.value?.filter((value) => value !== item.id))
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item.part_name}</FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Feasibility */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Feasibility Assessment</CardTitle>
                      <CardDescription>Evaluate the feasibility of the mass production process.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...feasibilityForm}>
                        <form className="space-y-8">
                          <TaskAccordion
                            items={[
                              { id: "product", label: "product" },
                              { id: "raw_material_type", label: "raw_material_type" },
                              { id: "raw_material_qty", label: "raw_material_qty" },
                              { id: "packaging", label: "packaging" },
                              { id: "purchased_part", label: "purchased_part" },
                              { id: "injection_cycle_time", label: "injection_cycle_time" },
                              { id: "moulding_labor", label: "moulding_labor" },
                              { id: "press_size", label: "press_size" },
                              {
                                id: "assembly_finishing_paint_cycle_time",
                                label: "assembly_finishing_paint_cycle_time",
                              },
                              { id: "assembly_finishing_paint_labor", label: "assembly_finishing_paint_labor" },
                              { id: "ppm_level", label: "ppm_level" },
                              { id: "pre_study", label: "pre_study" },
                              { id: "project_management", label: "project_management" },
                              { id: "study_design", label: "study_design" },
                              { id: "cae_design", label: "cae_design" },
                              { id: "monitoring", label: "monitoring" },
                              { id: "measurement_metrology", label: "measurement_metrology" },
                              { id: "validation", label: "validation" },
                              { id: "molds", label: "molds" },
                              { id: "special_machines", label: "special_machines" },
                              { id: "checking_fixture", label: "checking_fixture" },
                              { id: "equipment_painting_prehension", label: "equipment_painting_prehension" },
                              { id: "run_validation", label: "run_validation" },
                              { id: "stock_production_coverage", label: "stock_production_coverage" },
                              { id: "is_presentation", label: "is_presentation" },
                              { id: "documentation_update", label: "documentation_update" },
                            ]}
                            values={feasibilityForm.getValues()}
                            onChange={(field, value) => handleCheckboxChange(feasibilityForm, field, value)}
                          />
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Validation For Offer */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Validation For Offer</CardTitle>
                      <CardDescription>Validate the offer details for this mass production.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...validationForOfferForm}>
                        <form className="space-y-8">
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                              control={validationForOfferForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Offer Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Enter offer name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={validationForOfferForm.control}
                              name="check"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                            <DatePickerField form={validationForOfferForm} name="date" label="Date" />
                            <FormField
                              control={validationForOfferForm.control}
                              name="upload"
                              render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                  <FormLabel>Upload File (optional)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="file"
                                      onChange={(e) => onChange(e.target.files?.[0] || null)}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Kick Off */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Kick Off</CardTitle>
                      <CardDescription>Define the kick-off parameters for the mass production process.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...kickOffForm}>
                        <form className="space-y-8">
                          <TaskAccordion
                            items={[
                              { id: "timeScheduleApproved", label: "Time Schedule Approved" },
                              { id: "modificationLaunchOrder", label: "Modification Launch Order" },
                              { id: "projectRiskAssessment", label: "Project Risk Assessment" },
                              { id: "standardsImpact", label: "Standards Impact" },
                              { id: "validationOfCosts", label: "Validation Of Costs" },
                            ]}
                            values={kickOffForm.getValues()}
                            onChange={(field, value) => handleCheckboxChange(kickOffForm, field, value)}
                          />
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Facilities */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Facilities</CardTitle>
                      <CardDescription>Configure the facilities required for mass production.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...facilitiesForm}>
                        <form className="space-y-8">
                          <TaskAccordion
                            items={[
                              { id: "reception_of_modified_means", label: "Reception Of Modified Means" },
                              { id: "reception_of_modified_tools", label: "Reception Of Modified Tools" },
                              { id: "reception_of_modified_fixtures", label: "Reception Of Modified Fixtures" },
                              { id: "reception_of_modified_parts", label: "Reception Of Modified Parts" },
                              { id: "control_plan", label: "Control Plan" },
                            ]}
                            values={facilitiesForm.getValues()}
                            onChange={(field, value) => handleCheckboxChange(facilitiesForm, field, value)}
                          />
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* P-P Tuning */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>P-P Tuning</CardTitle>
                      <CardDescription>Configure the product-process tuning parameters.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...ppTuningForm}>
                        <form className="space-y-8">
                          <TaskAccordion
                            items={[
                              { id: "product_process_tuning", label: "Product Process Tuning" },
                              { id: "functional_validation_test", label: "Functional Validation Test" },
                              { id: "dimensional_validation_test", label: "Dimensional Validation Test" },
                              { id: "aspect_validation_test", label: "Aspect Validation Test" },
                              { id: "supplier_order_modification", label: "Supplier Order Modification" },
                              { id: "acceptation_of_supplier", label: "Acceptation Of Supplier" },
                              { id: "capability", label: "Capability" },
                              { id: "manufacturing_of_control_parts", label: "Manufacturing Of Control Parts" },
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
                            values={ppTuningForm.getValues()}
                            onChange={(field, value) => handleCheckboxChange(ppTuningForm, field, value)}
                          />
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Process Qualification */}
              {currentStep === 7 && (
                <motion.div
                  key="step7"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Process Qualification</CardTitle>
                      <CardDescription>Define the process qualification parameters.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...processQualificationForm}>
                        <form className="space-y-8">
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
                            values={processQualificationForm.getValues()}
                            onChange={(field, value) => handleCheckboxChange(processQualificationForm, field, value)}
                          />
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Qualification Confirmation */}
              {currentStep === 8 && (
                <motion.div
                  key="step8"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Qualification Confirmation</CardTitle>
                      <CardDescription>Confirm the qualification parameters for mass production.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...qualificationConfirmationForm}>
                        <form className="space-y-8">
                          <TaskAccordion
                            items={[
                              { id: "using_up_old_stock", label: "Using Up Old Stock" },
                              { id: "using_up_safety_stocks", label: "Using Up Safety Stocks" },
                              { id: "updating_version_number_mould", label: "Updating Version Number Mould" },
                              {
                                id: "updating_version_number_product_label",
                                label: "Updating Version Number Product Label",
                              },
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
                              { id: "information_to_production", label: "Information To Production" },
                              { id: "information_to_customer_logistics", label: "Information To Customer Logistics" },
                              { id: "information_to_customer_quality", label: "Information To Customer Quality" },
                              {
                                id: "updating_customer_programme_data_sheet",
                                label: "Updating Customer Programme Data Sheet",
                              },
                            ]}
                            values={qualificationConfirmationForm.getValues()}
                            onChange={(field, value) =>
                              handleCheckboxChange(qualificationConfirmationForm, field, value)
                            }
                          />
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* OK for Lunch */}
              {currentStep === 9 && (
                <motion.div
                  key="step9"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>OK for Launch</CardTitle>
                      <CardDescription>Final approval for launching the mass production process.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...okForLunchForm}>
                        <form className="space-y-8">
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                    <FormDescription>Check this box to approve the launch process</FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <DatePickerField form={okForLunchForm} name="date" label="Date" />
                            <FormField
                              control={okForLunchForm.control}
                              name="upload"
                              render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                  <FormLabel>Upload File (optional)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="file"
                                      onChange={(e) => onChange(e.target.files?.[0] || null)}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 gap-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 transition-all hover:gap-3"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </Button>

              <div className="flex gap-2">
                {currentStep === 9 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex items-center gap-2 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Form</span>
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="flex items-center gap-2 transition-all hover:gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{currentStep === 9 ? "Submit" : "Next"}</span>
                      {currentStep === 9 ? <Save className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContactUs />
    </div>
  )
}

