"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getSolicitanteById } from "../../../apis/pedido/solicitanteApi.jsx"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, Loader2, Mail, Phone } from "lucide-react"
import MainLayout from "@/components/MainLayout"

function ShowSolicitante() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [solicitante, setSolicitante] = useState(null)

  useEffect(() => {
    const fetchSolicitante = async () => {
      try {
        const data = await getSolicitanteById(id)
        setSolicitante(data)
      } catch (error) {
        console.error("Error fetching requester:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load requester data",
        })
        navigate("/solicitante")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSolicitante()
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
            <Button variant="outline" size="icon" onClick={() => navigate("/solicitante")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Requester Details</h1>
              <p className="text-muted-foreground">View information about this requester</p>
            </div>
          </div>
          <Button onClick={() => navigate(`/solicitante/edit/${id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Requester Information</CardTitle>
            <CardDescription>Detailed information about this requester</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1 text-2xl font-medium">{solicitante.name}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${solicitante.email}`} className="text-lg font-medium text-primary hover:underline">
                    {solicitante.email}
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${solicitante.number}`} className="text-lg font-medium">
                    {solicitante.number}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-md bg-muted/20">
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Recent Activity</h3>
              <p className="text-muted-foreground">No recent activity found for this requester.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate("/solicitante")}>
              Back to List
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default ShowSolicitante

