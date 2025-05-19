"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, CheckCircle, XCircle, GraduationCap, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getAllTraining } from "../../../apis/readiness/trainingApi"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

// Define the field labels for better UI
const fieldConfig = {
  visualControlQualification: "Visual Control Qualification",
  dojoTrainingCompleted: "Dojo Training Completed",
  trainingPlanDefined: "Training Plan Defined",
  trainingPlan: "Training Plan",
}

function TrainingList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [trainingRecords, setTrainingRecords] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date") // date, completion
  const [viewType, setViewType] = useState("grid") // grid, list

  // Fetch all training records
  useEffect(() => {
    const fetchTrainingRecords = async () => {
      try {
        setIsLoading(true)
        const data = await getAllTraining()
        setTrainingRecords(data)
      } catch (error) {
        console.error("Error fetching training records:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load training data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrainingRecords()
  }, [toast])

  // Calculate completion percentage for a training record
  const calculateCompletion = (record) => {
    if (!record) return 0

    const fields = Object.keys(fieldConfig)
    const completedFields = fields.filter((field) => record[field]?.value === true)
    return Math.round((completedFields.length / fields.length) * 100)
  }

  // Filter training records based on search term
  const filteredRecords = trainingRecords.filter((record) => {
    if (!searchTerm) return true

    // Search in validation details
    const searchInDetails = (field) => {
      const details = record[field]?.details
      if (!details) return false

      return (
        details.who?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        details.when?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        details.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Check if any field's details match the search term
    return Object.keys(fieldConfig).some(searchInDetails)
  })

  // Sort records based on sortBy
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy === "completion") {
      return calculateCompletion(b) - calculateCompletion(a)
    }
    return 0
  })

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
          <div>
            <Skeleton className="w-48 h-8 mb-2" />
            <Skeleton className="w-64 h-4" />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="w-[300px] h-10" />
            <Skeleton className="w-40 h-10" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="inline-flex items-center"
              >
                <GraduationCap className="w-8 h-8 mr-2 text-purple-500" />
                Training Management
              </motion.span>
            </h1>
            <p className="text-muted-foreground">Manage training records and qualification status</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search training records..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate("/training/new")} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Training Record
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
          <Tabs defaultValue="grid" value={viewType} onValueChange={setViewType} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-2 md:w-[200px]">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Sort by: {sortBy === "date" ? "Date" : "Completion"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("date")}>Sort by Date</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("completion")}>Sort by Completion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filteredRecords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>No Training Records Found</CardTitle>
                <CardDescription>
                  {searchTerm ? "No records match your search criteria" : "No training records available"}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => navigate("/training/new")} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Training Record
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : viewType === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {sortedRecords.map((record, index) => {
                const completionPercentage = calculateCompletion(record)

                return (
                  <motion.div
                    key={record._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Card
                      className="flex flex-col h-full transition-all border-l-4 cursor-pointer hover:shadow-lg"
                      style={{
                        borderLeftColor:
                          completionPercentage === 100
                            ? "rgb(147, 51, 234)"
                            : completionPercentage > 50
                              ? "rgb(245, 158, 11)"
                              : "rgb(239, 68, 68)",
                      }}
                      onClick={() => navigate(`/training/edit/${record._id}`)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center">
                              <GraduationCap className="w-5 h-5 mr-2 text-purple-500" />
                              Training Record
                            </CardTitle>
                            <CardDescription>
                              Created: {new Date(record.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={completionPercentage === 100 ? "default" : "outline"}
                            className={completionPercentage === 100 ? "bg-purple-500 hover:bg-purple-600" : ""}
                          >
                            {completionPercentage}% Complete
                          </Badge>
                        </div>
                        <Progress
                          value={completionPercentage}
                          className="h-2 mt-2"
                          indicatorClassName={
                            completionPercentage === 100
                              ? "bg-purple-500"
                              : completionPercentage > 50
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }
                        />
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-2">
                          {Object.entries(fieldConfig).map(([field, label]) => (
                            <div key={field} className="flex items-center justify-between">
                              <span className="text-sm">{label}</span>
                              {record[field]?.value ? (
                                <CheckCircle className="w-4 h-4 text-purple-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-4 border-t">
                        <Button
                          variant="ghost"
                          className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/training/edit/${record._id}`)
                          }}
                        >
                          Edit Training Record
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {sortedRecords.map((record, index) => {
                    const completionPercentage = calculateCompletion(record)

                    return (
                      <motion.div
                        key={record._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.2 }}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                        className="p-4 cursor-pointer"
                        onClick={() => navigate(`/training/edit/${record._id}`)}
                      >
                        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                          <div>
                            <h3 className="flex items-center text-lg font-medium">
                              <GraduationCap className="w-5 h-5 mr-2 text-purple-500" />
                              Training Record
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Created: {new Date(record.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              variant={completionPercentage === 100 ? "default" : "outline"}
                              className={completionPercentage === 100 ? "bg-purple-500 hover:bg-purple-600" : ""}
                            >
                              {completionPercentage}% Complete
                            </Badge>

                            <div className="flex items-center gap-4">
                              {Object.entries(fieldConfig).map(([field, label]) => (
                                <div key={field} className="flex items-center gap-1">
                                  <span className="text-xs">{label.split(" ")[0]}</span>
                                  {record[field]?.value ? (
                                    <CheckCircle className="w-4 h-4 text-purple-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                              ))}

                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/training/edit/${record._id}`)
                                }}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default TrainingList

