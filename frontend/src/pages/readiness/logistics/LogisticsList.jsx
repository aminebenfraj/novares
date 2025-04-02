
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, Plus, Search, CheckCircle, XCircle, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getAllLogistics } from "../../../apis/readiness/logisticsApi"

// Define the field labels for better UI
const fieldConfig = {
  loopsFlowsDefined: "Loops & Flows Defined",
  storageDefined: "Storage Defined",
  labelsCreated: "Labels Created",
  sapReferenced: "SAP Referenced",
  safetyStockReady: "Safety Stock Ready",
}

function LogisticsListPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [logisticsItems, setLogisticsItems] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch all logistics items
  useEffect(() => {
    const fetchLogistics = async () => {
      try {
        setIsLoading(true)
        const data = await getAllLogistics()
        setLogisticsItems(data)
      } catch (error) {
        console.error("Error fetching logistics:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load logistics data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogistics()
  }, [toast])

  // Calculate completion percentage for a logistics item
  const calculateCompletion = (item) => {
    if (!item) return 0

    const fields = Object.keys(fieldConfig)
    const completedFields = fields.filter((field) => item[field]?.value === true)
    return Math.round((completedFields.length / fields.length) * 100)
  }

  // Filter logistics items based on search term
  const filteredLogistics = logisticsItems.filter((item) => {
    if (!searchTerm) return true

    // Search in validation details
    const searchInDetails = (field) => {
      const details = item[field]?.details
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
            <h1 className="text-3xl font-bold tracking-tight">Logistics</h1>
            <p className="text-muted-foreground">Manage logistics readiness and validation records</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search logistics..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => navigate("/logistics/new")}>
              <Plus className="w-4 h-4 mr-2" />
              New Logistics
            </Button>
          </div>
        </div>

        {filteredLogistics.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Logistics Found</CardTitle>
              <CardDescription>
                {searchTerm ? "No logistics matches your search criteria" : "No logistics records available"}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/logistics/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Logistics
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLogistics.map((item, index) => {
              const completionPercentage = calculateCompletion(item)

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="flex flex-col h-full transition-shadow cursor-pointer hover:shadow-md"
                    onClick={() => navigate(`/logistics/edit/${item._id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            <Truck className="w-5 h-5 mr-2 text-primary" />
                            Logistics
                          </CardTitle>
                          <CardDescription>Created: {new Date(item.createdAt).toLocaleDateString()}</CardDescription>
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
                            {item[field]?.value ? (
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
                          navigate(`/logistics/edit/${item._id}`)
                        }}
                      >
                        Edit Logistics
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

export default LogisticsListPage

