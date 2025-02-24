    import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getAllDesigns, deleteDesign } from "../../apis/designApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, ChevronRight } from 'lucide-react'
import Navbar from "@/components/NavBar"

const DesignList = () => {
  const [designs, setDesigns] = useState([])
  const [filteredDesigns, setFilteredDesigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    fetchDesigns()
  }, [])

  const filterDesigns = useCallback(() => {
    let filtered = designs.filter(
      (design) =>
        design._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStatusText(design).toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (activeTab !== "all") {
      filtered = filtered.filter((design) => getStatusText(design).toLowerCase() === activeTab)
    }

    setFilteredDesigns(filtered)
  }, [searchTerm, designs, activeTab])

  useEffect(() => {
    filterDesigns()
  }, [filterDesigns])

  const fetchDesigns = async () => {
    try {
      setIsLoading(true)
      const data = await getAllDesigns()
      setDesigns(data)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch designs:", error)
      setError("Failed to fetch designs. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this design?")) {
      try {
        await deleteDesign(id)
        fetchDesigns()
      } catch (error) {
        console.error("Failed to delete design:", error)
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/design/edit/${id}`)
  }

  const handleCreate = () => {
    navigate("/design/create")
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
          <h1 className="text-3xl font-bold text-gray-800">Designs</h1>
          <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" /> Create New Design
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <Input
              type="text"
              placeholder="Search designs..."
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
            {filteredDesigns.map((design) => (
              <motion.div
                key={design._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Design {design._id.slice(0, 8)}...</CardTitle>
                    <CardDescription>
                      <Badge variant={getStatusVariant(design)}>{getStatusText(design)}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-sm text-gray-600">
                      Completed Tasks: {Object.values(design).filter((v) => typeof v === "object" && v.value).length} /
                      {Object.values(design).filter((v) => typeof v === "object").length}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Design Details</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh]">
                          <div className="space-y-4">
                            {Object.entries(design).map(([key, value]) => {
                              if (key !== "_id" && typeof value === "object") {
                                return (
                                  <div key={key} className="pb-4 border-b">
                                    <h4 className="font-semibold capitalize">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </h4>
                                    <p>Value: {value.value ? "Yes" : "No"}</p>
                                    {value.task && (
                                      <div className="mt-2 ml-4 space-y-1">
                                        <p>Responsible: {value.task.responsible}</p>
                                        <p>Planned: {new Date(value.task.planned).toLocaleDateString()}</p>
                                        <p>
                                          Done:{" "}
                                          {value.task.done
                                            ? new Date(value.task.done).toLocaleDateString()
                                            : "Not completed"}
                                        </p>
                                        <p>Comments: {value.task.comments || "No comments"}</p>
                                      </div>
                                    )}
                                  </div>
                                )
                              }
                              return null
                            })}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button onClick={() => handleEdit(design._id)} variant="outline" size="sm" className="flex-1 mr-2">
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(design._id)}
                      variant="destructive"
                      size="sm"
                      className="flex-1 ml-2"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        {filteredDesigns.length === 0 && <p className="mt-8 text-center text-gray-500">No designs found.</p>}
      </div>
    </div>
  )
}

const getStatusVariant = (design) => {
  const completedTasks = Object.values(design).filter((v) => typeof v === "object" && v.value).length
  const totalTasks = Object.values(design).filter((v) => typeof v === "object").length

  if (completedTasks === totalTasks) return "success"
  if (completedTasks > 0) return "warning"
  return "secondary"
}

const getStatusText = (design) => {
  const completedTasks = Object.values(design).filter((v) => typeof v === "object" && v.value).length
  const totalTasks = Object.values(design).filter((v) => typeof v === "object").length

  if (completedTasks === totalTasks) return "Completed"
  if (completedTasks > 0) return "In Progress"
  return "Not Started"
}

export default DesignList
