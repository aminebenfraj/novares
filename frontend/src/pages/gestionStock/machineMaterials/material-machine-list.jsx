
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getAllAllocations } from "@/apis/gestionStockApi/materialMachineApi"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Eye, Search, Plus } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import MainLayout from "@/components/MainLayout"

const MaterialMachineList = () => {
  const { toast } = useToast()
  const [allocations, setAllocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAllocations, setFilteredAllocations] = useState([])

  useEffect(() => {
    fetchAllocations()
  }, [])

  useEffect(() => {
    if (allocations.length > 0) {
      filterAllocations()
    }
  }, [searchTerm, allocations])

  const fetchAllocations = async () => {
    try {
      setLoading(true)
      const data = await getAllAllocations()
      setAllocations(data)
      setFilteredAllocations(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch allocations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterAllocations = () => {
    const filtered = allocations.filter((allocation) => {
      const materialName = allocation.material?.reference || ""
      const materialDesc = allocation.material?.description || ""
      const machineName = allocation.machine?.name || ""

      return (
        materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        materialDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machineName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

    setFilteredAllocations(filtered)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <MainLayout>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-8 mx-auto"
    >
      <Toaster />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Material-Machine Allocations</CardTitle>
            <CardDescription>View and manage material stock allocations to machines</CardDescription>
          </div>
          <Button asChild>
            <Link to="/machinematerial/create">
              <Plus className="w-4 h-4 mr-2" />
              New Allocation
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by material or machine..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 rounded-full animate-spin border-primary border-t-transparent"></div>
            </div>
          ) : filteredAllocations.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No allocations found</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead className="text-right">Allocated Stock</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAllocations.map((allocation) => (
                    <TableRow key={allocation._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{allocation.material?.reference}</div>
                        <div className="text-sm text-muted-foreground">{allocation.material?.description}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{allocation.machine?.name}</div>
                        <Badge variant={allocation.machine?.status === "active" ? "outline" : "secondary"}>
                          {allocation.machine?.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-right">{allocation.allocatedStock}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {new Date(allocation.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/machinematerial/detail/${allocation._id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/machinematerial/edit/${allocation._id}`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
        </MainLayout>

  )
}

export default MaterialMachineList

