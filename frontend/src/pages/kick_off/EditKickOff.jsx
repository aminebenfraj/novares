"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getKickOffById, updateKickOff } from "../../apis/kickOffApi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Upload, CalendarIcon, ArrowLeft, Save, Loader2, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import MainLayout from "@/components/MainLayout"
import { getAvailableRoles, getUsersByRole } from "../../apis/taskApi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck } from "lucide-react"

const kickOffFields = [
  "timeScheduleApproved",
  "modificationLaunchOrder",
  "projectRiskAssessment",
  "standardsImpact",
  "validationOfCosts",
]

// Define field config for better UI
const fieldConfig = {}
kickOffFields.forEach((field) => {
  fieldConfig[field] = {
    label: field.replace(/([A-Z])/g, " $1").trim(),
    description: `Configuration for ${field
      .replace(/([A-Z])/g, " $1")
      .trim()
      .toLowerCase()}`,
  }
})

const EditKickOff = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState(kickOffFields[0])
  const [massProductionId, setMassProductionId] = useState(null)
  const [selectedRole, setSelectedRole] = useState("")
  const [availableRoles, setAvailableRoles] = useState([])
  const [usersByRole, setUsersByRole] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [formData, setFormData] = useState(() => {
    const initialState = {}
    kickOffFields.forEach((field) => {
      initialState[field] = {
        value: false,
        task: {
          check: false,
          responsible: "",
          planned: "",
          done: "",
          comments: "",
          filePath: null,
        },
      }
    })
    return initialState
  })

  useEffect(() => {
    if (id) {
      fetchKickOff()
    }
  }, [id])

  // Add this useEffect to extract massProductionId from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const mpId = queryParams.get("massProductionId")

    if (mpId) {
      console.log("Extracted massProductionId from URL:", mpId)
      setMassProductionId(mpId)
      // Store in localStorage as fallback
      localStorage.setItem("lastMassProductionId", mpId)
    } else {
      // Try to get from localStorage as a fallback
      const storedMpId = localStorage.getItem("lastMassProductionId")
      if (storedMpId) {
        console.log("Retrieved massProductionId from localStorage:", storedMpId)
        setMassProductionId(storedMpId)
      } else {
        // If we still don't have an ID, try to extract it from the URL path
        const pathParts = window.location.pathname.split("/")
        const editIndex = pathParts.indexOf("edit")
        if (editIndex > 0 && editIndex < pathParts.length - 1) {
          const possibleId = pathParts[editIndex + 1]
          if (possibleId && possibleId !== "masspd_idAttachment") {
            console.log("Extracted massProductionId from URL path:", possibleId)
            setMassProductionId(possibleId)
            localStorage.setItem("lastMassProductionId", possibleId)
          }
        }
      }
    }
  }, [])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await getAvailableRoles()
        setAvailableRoles(roles)
      } catch (error) {
        console.error("Error fetching roles:", error)
        toast({
          title: "Error",
          description: "Failed to load available roles",
          variant: "destructive",
        })
      }
    }
    fetchRoles()
  }, [])

  useEffect(() => {
    const fetchUsersByRole = async () => {
      if (!selectedRole) {
        setUsersByRole([])
        return
      }

      setLoadingUsers(true)
      try {
        const users = await getUsersByRole(selectedRole)
        setUsersByRole(users)
      } catch (error) {
        console.error("Error fetching users by role:", error)
        toast({
          title: "Error",
          description: "Failed to load users for selected role",
          variant: "destructive",
        })
      } finally {
        setLoadingUsers(false)
      }
    }
    fetchUsersByRole()
  }, [selectedRole])

  const fetchKickOff = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getKickOffById(id)
      if (!data) {
        throw new Error("Kick-Off data not found.")
      }

      const fetchedData = { ...formData }
      kickOffFields.forEach((field) => {
        fetchedData[field] = {
          value: data[field]?.value || false,
          task: { ...data[field]?.task },
        }
      })
      setFormData(fetchedData)
    } catch (error) {
      console.error("Error fetching Kick-Off data:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: "Failed to load kick-off data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckboxChange = (field, checked) => {
    setFormData({
      ...formData,
      [field]: { ...formData[field], value: checked },
    })
  }

  const handleTaskChange = (e, field, type) => {
    const value = type === "check" ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        task: { ...formData[field].task, [type]: value },
      },
    })
  }

  const handleDateChange = (field, type, date) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        task: { ...formData[field].task, [type]: format(date, "yyyy-MM-dd") },
      },
    })
  }

  const handleFileChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        task: { ...formData[field].task, filePath: e.target.files[0] },
      },
    })
  }

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const handleAssignUsers = () => {
    // Update the current active tab's task with selected users
    setFormData({
      ...formData,
      [activeTab]: {
        ...formData[activeTab],
        task: {
          ...formData[activeTab].task,
          assignedUsers: selectedUsers,
        },
      },
    })

    toast({
      title: "Success",
      description: `${selectedUsers.length} users assigned to ${activeTab}`,
    })

    // Clear selections
    setSelectedUsers([])
    setSelectedRole("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const submissionData = { ...formData }

    Object.keys(submissionData).forEach((field) => {
      if (submissionData[field].task.filePath instanceof File) {
        submissionData[field].task.filePath = submissionData[field].task.filePath.name
      }
    })

    try {
      await updateKickOff(id, submissionData)
      toast({
        title: "Success",
        description: "Kick-Off updated successfully",
      })

      // Navigate back to mass production details page if massProductionId is available
      if (massProductionId) {
        navigate(`/masspd/detail/${massProductionId}`)
      } else {
        navigate("/kickoff")
      }
    } catch (error) {
      console.error("Error updating Kick-Off:", error)
      toast({
        title: "Error",
        description: "Failed to update kick-off. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load kick-off data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/kickoff")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Kick-Off
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="container px-4 py-8 mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (massProductionId && massProductionId !== "masspd_idAttachment") {
                    navigate(`/masspd/detail/${massProductionId}`)
                  } else {
                    navigate("/kickoff")
                  }
                }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Kick-Off</h1>
                <p className="text-muted-foreground">Update kick-off details and tasks</p>
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Kick-Off Fields</CardTitle>
                  <CardDescription>Select a field to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto">
                      {kickOffFields.map((field) => (
                        <TabsTrigger key={field} value={field} className="relative justify-start mb-1 text-left pl-9">
                          <span className="absolute left-2">
                            {formData[field]?.value ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </span>
                          {field.replace(/([A-Z])/g, " $1").trim()}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>{fieldConfig[activeTab]?.label || activeTab}</CardTitle>
                  <CardDescription>{fieldConfig[activeTab]?.description || "Update kick-off details"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="status" className="w-full">
                    <TabsList>
                      <TabsTrigger value="status">Status</TabsTrigger>
                      <TabsTrigger value="details">Task Details</TabsTrigger>
                      <TabsTrigger value="users">Assign Users</TabsTrigger>
                    </TabsList>
                    <TabsContent value="status" className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${activeTab}-value`}
                          checked={formData[activeTab]?.value || false}
                          onCheckedChange={(checked) => handleCheckboxChange(activeTab, checked === true)}
                        />
                        <Label htmlFor={`${activeTab}-value`}>Mark as completed</Label>
                      </div>
                    </TabsContent>
                    <TabsContent value="details" className="pt-4 space-y-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-responsible`}>Responsible</Label>
                            <Input
                              id={`${activeTab}-responsible`}
                              type="text"
                              value={formData[activeTab]?.task.responsible || ""}
                              onChange={(e) => handleTaskChange(e, activeTab, "responsible")}
                              placeholder="Enter responsible person"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-check`}>Completion Status</Label>
                            <div className="flex items-center pt-2 space-x-2">
                              <Checkbox
                                id={`${activeTab}-check`}
                                checked={formData[activeTab]?.task.check || false}
                                onCheckedChange={(checked) =>
                                  handleTaskChange({ target: { checked } }, activeTab, "check")
                                }
                              />
                              <Label htmlFor={`${activeTab}-check`}>Mark as Completed</Label>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-planned`}>Planned Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={`w-full justify-start text-left font-normal ${
                                    !formData[activeTab]?.task.planned && "text-muted-foreground"
                                  }`}
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  {formData[activeTab]?.task.planned ? (
                                    format(new Date(formData[activeTab]?.task.planned), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={
                                    formData[activeTab]?.task.planned
                                      ? new Date(formData[activeTab]?.task.planned)
                                      : undefined
                                  }
                                  onSelect={(date) => handleDateChange(activeTab, "planned", date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${activeTab}-done`}>Completion Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={`w-full justify-start text-left font-normal ${
                                    !formData[activeTab]?.task.done && "text-muted-foreground"
                                  }`}
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  {formData[activeTab]?.task.done ? (
                                    format(new Date(formData[activeTab]?.task.done), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={
                                    formData[activeTab]?.task.done
                                      ? new Date(formData[activeTab]?.task.done)
                                      : undefined
                                  }
                                  onSelect={(date) => handleDateChange(activeTab, "done", date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-comments`}>Comments</Label>
                          <Textarea
                            id={`${activeTab}-comments`}
                            value={formData[activeTab]?.task.comments || ""}
                            onChange={(e) => handleTaskChange(e, activeTab, "comments")}
                            placeholder="Enter comments..."
                            rows={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`${activeTab}-file`}>Upload File</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id={`${activeTab}-file`}
                              type="file"
                              onChange={(e) => handleFileChange(e, activeTab)}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById(`${activeTab}-file`).click()}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {formData[activeTab]?.task.filePath?.name || "No file chosen"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>
                    <TabsContent value="users" className="pt-4 space-y-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="role-select">Select Role</Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a role to see users" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableRoles.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {selectedRole && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label>Users with role: {selectedRole}</Label>
                                {selectedUsers.length > 0 && (
                                  <Badge variant="secondary">{selectedUsers.length} selected</Badge>
                                )}
                              </div>

                              {loadingUsers ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="w-6 h-6 animate-spin" />
                                  <span className="ml-2">Loading users...</span>
                                </div>
                              ) : usersByRole.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                  <p>No users found with role: {selectedRole}</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-64">
                                  {usersByRole.map((user) => (
                                    <div
                                      key={user._id}
                                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                                        selectedUsers.includes(user._id)
                                          ? "bg-primary/10 border-primary"
                                          : "hover:bg-muted"
                                      }`}
                                      onClick={() => handleUserSelection(user._id)}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div
                                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                            selectedUsers.includes(user._id)
                                              ? "bg-primary border-primary"
                                              : "border-muted-foreground"
                                          }`}
                                        >
                                          {selectedUsers.includes(user._id) && (
                                            <UserCheck className="w-3 h-3 text-primary-foreground" />
                                          )}
                                        </div>
                                        <div>
                                          <p className="font-medium">{user.username}</p>
                                          <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {user.roles.map((role) => (
                                          <Badge key={role} variant="outline" className="text-xs">
                                            {role}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {selectedUsers.length > 0 && (
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedUsers([])
                                      setSelectedRole("")
                                    }}
                                  >
                                    Clear Selection
                                  </Button>
                                  <Button onClick={handleAssignUsers}>
                                    Assign {selectedUsers.length} User{selectedUsers.length !== 1 ? "s" : ""}
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}

                          {formData[activeTab]?.task?.assignedUsers?.length > 0 && (
                            <div className="space-y-2">
                              <Label>Currently Assigned Users</Label>
                              <div className="flex flex-wrap gap-2">
                                {formData[activeTab].task.assignedUsers.map((userId) => {
                                  const user = usersByRole.find((u) => u._id === userId) || {
                                    _id: userId,
                                    username: `User ${userId}`,
                                    email: "",
                                  }
                                  return (
                                    <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                                      {user.username}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setFormData({
                                            ...formData,
                                            [activeTab]: {
                                              ...formData[activeTab],
                                              task: {
                                                ...formData[activeTab].task,
                                                assignedUsers: formData[activeTab].task.assignedUsers.filter(
                                                  (id) => id !== userId,
                                                ),
                                              },
                                            },
                                          })
                                        }}
                                        className="ml-1 hover:text-destructive"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (massProductionId && massProductionId !== "masspd_idAttachment") {
                        // Ensure we're using the correct URL format
                        navigate(`/masspd/detail/${massProductionId}`)
                      } else {
                        navigate("/kickoff")
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default EditKickOff
