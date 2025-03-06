
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getMaterialById } from "@/apis/gestionStockApi/materialApi"
import { getAllAllocations , allocateStock } from "@/apis/gestionStockApi/materialMachineApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Save, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
const MaterialMachineEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [allocation, setAllocation] = useState(null)
  const [material, setMaterial] = useState(null)
  const [machine, setMachine] = useState(null)
  const [allocatedStock, setAllocatedStock] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [originalStock, setOriginalStock] = useState(0)

  useEffect(() => {
    fetchAllocationDetails()
  }, [id])

  // Update the fetchAllocationDetails function to ensure we get the latest history
  const fetchAllocationDetails = async () => {
    try {
      setLoading(true)
      // Since there's no direct endpoint to get a single allocation by ID,
      // we'll get all allocations and find the one we need
      const allAllocations = await getAllAllocations()
      const currentAllocation = allAllocations.find((a) => a._id === id)

      if (!currentAllocation) {
        toast({
          title: "Error",
          description: "Allocation not found",
          variant: "destructive",
        })
        navigate("/material-machine")
        return
      }

      setAllocation(currentAllocation)
      setMaterial(currentAllocation.material)
      setMachine(currentAllocation.machine)
      setAllocatedStock(currentAllocation.allocatedStock)
      setOriginalStock(currentAllocation.allocatedStock)

      // Fetch material details to get current stock
      if (currentAllocation.material?._id) {
        const materialDetails = await getMaterialById(currentAllocation.material._id)
        setMaterial(materialDetails)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch allocation details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update the handleSubmit function to include a comment and refresh data after saving
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (allocatedStock < 0) {
      toast({
        title: "Error",
        description: "Allocated stock cannot be negative",
        variant: "destructive",
      })
      return
    }

    // Calculate the difference between new and original allocation
    const stockDifference = allocatedStock - originalStock

    // Check if there's enough stock available if we're increasing the allocation
    if (stockDifference > 0 && material && material.currentStock < stockDifference) {
      toast({
        title: "Error",
        description: `Not enough stock available. Only ${material.currentStock} units available.`,
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      // Get current user ID from localStorage
      const userId = localStorage.getItem("userId")

      // Use the allocate endpoint with a single allocation
      await allocateStock({
        materialId: material._id,
        allocations: [
          {
            machineId: machine._id,
            allocatedStock: allocatedStock,
          },
        ],
        userId: userId || "unknown",
      })

      toast({
        title: "Success",
        description: "Allocation updated successfully",
      })

      // Refresh allocation details to get updated history
      await fetchAllocationDetails()

      // Update the original stock value
      setOriginalStock(allocatedStock)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update allocation",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 rounded-full animate-spin border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-8 mx-auto"
    >
      <Toaster />
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/machinematerial")}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to List
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Material Allocation</CardTitle>
          <CardDescription>Update the stock allocation for this machine</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium">Material Information</h3>
                  <div className="p-4 border rounded-md bg-muted">
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">Reference</Label>
                        <p className="font-medium">{material?.reference}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Description</Label>
                        <p className="font-medium">{material?.description}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Current Stock</Label>
                        <p className="font-medium">{material?.currentStock}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Manufacturer</Label>
                        <p className="font-medium">{material?.manufacturer}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Machine Information</h3>
                  <div className="p-4 border rounded-md bg-muted">
                    <div className="grid gap-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">Name</Label>
                        <p className="font-medium">{machine?.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Description</Label>
                        <p className="font-medium">{machine?.description}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Status</Label>
                        <p className="font-medium capitalize">{machine?.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="allocatedStock">Allocated Stock</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="allocatedStock"
                    type="number"
                    min="0"
                    value={allocatedStock}
                    onChange={(e) => setAllocatedStock(Number.parseInt(e.target.value) || 0)}
                    className="max-w-[200px]"
                  />
                  <div className="text-sm text-muted-foreground">
                    Original allocation: <span className="font-medium">{originalStock}</span>
                  </div>
                </div>
                {allocatedStock !== originalStock && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm"
                  >
                    {allocatedStock > originalStock ? (
                      <p className="text-amber-600">Adding {allocatedStock - originalStock} units to this machine</p>
                    ) : (
                      <p className="text-blue-600">Removing {originalStock - allocatedStock} units from this machine</p>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Allocation History</h3>
                <div className="overflow-hidden border rounded-md">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-xs font-medium text-left text-muted-foreground">Date</th>
                        <th className="px-4 py-2 text-xs font-medium text-left text-muted-foreground">Previous</th>
                        <th className="px-4 py-2 text-xs font-medium text-left text-muted-foreground">New</th>
                        <th className="px-4 py-2 text-xs font-medium text-left text-muted-foreground">Comment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {allocation?.history?.length > 0 ? (
                        allocation.history.map((entry, index) => (
                          <tr key={index} className="hover:bg-muted/50">
                            <td className="px-4 py-2 text-sm">{new Date(entry.date).toLocaleDateString()}</td>
                            <td className="px-4 py-2 text-sm">{entry.previousStock}</td>
                            <td className="px-4 py-2 text-sm">{entry.newStock}</td>
                            <td className="px-4 py-2 text-sm">{entry.comment}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-2 text-sm text-center text-muted-foreground">
                            No history available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 border-2 border-current rounded-full animate-spin border-t-transparent"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Allocation
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default MaterialMachineEdit

