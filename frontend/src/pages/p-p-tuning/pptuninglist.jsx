"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getAllP_P_Tuning, deleteP_P_Tuning } from "../../apis/p-p-tuning-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/NavBar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { format } from "date-fns"

const p_p_tuningFields = [
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

const P_P_TuningList = () => {
  const [p_p_tunings, setP_P_Tunings] = useState([])
  const [filteredP_P_Tunings, setFilteredP_P_Tunings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    fetchP_P_Tunings()
  }, [])

  const filterP_P_Tunings = useCallback(() => {
    let filtered = p_p_tunings.filter(
      (p_p_tuning) =>
        p_p_tuning._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStatusText(p_p_tuning).toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (activeTab !== "all") {
      filtered = filtered.filter((p_p_tuning) => getStatusText(p_p_tuning).toLowerCase() === activeTab)
    }

    setFilteredP_P_Tunings(filtered)
  }, [searchTerm, p_p_tunings, activeTab])

  useEffect(() => {
    filterP_P_Tunings()
  }, [filterP_P_Tunings])

  const fetchP_P_Tunings = async () => {
    try {
      setIsLoading(true)
      const data = await getAllP_P_Tuning()
      setP_P_Tunings(data)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch product process tunings:", error)
      setError("Failed to fetch product process tunings. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product process tuning?")) {
      try {
        await deleteP_P_Tuning(id)
        fetchP_P_Tunings()
      } catch (error) {
        console.error("Failed to delete product process tuning:", error)
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/p_p_tuning/edit/${id}`)
  }

  const handleView = (p_p_tuning) => {
    // No need to set state as we're using the p_p_tuning directly in the Dialog
  }

  const handleCreate = () => {
    navigate("/p_p_tuning/create")
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Product Process Tuning</h1>
          <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" /> Create New
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <Input
              type="text"
              placeholder="Search product process tunings..."
              className="w-full py-2 pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="not started">Not Started</TabsTrigger>
            <TabsTrigger value="in progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredP_P_Tunings.map((p_p_tuning) => (
              <Dialog key={p_p_tuning._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        P_P_Tuning {p_p_tuning._id.slice(0, 8)}...
                      </CardTitle>
                      <CardDescription>
                        <Badge variant={getStatusVariant(p_p_tuning)}>{getStatusText(p_p_tuning)}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2 text-sm text-gray-600">
                        Completed Tasks: {p_p_tuningFields.filter((field) => p_p_tuning[field]?.value).length} /
                        {p_p_tuningFields.length}
                      </p>
                      <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${(p_p_tuningFields.filter((field) => p_p_tuning[field]?.value).length / p_p_tuningFields.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <DialogTrigger asChild>
                        <Button onClick={() => handleView(p_p_tuning)} variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" /> View
                        </Button>
                      </DialogTrigger>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleEdit(p_p_tuning._id)} variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                        <Button onClick={() => handleDelete(p_p_tuning._id)} variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Product Process Tuning Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>
                      <strong>ID:</strong> {p_p_tuning._id}
                    </p>
                    <p>
                      <strong>Status:</strong> {getStatusText(p_p_tuning)}
                    </p>
                    <p>
                      <strong>Created At:</strong> {format(new Date(p_p_tuning.createdAt), "PPP")}
                    </p>
                    <p>
                      <strong>Updated At:</strong> {format(new Date(p_p_tuning.updatedAt), "PPP")}
                    </p>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Tasks:</h3>
                      {p_p_tuningFields.map((field) => (
                        <div key={field} className="p-2 border rounded">
                          <h4 className="font-medium">
                            {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </h4>
                          <p>
                            <strong>Completed:</strong> {p_p_tuning[field]?.value ? "Yes" : "No"}
                          </p>
                          {p_p_tuning[field]?.task && (
                            <>
                              <p>
                                <strong>Responsible:</strong> {p_p_tuning[field].task.responsible || "Not assigned"}
                              </p>
                              <p>
                                <strong>Planned Date:</strong>{" "}
                                {p_p_tuning[field].task.planned
                                  ? format(new Date(p_p_tuning[field].task.planned), "PP")
                                  : "Not scheduled"}
                              </p>
                              <p>
                                <strong>Completion Date:</strong>{" "}
                                {p_p_tuning[field].task.done
                                  ? format(new Date(p_p_tuning[field].task.done), "PP")
                                  : "Not completed"}
                              </p>
                              <p>
                                <strong>Comments:</strong> {p_p_tuning[field].task.comments || "No comments"}
                              </p>
                              <p>
                                <strong>File:</strong> {p_p_tuning[field].task.filePath || "No file attached"}
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </ScrollArea>
        {filteredP_P_Tunings.length === 0 && (
          <p className="mt-8 text-center text-gray-500">No product process tunings found.</p>
        )}
      </div>
    </div>
  )
}

const getStatusVariant = (p_p_tuning) => {
  const completedTasks = p_p_tuningFields.filter((field) => p_p_tuning[field]?.value).length
  const totalTasks = p_p_tuningFields.length

  if (completedTasks === totalTasks) return "success"
  if (completedTasks > 0) return "warning"
  return "secondary"
}

const getStatusText = (p_p_tuning) => {
  const completedTasks = p_p_tuningFields.filter((field) => p_p_tuning[field]?.value).length
  const totalTasks = p_p_tuningFields.length

  if (completedTasks === totalTasks) return "Completed"
  if (completedTasks > 0) return "In Progress"
  return "Not Started"
}

export default P_P_TuningList

