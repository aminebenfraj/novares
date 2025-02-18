import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { getAllCustomers } from "../../apis/customerApi"
import { getAllpd } from "../../apis/ProductDesignation-api"
import { createMassProduction } from "../../apis/massProductionApi"
import { Navbar } from "../../components/Navbar"
import ContactUs from "../../components/ContactUs"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

const formSchema = z.object({
  id: z.string().min(1, "ID is required"),
  status: z.enum(["cancelled", "closed", "on-going", "stand-by"]),
  status_type: z.enum(["ok", "no"]),
  project_n: z.string().min(1, "Project number is required"),
  product_designation: z.array(z.string()).min(1, "At least one product designation is required"),
  description: z.string().optional(),
  customer: z.string().min(1, "Customer is required"),
  technical_skill: z.enum(["sc", "tc"]),
  initial_request: z.string().min(1, "Initial request date is required"),
  request_original: z.enum(["internal", "customer"]),
  frasability: z.enum(["F", "E"]).optional(),
  validation_for_offer: z.enum(["F", "E"]).optional(),
  customer_offer: z.enum(["F", "E"]).optional(),
  customer_order: z.enum(["F", "E"]).optional(),
  ok_for_lunch: z.enum(["F", "E"]).optional(),
  kick_off: z.enum(["F", "E"]).optional(),
  design: z.enum(["F", "E"]).optional(),
  facilities: z.enum(["F", "E"]).optional(),
  p_p_tuning: z.enum(["F", "E"]).optional(),
  process_qualif: z.enum(["F", "E"]).optional(),
  ppap_submission_date: z.string().optional(),
  closure: z.string().optional(),
  comment: z.string().optional(),
  next_review: z.string().optional(),
  mlo: z.string().optional(),
  tko: z.string().optional(),
  cv: z.string().optional(),
  pt1: z.string().optional(),
  pt2: z.string().optional(),
  sop: z.string().optional(),
})

export default function MassProductionForm() {
  const [customers, setCustomers] = useState([])
  const [productDesignations, setProductDesignations] = useState([])
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
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
      frasability: "",
      validation_for_offer: "",
      customer_offer: "",
      customer_order: "",
      ok_for_lunch: "",
      kick_off: "",
      design: "",
      facilities: "",
      p_p_tuning: "",
      process_qualif: "",
      ppap_submission_date: "",
      closure: "",
      comment: "",
      next_review: "",
      mlo: "",
      tko: "",
      cv: "",
      pt1: "",
      pt2: "",
      sop: "",
    },
  })

  useEffect(() => {
    getAllCustomers()
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching customers:", error))

    getAllpd()
      .then((data) => setProductDesignations(data))
      .catch((error) => console.error("Error fetching product designations:", error))
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await createMassProduction({
        ...data,
        assignedRole: "Manager",
        assignedEmail: "mohamedamine.benfredj@polytechnicien.tn",
      })
      console.log("Mass Production Created:", response)
      toast({
        title: "Success",
        description: "Mass Production task created successfully!",
      })
    } catch (error) {
      console.error("Error creating Mass Production:", error)
      toast({
        title: "Error",
        description: "Failed to create Mass Production task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold">Create Mass Production</h1>
        <Card>
          <CardHeader>
            <CardTitle>Mass Production Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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

                <FormField
                  control={form.control}
                  name="product_designation"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Product Designation</FormLabel>
                        <FormDescription>Select the product designations for this mass production.</FormDescription>
                      </div>
                      {productDesignations.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="product_designation"
                          render={({ field }) => {
                            return (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0"><>
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
                                <FormLabel className="font-normal">{item.part_name}</FormLabel></>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    "frasability",
                    "validation_for_offer",
                    "customer_offer",
                    "customer_order",
                    "ok_for_lunch",
                    "kick_off",
                    "design",
                    "facilities",
                    "p_p_tuning",
                    "process_qualif",
                  ].map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem><>
                          <FormLabel>{fieldName.replace(/_/g, " ")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="F">F</SelectItem>
                              <SelectItem value="E">E</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          </>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {["mlo", "tko", "cv", "pt1", "pt2", "sop", "ppap_submission_date", "closure", "next_review"].map(
          (fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{fieldName.replace(/_/g, " ").toUpperCase()}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          ),
        )}
      </div>

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ppap_submitted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PPAP Submitted</FormLabel>
                      <FormControl>
                        <Checkbox
                          {...field}
                          disabled={form.watch("closure") && new Date(form.watch("closure")) < new Date()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <ContactUs />
    </div>
  )
}
