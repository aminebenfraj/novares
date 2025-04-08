"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { getAllProcessQualifications, deleteProcessQualification } from "../../apis/process_qualifApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Eye, Download } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"
import { format } from "date-fns"

const processQualificationFields = [
  "updating_of_capms",
  "modification_of_customer_logistics",
  "qualification_of_supplier",
  "presentation_of_initial_samples",
  "filing_of_initial_samples",
  "information_on_modification_implementation",
  "full_production_run",
  "request_for_dispensation",
  "process_qualification",
  "initial_sample_acceptance",
]

const ProcessQualificationList = () => {
  const [processQualifications, setProcessQualifications] = useState([])
  const [filteredQualifications, setFilteredQualifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "updatedAt", direction: "desc" })
  const navigate = useNavigate()

  useEffect(() => {
    fetchProcessQualifications()
  }, [])

  const filterQualifications = useCallback(() => {
    let filtered = processQualifications.filter(
      (qualification) =>
        qualification._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStatusText(qualification).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (qualification.createdAt && new Date(qualification.createdAt).toLocaleDateString().includes(searchTerm)),
    )

    if (activeTab !== "all") {
      filtered = filtered.filter((qualification) => getStatusText(qualification).toLowerCase() === activeTab)
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === "status") {
          const statusA = getStatusText(a).toLowerCase()
          const statusB = getStatusText(b).toLowerCase()

          if (statusA < statusB) {
            return sortConfig.direction === "asc" ? -1 : 1
          }
          if (statusA > statusB) {
            return sortConfig.direction === "asc" ? 1 : -1
          }
          return 0
        } else if (sortConfig.key === "completion") {
          const completionA = getCompletionPercentage(a)
          const completionB = getCompletionPercentage(b)

          return sortConfig.direction === "asc" ? completionA - completionB : completionB - completionA
        } else {
          if (!a[sortConfig.key] || !b[sortConfig.key]) return 0

          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1
          }
          return 0
        }
      })
    }

    setFilteredQualifications(filtered)
  }, [searchTerm, processQualifications, activeTab, sortConfig])

  useEffect(() => {
    filterQualifications()
  }, [filterQualifications])

  const fetchProcessQualifications = async () => {
    try {
      setIsLoading(true)
      const data = await getAllProcessQualifications()
      setProcessQualifications(data)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch process qualifications:", error)
      setError("Failed to fetch process qualifications. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this process qualification?")) {
      try {
        await deleteProcessQualification(id)
        fetchProcessQualifications()
      } catch (error) {
        console.error("Failed to delete process qualification:", error)
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/processqualification/edit/${id}`)
  }

  const handleView = (id) => {
    navigate(`/processqualification/${id}`)
  }

  const handleCreate = () => {
    navigate("/processqualification/create")
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getCompletionPercentage = (qualification) => {
    const completedTasks = processQualificationFields.filter((field) => qualification[field]?.value).length
    return Math.round((completedTasks / processQualificationFields.length) * 100)
  }

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Status",
      "Completion",
      "Created Date",
      "Updated Date",
      ...processQualificationFields.map((field) => field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())),
    ]

    const rows = filteredQualifications.map((qualification) => [
      qualification._id,
      getStatusText(qualification),
      `${getCompletionPercentage(qualification)}%`,
      new Date(qualification.createdAt).toLocaleDateString(),
      new Date(qualification.updatedAt).toLocaleDateString(),
      ...processQualificationFields.map((field) => (qualification[field]?.value ? "Completed" : "Pending")),
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `process-qualifications-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Process Qualifications</h1>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" /> Create New
            </Button>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" /> Export to CSV
            </Button>
          </div>
        </div>

        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <div className="relative col-span-3 md:col-span-2">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <Input
              type="text"
              placeholder="Search by ID, status, or date..."
              className="w-full py-2 pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-span-3 md:col-span-1">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="not started">Not Started</TabsTrigger>
                <TabsTrigger value="in progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Process Qualifications</span>
              <span className="text-sm font-normal text-gray-500">
                {filteredQualifications.length} {filteredQualifications.length === 1 ? "item" : "items"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-350px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">
                      <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort("_id")}>
                        ID {sortConfig.key === "_id" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => handleSort("status")}>
                        Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent"
                        onClick={() => handleSort("completion")}
                      >
                        Completion {sortConfig.key === "completion" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent"
                        onClick={() => handleSort("createdAt")}
                      >
                        Created {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 hover:bg-transparent"
                        onClick={() => handleSort("updatedAt")}
                      >
                        Updated {sortConfig.key === "updatedAt" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQualifications.length > 0 ? (
                    filteredQualifications.map((qualification) => (
                      <TableRow key={qualification._id}>
                        <TableCell className="font-medium">{qualification._id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(qualification)}>{getStatusText(qualification)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${getCompletionPercentage(qualification)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{getCompletionPercentage(qualification)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {qualification.createdAt && format(new Date(qualification.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {qualification.updatedAt && format(new Date(qualification.updatedAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleView(qualification._id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(qualification._id)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(qualification._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No process qualifications found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <ContactUs />
    </div>
  )
}

const getStatusVariant = (qualification) => {
  const completedTasks = processQualificationFields.filter((field) => qualification[field]?.value).length
  const totalTasks = processQualificationFields.length

  if (completedTasks === totalTasks) return "success"
  if (completedTasks > 0) return "warning"
  return "secondary"
}

const getStatusText = (qualification) => {
  const completedTasks = processQualificationFields.filter((field) => qualification[field]?.value).length
  const totalTasks = processQualificationFields.length

  if (completedTasks === totalTasks) return "Completed"
  if (completedTasks > 0) return "In Progress"
  return "Not Started"
}

export default ProcessQualificationList

