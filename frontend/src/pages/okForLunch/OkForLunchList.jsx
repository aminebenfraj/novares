"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getOkForLunch, deleteOkForLunch } from "../../apis/okForLunch"
import MainLayout from "@/components/MainLayout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, FileText, Trash2, Plus, Edit } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
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

function OkForLunchList() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      setLoading(true)
      const response = await getOkForLunch()
      setEntries(response.data || response)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch OK for Lunch data",
        variant: "destructive",
      })
      console.error("Error fetching OK for Lunch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteOkForLunch(id)
      toast({
        title: "Success",
        description: "OK for Lunch deleted successfully",
      })
      setEntries(entries.filter((entry) => entry._id !== id))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete OK for Lunch",
        variant: "destructive",
      })
      console.error("Error deleting OK for Lunch:", error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCompletionStatus = (checkin) => {
    if (!checkin) return "0%"

    const fields = [
      "project_manager",
      "business_manager",
      "engineering_leader_manager",
      "quality_leader",
      "plant_quality_leader",
      "industrial_engineering",
      "launch_manager_method",
      "maintenance",
      "purchasing",
      "logistics",
      "sales",
      "economic_financial_leader",
    ]

    const completedFields = fields.filter((field) => checkin[field]?.value === true).length
    const percentage = Math.round((completedFields / fields.length) * 100)

    return `${percentage}%`
  }

  return (
    <MainLayout>
      <motion.div initial="hidden" animate="show" variants={container} className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">OK for Lunch</h1>
          <Button onClick={() => navigate("/okforlunch/create")} className="flex items-center gap-2">
            <Plus size={16} />
            New OK for Lunch
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>OK for Lunch List</CardTitle>
            <CardDescription>Manage approvals for lunch and their associated check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-12 h-12 border-b-2 border-gray-900 rounded-full animate-spin"></div>
              </div>
            ) : entries.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No OK for Lunch entries found. Create your first one!
              </div>
            ) : (
              <motion.div variants={container} initial="hidden" animate="show">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check-in ID</TableHead>
                      <TableHead>Check-in Completion</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => (
                      <motion.tr key={entry._id} variants={item} className="border-b hover:bg-gray-50">
                        <TableCell>{entry.date ? formatDate(entry.date) : "N/A"}</TableCell>
                        <TableCell>
                          {entry.check ? (
                            <Badge variant="success" className="text-green-800 bg-green-100 hover:bg-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" /> Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-800 bg-gray-100 hover:bg-gray-200">
                              <XCircle className="w-3 h-3 mr-1" /> Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {entry.checkin ? (
                            <Link
                              to={`/checkin/details/${entry.checkin._id || entry.checkin}`}
                              className="text-blue-500 underline hover:text-blue-700"
                            >
                              {(entry.checkin._id || entry.checkin).substring(0, 8)}...
                            </Link>
                          ) : (
                            "Not linked"
                          )}
                        </TableCell>
                        <TableCell>
                          {entry.checkin ? (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: getCompletionStatus(entry.checkin) }}
                              ></div>
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          {entry.upload ? (
                            <a
                              href={`http://192.168.1.187:5000/${entry.upload}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-500 hover:text-blue-700"
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              View
                            </a>
                          ) : (
                            <span className="text-gray-400">No file</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/okforlunch/edit/${entry._id}`)}
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                  <Trash2 size={14} className="mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the OK for Lunch entry.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-500 hover:bg-red-700"
                                    onClick={() => handleDelete(entry._id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
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

export default OkForLunchList
