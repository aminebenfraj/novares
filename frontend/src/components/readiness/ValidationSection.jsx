"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function ValidationSection({ title, fields, data, setData }) {
  const [expandedItems, setExpandedItems] = useState([])

  const toggleItem = (value) => {
    setExpandedItems((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  // Calculate completion percentage for this section
  const calculateSectionCompletion = () => {
    const totalFields = fields.length
    const completedFields = fields.filter((field) => data[field]?.value).length
    return Math.round((completedFields / totalFields) * 100)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">{title.charAt(0).toUpperCase() + title.slice(1)} Items</h3>
          <Badge variant={calculateSectionCompletion() === 100 ? "success" : "outline"} className="ml-2">
            {calculateSectionCompletion()}% Complete
          </Badge>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-help">
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Check items as they are completed and add validation details.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Accordion type="multiple" value={expandedItems} className="space-y-2">
        {fields.map((field, index) => (
          <motion.div
            key={field}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.05 }}
          >
            <AccordionItem value={field} className="overflow-hidden border rounded-lg bg-card">
              <AccordionTrigger
                onClick={() => toggleItem(field)}
                className="px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center space-x-2 text-left">
                  <Checkbox
                    id={`${title}-${field}-main`}
                    checked={data[field]?.value || false}
                    onCheckedChange={(checked) => {
                      setData((prev) => ({
                        ...prev,
                        [field]: { ...prev[field], value: checked },
                      }))
                      // Auto-expand when checked
                      if (checked && !expandedItems.includes(field)) {
                        toggleItem(field)
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-5 h-5"
                  />
                  <span className="font-medium">
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </span>
                  {data[field]?.validation?.validation_check && (
                    <Badge variant="success" className="ml-auto mr-2">
                      Validated
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <Card className="p-4 border-dashed bg-background/50">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <ValidationCheckbox
                      id={`${title}-${field}-tko`}
                      label="TKO"
                      field={field}
                      validationField="tko"
                      data={data}
                      setData={setData}
                    />
                    <ValidationCheckbox
                      id={`${title}-${field}-ot`}
                      label="OT"
                      field={field}
                      validationField="ot"
                      data={data}
                      setData={setData}
                    />
                    <ValidationCheckbox
                      id={`${title}-${field}-ot_op`}
                      label="OT OP"
                      field={field}
                      validationField="ot_op"
                      data={data}
                      setData={setData}
                    />
                    <ValidationCheckbox
                      id={`${title}-${field}-is`}
                      label="IS"
                      field={field}
                      validationField="is"
                      data={data}
                      setData={setData}
                    />
                    <ValidationCheckbox
                      id={`${title}-${field}-sop`}
                      label="SOP"
                      field={field}
                      validationField="sop"
                      data={data}
                      setData={setData}
                    />
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <ValidationSelect
                          id={`${title}-${field}-ok_nok`}
                          label="Status"
                          field={field}
                          validationField="ok_nok"
                          data={data}
                          setData={setData}
                          options={[
                            { value: "OK", label: "OK" },
                            { value: "NOK", label: "NOK" },
                          ]}
                        />
                        <ValidationInput
                          id={`${title}-${field}-who`}
                          label="Who"
                          field={field}
                          validationField="who"
                          data={data}
                          setData={setData}
                        />
                        <ValidationInput
                          id={`${title}-${field}-when`}
                          label="When"
                          field={field}
                          validationField="when"
                          data={data}
                          setData={setData}
                          type="date"
                        />
                      </div>
                    </div>
                    <div className="col-span-1 mt-2 md:col-span-2 lg:col-span-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`${title}-${field}-validation_check`} className="font-medium">
                          Mark as Validated
                        </Label>
                        <Checkbox
                          id={`${title}-${field}-validation_check`}
                          checked={data[field]?.validation?.validation_check || false}
                          onCheckedChange={(checked) =>
                            setData((prev) => ({
                              ...prev,
                              [field]: {
                                ...prev[field],
                                validation: { ...prev[field].validation, validation_check: checked },
                              },
                            }))
                          }
                          className="w-5 h-5"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  )
}

function ValidationCheckbox({ id, label, field, validationField, data, setData }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={data[field]?.validation?.[validationField] || false}
        onCheckedChange={(checked) =>
          setData((prev) => ({
            ...prev,
            [field]: {
              ...prev[field],
              validation: { ...prev[field].validation, [validationField]: checked },
            },
          }))
        }
        className="w-4 h-4"
      />
      <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
        {label}
      </Label>
    </div>
  )
}

function ValidationInput({ id, label, field, validationField, data, setData, type = "text" }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        type={type}
        id={id}
        value={data[field]?.validation?.[validationField] || ""}
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            [field]: {
              ...prev[field],
              validation: { ...prev[field].validation, [validationField]: e.target.value },
            },
          }))
        }
        className="transition-all duration-200 h-9 focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}

function ValidationSelect({ id, label, field, validationField, data, setData, options }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <select
        id={id}
        value={data[field]?.validation?.[validationField] || ""}
        onChange={(e) =>
          setData((prev) => ({
            ...prev,
            [field]: {
              ...prev[field],
              validation: { ...prev[field].validation, [validationField]: e.target.value },
            },
          }))
        }
        className="w-full px-3 py-1 text-sm transition-all duration-200 border rounded-md shadow-sm h-9 border-input bg-background focus:ring-2 focus:ring-primary"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

