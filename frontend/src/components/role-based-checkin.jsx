"use client"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, LockIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Updated role fields with exact role names
const roleFields = [
  { id: "project_manager", label: "Project Manager" },
  { id: "business_manager", label: "Business Manager" },
  { id: "financial_leader", label: "Financial Leader" },
  { id: "manufacturing_eng_manager", label: "Manufacturing Eng. Manager" },
  { id: "manufacturing_eng_leader", label: "Manufacturing Eng. Leader" },
  { id: "methodes_uap1_3", label: "Methodes UAP1&3" },
  { id: "methodes_uap2", label: "Methodes UAP2" },
  { id: "maintenance_manager", label: "Maintenance Manager" },
  { id: "maintenance_leader_uap2", label: "Maintenance Leader UAP2" },
  { id: "prod_plant_manager_uap1", label: "Prod. Plant Manager UAP1" },
  { id: "prod_plant_manager_uap2", label: "Prod. Plant Manager UAP2" },
  { id: "quality_manager", label: "Quality Manager" },
  { id: "quality_leader_uap1", label: "Quality Leader UAP1" },
  { id: "quality_leader_uap2", label: "Quality Leader UAP2" },
  { id: "quality_leader_uap3", label: "Quality Leader UAP3" },
]

const RoleBasedCheckin = ({ checkinData, setCheckinData, readOnly = false, showTitle = true }) => {
  const { user } = useAuth()
  const { toast } = useToast()

  // Check if user has a specific role
  const hasRole = (roleId) => {
    if (!user?.roles) return false

    // Map from field ID to actual role name
    const roleMapping = {
      project_manager: "Project Manager",
      business_manager: "Business Manager",
      financial_leader: "Financial Leader",
      manufacturing_eng_manager: "Manufacturing Eng. Manager",
      manufacturing_eng_leader: "Manufacturing Eng. Leader",
      methodes_uap1_3: "Methodes UAP1&3",
      methodes_uap2: "Methodes UAP2",
      maintenance_manager: "Maintenance Manager",
      maintenance_leader_uap2: "Maintenance Leader UAP2",
      prod_plant_manager_uap1: "Prod. Plant Manager UAP1",
      prod_plant_manager_uap2: "Prod. Plant Manager UAP2",
      quality_manager: "Quality Manager",
      quality_leader_uap1: "Quality Leader UAP1",
      quality_leader_uap2: "Quality Leader UAP2",
      quality_leader_uap3: "Quality Leader UAP3",
    }

    const roleName = roleMapping[roleId]
    return user.roles.includes(roleName)
  }

  // Check if user is an admin (can edit all roles)
  const isAdmin = () => {
    return user?.roles?.includes("admin") || user?.roles?.includes("Admin")
  }

  // Determine if a field is editable by the current user
  const canEditField = (fieldId) => {
    if (readOnly) return false
    return isAdmin() || hasRole(fieldId)
  }

  const handleCheckboxChange = (fieldId) => {
    if (!canEditField(fieldId)) {
      toast({
        title: "Access Denied",
        description: `Only users with the ${fieldId.replace(/_/g, " ")} role can modify this section.`,
        variant: "destructive",
      })
      return
    }

    setCheckinData({
      ...checkinData,
      [fieldId]: {
        ...checkinData[fieldId],
        value: !checkinData[fieldId]?.value,
        date: !checkinData[fieldId]?.value ? new Date().toISOString() : checkinData[fieldId]?.date,
      },
    })
  }

  const handleCommentChange = (fieldId, value) => {
    if (!canEditField(fieldId)) return

    setCheckinData({
      ...checkinData,
      [fieldId]: {
        ...checkinData[fieldId],
        comment: value,
      },
    })
  }

  const handleNameChange = (fieldId, value) => {
    if (!canEditField(fieldId)) return

    setCheckinData({
      ...checkinData,
      [fieldId]: {
        ...checkinData[fieldId],
        name: value,
      },
    })
  }

  const handleDateChange = (fieldId, date) => {
    if (!canEditField(fieldId)) return

    setCheckinData({
      ...checkinData,
      [fieldId]: {
        ...checkinData[fieldId],
        date: date.toISOString(),
      },
    })
  }

  return (
    <>
      {showTitle && (
        <CardHeader>
          <CardTitle>Check-in Details</CardTitle>
          <CardDescription>
            Each role can only edit their own section. Check the box for completed items, add your name, and provide
            comments.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <motion.div
          className="grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {roleFields.map((field, index) => {
            const isEditable = canEditField(field.id)

            return (
              <motion.div
                key={field.id}
                className={cn(
                  "p-4 border rounded-lg relative",
                  isEditable ? "border-primary/20" : "border-muted",
                  isEditable && "hover:border-primary/50",
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {!isEditable && (
                  <div className="absolute top-2 right-2 text-muted-foreground">
                    <LockIcon size={14} />
                  </div>
                )}

                <div className="flex items-start mb-3 space-x-3">
                  <Checkbox
                    id={`${field.id}-checkbox`}
                    checked={checkinData[field.id]?.value || false}
                    disabled={!isEditable}
                    onCheckedChange={() => handleCheckboxChange(field.id)}
                    className={!isEditable ? "opacity-60" : ""}
                  />
                  <label
                    htmlFor={`${field.id}-checkbox`}
                    className={cn(
                      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed",
                      !isEditable ? "text-muted-foreground" : "",
                    )}
                  >
                    {field.label}
                  </label>
                </div>

                <div className="mb-3">
                  <Label
                    htmlFor={`${field.id}-name`}
                    className={cn("block mb-1 text-xs", !isEditable ? "text-muted-foreground" : "text-gray-500")}
                  >
                    Name
                  </Label>
                  <Input
                    id={`${field.id}-name`}
                    placeholder={isEditable ? "Enter name" : "Not editable"}
                    value={checkinData[field.id]?.name || ""}
                    onChange={(e) => handleNameChange(field.id, e.target.value)}
                    disabled={!isEditable}
                    className={cn("h-8 text-sm", !isEditable ? "opacity-60" : "")}
                  />
                </div>

                <div className="mb-3">
                  <Label className={cn("block mb-1 text-xs", !isEditable ? "text-muted-foreground" : "text-gray-500")}>
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={!isEditable}
                        className={cn(
                          "justify-start w-full h-8 text-sm font-normal text-left",
                          !isEditable ? "opacity-60" : "",
                        )}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {checkinData[field.id]?.date ? (
                          format(new Date(checkinData[field.id].date), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkinData[field.id]?.date ? new Date(checkinData[field.id].date) : undefined}
                        onSelect={(date) => date && handleDateChange(field.id, date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Label
                  htmlFor={`${field.id}-comment`}
                  className={cn("block mb-1 text-xs", !isEditable ? "text-muted-foreground" : "text-gray-500")}
                >
                  Comments
                </Label>
                <Textarea
                  id={`${field.id}-comment`}
                  placeholder={isEditable ? "Add comments here..." : "Not editable"}
                  value={checkinData[field.id]?.comment || ""}
                  onChange={(e) => handleCommentChange(field.id, e.target.value)}
                  disabled={!isEditable}
                  className={cn("h-20 text-sm", !isEditable ? "opacity-60" : "")}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </CardContent>
    </>
  )
}

export default RoleBasedCheckin
