"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  getAllQualificationConfirmations,
  deleteQualificationConfirmation,
} from "../../apis/qualificationconfirmationapi"
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

const qualificationConfirmationFields = [
  "using_up_old_stock",
  "using_up_safety_stocks",
  "updating_version_number_mould",
  "updating_version_number_product_label",
  "management_of_manufacturing_programmes",
  "specific_spotting_of_packaging_with_label",
  "management_of_galia_identification_labels",
  "preservation_measure",
  "product_traceability_label_modification",
  "information_to_production",
  "information_to_customer_logistics",
  "information_to_customer_quality",
  "updating_customer_programme_data_sheet",
]

const QualificationConfirmationList = () => {
  const [qualificationConfirmations, setQualificationConfirmations] = useState([])
  const [filteredConfirmations, setFilteredConfirmations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "updatedAt", direction: "desc" })
  const navigate = useNavigate()

  useEffect(() => {
    fetchQualificationConfirmations()
  }, [])

  const filterConfirmations = useCallback(() => {
    let filtered = qualificationConfirmations.filter(
      (confirmation) =>
        confirmation._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStatusText(confirmation).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (confirmation.createdAt && new Date(confirmation.createdAt).toLocaleDateString().includes(searchTerm)),
    )

    if (activeTab !== "all") {
      filtered = filtered.filter((confirmation) => getStatusText(confirmation).toLowerCase() === activeTab)
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

    setFilteredConfirmations(filtered)
  }, [searchTerm, qualificationConfirmations, activeTab, sortConfig])

  useEffect(() => {
    filterConfirmations()
  }, [filterConfirmations])

  const fetchQualificationConfirmations = async () => {
    try {
      setIsLoading(true)
      const data = await getAllQualificationConfirmations()
      setQualificationConfirmations(data)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch qualification confirmations:", error)
      setError("Failed to fetch qualification confirmations. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this qualification confirmation?")) {
      try {
        await deleteQualificationConfirmation(id)
        fetchQualificationConfirmations()
      } catch (error) {
        console.error("Failed to delete qualification confirmation:", error)
      }
    }
  }

  const handleEdit = (id) => {
    navigate(`/qualification-confirmation/edit/${id}`)
  }

  const handleView = (id) => {
    navigate(`/qualification-confirmation/${id}`)
  }

  const handleCreate = () => {
    navigate("/qualification-confirmation/create")
  }

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const getCompletionPercentage = (confirmation) => {
    const completedTasks = qualificationConfirmationFields.filter((field) => confirmation[field]?.value).length
    return Math.round((completedTasks / qualificationConfirmationFields.length) * 100)
  }

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Status",
      "Completion",
      "Created Date",
      "Updated Date",
      ...qualificationConfirmationFields.map((field) =>
        field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      ),
    ]

    const rows = filteredConfirmations.map((confirmation) => [
      confirmation._id,
      getStatusText(confirmation),
      `${getCompletionPercentage(confirmation)}%`,
      new Date(confirmation.createdAt).toLocaleDateString(),
      new Date(confirmation.updatedAt).toLocaleDateString(),
      ...qualificationConfirmationFields.map((field) => (confirmation[field]?.value ? "Completed" : "Pending")),
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `qualification-confirmations-${new Date().toLocaleString
().slice(0, 10)}.csv`)
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
          <h1 className="text-3xl font-bold text-gray-800">Qualification Confirmations</h1>
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
              <span>Qualification Confirmations</span>
              <span className="text-sm font-normal text-gray-500">
                {filteredConfirmations.length} {filteredConfirmations.length === 1 ? "item" : "items"}
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
                  {filteredConfirmations.length > 0 ? (
                    filteredConfirmations.map((confirmation) => (
                      <TableRow key={confirmation._id}>
                        <TableCell className="font-medium">{confirmation._id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(confirmation)}>{getStatusText(confirmation)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${getCompletionPercentage(confirmation)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{getCompletionPercentage(confirmation)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {confirmation.createdAt && format(new Date(confirmation.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {confirmation.updatedAt && format(new Date(confirmation.updatedAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleView(confirmation._id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(confirmation._id)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(confirmation._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No qualification confirmations found.
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

const getStatusVariant = (confirmation) => {
  const completedTasks = qualificationConfirmationFields.filter((field) => confirmation[field]?.value).length
  const totalTasks = qualificationConfirmationFields.length

  if (completedTasks === totalTasks) return "success"
  if (completedTasks > 0) return "warning"
  return "secondary"
}

const getStatusText = (confirmation) => {
  const completedTasks = qualificationConfirmationFields.filter((field) => confirmation[field]?.value).length
  const totalTasks = qualificationConfirmationFields.length

  if (completedTasks === totalTasks) return "Completed"
  if (completedTasks > 0) return "In Progress"
  return "Not Started"
}

export default QualificationConfirmationList

