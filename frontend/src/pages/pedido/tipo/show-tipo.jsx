"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getTipoById } from "../../../apis/pedido/tipoApi.jsx"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, Loader2, Package } from "lucide-react"
import MainLayout from "@/components/MainLayout"

function ShowTipo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [tipo, setTipo] = useState(null)

  useEffect(() => {
    const fetchTipo = async () => {
      try {
        const data = await getTipoById(id)
        setTipo(data)
      } catch (error) {
        console.error("Error fetching type:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load type data",
        })
        navigate("/tipo")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTipo()
  }, [id, navigate, toast])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="container py-8 mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/tipo")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Type Details</h1>
              <p className="text-muted-foreground">View information about this order type</p>
            </div>
          </div>
          <Button onClick={() => navigate(`/tipo/edit/${id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Type Information</CardTitle>
            <CardDescription>Detailed information about this order type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Type Name</h3>
                <p className="text-2xl font-medium">{tipo.name}</p>
              </div>
            </div>

            <div className="p-4 border rounded-md bg-muted/20">
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Usage Statistics</h3>
              <p className="text-muted-foreground">No usage statistics available for this type.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate("/tipo")}>
              Back to List
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default ShowTipo

