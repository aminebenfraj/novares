"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getCheckins, deleteCheckin }  from "../../apis/checkIn"
import MainLayout from "@/components/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, Edit, Plus, Info } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const roleFields = [
  { id: "project_manager", label: "Project Manager" },
  { id: "business_manager", label: "Business Manager" },
  { id: "engineering_leader_manager", label: "Engineering Leader/Manager" },
  { id: "quality_leader", label: "Quality Leader" },
  { id: "plant_quality_leader", label: "Plant Quality Leader" },
  { id: "industrial_engineering", label: "Industrial Engineering" },
  { id: "launch_manager_method", label: "Launch Manager Method" },
  { id: "maintenance", label: "Maintenance" },
  { id: "purchasing", label: "Purchasing" },
  { id: "logistics", label: "Logistics" },
  { id: "sales", label: "Sales" },
  { id: "economic_financial_leader", label: "Economic Financial Leader" },
]

function CheckinList() {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCheckins()
  }, [])

  const fetchCheckins = async () => {
    try {
      setLoading(true)
      const response = await getCheckins()
      setCheckins(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch check-ins",
        variant: "destructive",
      })
      console.error("Error fetching check-ins:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCheckin(id)
      toast({
        title: "Success",
        description: "Check-in deleted successfully",
      })
      fetchCheckins()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete check-in",
        variant: "destructive",
      })
      console.error("Error deleting check-in:", error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCompletionStatus = (checkin) => {
    const fields = roleFields.map((field) => field.id)
    const completedFields = fields.filter((field) => checkin[field]?.value === true).length
    const percentage = Math.round((completedFields / fields.length) * 100)
    return `${percentage}%`
  }

  const getLastUpdatedRole = (checkin) => {
    let lastUpdated = null
    let lastRole = null

    roleFields.forEach((field) => {
      if (checkin[field.id]?.value && checkin[field.id]?.date) {
        const roleDate = new Date(checkin[field.id].date)
        if (!lastUpdated || roleDate > lastUpdated) {
          lastUpdated = roleDate
          lastRole = field
        }
      }
    })

    return lastRole
      ? {
          label: lastRole.label,
          date: lastUpdated,
          name: checkin[lastRole.id].name || "Unknown",
        }
      : null
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container px-4 py-8 mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Check-ins</h1>
          <Button onClick={() => navigate("/checkin/create")} className="flex items-center gap-2">
            <Plus size={16} />
            New Check-in
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-12 h-12 border-b-2 border-gray-900 rounded-full animate-spin"></div>
              </div>
            ) : checkins.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No check-ins found. Create your first one!</div>
            ) : (
              <motion.div variants={container} initial="hidden" animate="show">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Last Check-in</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checkins.map((checkin) => {
                      const lastUpdatedRole = getLastUpdatedRole(checkin)

                      return (
                        <motion.tr key={checkin._id} variants={item} className="border-b">
                          <TableCell className="font-medium">{checkin._id.substring(0, 8)}...</TableCell>
                          <TableCell>{formatDate(checkin.createdAt)}</TableCell>
                          <TableCell>{formatDate(checkin.updatedAt)}</TableCell>
                          <TableCell>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: getCompletionStatus(checkin) }}
                              ></div>
                            </div>
                            <span className="block mt-1 text-xs">{getCompletionStatus(checkin)}</span>
                          </TableCell>
                          <TableCell>
                            {lastUpdatedRole ? (
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{lastUpdatedRole.label}</span>
                                <span className="text-xs text-gray-500">
                                  by {lastUpdatedRole.name} on {formatDate(lastUpdatedRole.date)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">No check-ins yet</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => navigate(`/checkin/details/${checkin._id}`)}
                                    >
                                      <Info size={16} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View Details</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => navigate(`/checkin/edit/${checkin._id}`)}
                                    >
                                      <Edit size={16} />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit Check-in</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700">
                                    <Trash2 size={16} />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the check-in.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-500 hover:bg-red-700"
                                      onClick={() => handleDelete(checkin._id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </motion.tr>
                      )
                    })}
                  </TableBody>
                </Table>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default CheckinList
