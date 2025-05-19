"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, Plus, Search, CheckCircle, XCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getAllDocumentation } from "../../../apis/readiness/documentationApi"

// Define the field labels for better UI
const fieldConfig = {
  workStandardsInPlace: "Work Standards",
  polyvalenceMatrixUpdated: "Polyvalence Matrix",
  gaugesAvailable: "Gauges",
  qualityFileApproved: "Quality File",
  drpUpdated: "DRP",
  checkCSR: "Check CSR",
  dRP: "DRP",
}

function DocumentationListPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [documentations, setDocumentations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch all documentations
  useEffect(() => {
    const fetchDocumentations = async () => {
      try {
        setIsLoading(true)
        const data = await getAllDocumentation()
        setDocumentations(data)
      } catch (error) {
        console.error("Error fetching documentations:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load documentation data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocumentations()
  }, [toast])

  // Calculate completion percentage for a documentation
  const calculateCompletion = (doc) => {
    if (!doc) return 0

    const fields = Object.keys(fieldConfig)
    const completedFields = fields.filter((field) => doc[field]?.value === true)
    return Math.round((completedFields.length / fields.length) * 100)
  }

  // Filter documentations based on search term
  const filteredDocumentations = documentations.filter((doc) => {
    if (!searchTerm) return true

    // Search in validation details
    const searchInDetails = (field) => {
      const details = doc[field]?.details
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
            <p className="text-muted-foreground">Manage documentation and validation records</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documentation..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate("/documentation")}>
              <Plus className="w-4 h-4 mr-2" />
              New Documentation
            </Button>
          </div>
        </div>

        {filteredDocumentations.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Documentation Found</CardTitle>
              <CardDescription>
                {searchTerm ? "No documentation matches your search criteria" : "No documentation records available"}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/documentation")}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Documentation
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocumentations.map((doc, index) => {
              const completionPercentage = calculateCompletion(doc)

              return (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="flex flex-col h-full transition-shadow cursor-pointer hover:shadow-md"
                    onClick={() => navigate(`/documentation/edit/${doc._id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-primary" />
                            Documentation
                          </CardTitle>
                          <CardDescription>Created: {new Date(doc.createdAt).toLocaleDateString()}</CardDescription>
                        </div>
                        <Badge variant={completionPercentage === 100 ? "default" : "outline"}>
                          {completionPercentage}% Complete
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2">
                        {Object.entries(fieldConfig).map(([field, label]) => (
                          <div key={field} className="flex items-center justify-between">
                            <span className="text-sm">{label}</span>
                            {doc[field]?.value ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
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
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/documentation/edit/${doc._id}`)
                        }}
                      >
                        Edit Documentation
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default DocumentationListPage

