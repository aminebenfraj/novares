"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllKickOffs, deleteKickOff } from "../../apis/kickOffApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, Plus } from "lucide-react"
import Navbar from "@/components/NavBar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const KickOffList = () => {
  const [kickOffs, setKickOffs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchKickOffs()
  }, [])

  const fetchKickOffs = async () => {
    try {
      setIsLoading(true)
      const data = await getAllKickOffs()
      setKickOffs(data)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch kick-offs:", error)
      setError("Failed to fetch kick-offs. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this kick-off?")) {
      try {
        await deleteKickOff(id)
        fetchKickOffs()
      } catch (error) {
        console.error("Failed to delete kick-off:", error)
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/edit-kickoff/${id}`)
  }

  const handleCreate = () => {
    navigate("/create-kickoff")
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
      <div className="container p-4 mx-auto">
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between bg-gray-50">
            <CardTitle className="text-2xl font-bold text-gray-800">Kick-Offs</CardTitle>
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" /> Create New Kick-Off
            </Button>
          </CardHeader>
          <CardContent>
            {kickOffs && kickOffs.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kickOffs.map((kickOff) => (
                      <TableRow key={kickOff._id}>
                        <TableCell className="font-medium">{kickOff._id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(kickOff)}>{getStatusText(kickOff)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                              <AccordionTrigger>View Details</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {Object.entries(kickOff).map(([key, value]) => {
                                    if (key !== "_id" && typeof value === "object") {
                                      return (
                                        <div key={key} className="pb-2 border-b">
                                          <h4 className="font-semibold capitalize">
                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                          </h4>
                                          <p>Value: {value.value ? "Yes" : "No"}</p>
                                          {value.task && (
                                            <div className="mt-1 ml-4">
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
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleEdit(kickOff._id)}
                            className="mr-2 bg-blue-500 hover:bg-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDelete(kickOff._id)} className="bg-red-500 hover:bg-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="py-4 text-center">No kick-offs found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const getStatusVariant = (kickOff) => {
  const completedTasks = Object.values(kickOff).filter((v) => typeof v === "object" && v.value).length
  const totalTasks = Object.values(kickOff).filter((v) => typeof v === "object").length

  if (completedTasks === totalTasks) return "success"
  if (completedTasks > 0) return "warning"
  return "secondary"
}

const getStatusText = (kickOff) => {
  const completedTasks = Object.values(kickOff).filter((v) => typeof v === "object" && v.value).length
  const totalTasks = Object.values(kickOff).filter((v) => typeof v === "object").length

  if (completedTasks === totalTasks) return "Completed"
  if (completedTasks > 0) return "In Progress"
  return "Not Started"
}

export default KickOffList

