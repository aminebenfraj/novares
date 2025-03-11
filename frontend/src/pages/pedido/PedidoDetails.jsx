"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPedidoById } from "../../apis/pedido/pedidoApi" 
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { ArrowLeft, Edit, Trash2, Clock, Package, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import MainLayout from "../../components/MainLayout"

export default function PedidoDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const [pedido, setPedido] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchPedido(id)
    }
  }, [id])

  const fetchPedido = async (pedidoId) => {
    try {
      setIsLoading(true)
      const data = await getPedidoById(pedidoId)
      setPedido(data)
    } catch (error) {
      console.error("Error fetching pedido:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load pedido details. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/pedido/edit/${id}`)
  }

  const handleDelete = () => {
    // Implement delete functionality
    toast({
      title: "Not Implemented",
      description: "Delete functionality is not yet implemented.",
    })
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount) => {
    if (!amount) return "N/A"
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const getStatusDetails = (pedido) => {
    if (pedido?.recepcionado === "Si")
      return { label: "Completed", icon: CheckCircle, className: "bg-green-100 text-green-800" }
    if (pedido?.aceptado) return { label: "In Progress", icon: Package, className: "bg-blue-100 text-blue-800" }
    if (pedido?.introducidaSAP) return { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-800" }
    return { label: "Cancelled", icon: AlertCircle, className: "bg-red-100 text-red-800" }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-32 h-32 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    )
  }

  if (!pedido) {
    return (
      <MainLayout>
        <div className="container px-4 py-8 mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Pedido not found</h1>
          <Button onClick={() => navigate("/pedido")}>Back to Pedidos</Button>
        </div>
      </MainLayout>
    )
  }

  const statusDetails = getStatusDetails(pedido)
  const StatusIcon = statusDetails.icon

  return (
    <MainLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/pedido")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold">Pedido Details</h1>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Key details about the order</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-500">Reference</dt>
                  <dd>{pedido.referencia}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Type</dt>
                  <dd>{pedido.tipo}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Requester</dt>
                  <dd>{pedido.solicitante}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Year</dt>
                  <dd>{pedido.ano}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-medium text-gray-500">Status</dt>
                  <dd>
                    <Badge variant="secondary" className={statusDetails.className}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusDetails.label}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Information about the product</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-500">Manufacturer</dt>
                  <dd>{pedido.fabricante}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Provider</dt>
                  <dd>{pedido.proveedor}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-medium text-gray-500">Internal Description</dt>
                  <dd>{pedido.descripcionInterna || "N/A"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-medium text-gray-500">Provider Description</dt>
                  <dd>{pedido.descripcionProveedor || "N/A"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Specifics of the order</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-500">Quantity</dt>
                  <dd>{pedido.cantidad}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Unit Price</dt>
                  <dd>{formatCurrency(pedido.precioUnidad)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Total Amount</dt>
                  <dd>{formatCurrency(pedido.importePedido)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Request Date</dt>
                  <dd>{formatDate(pedido.fechaSolicitud)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Order</dt>
                  <dd>{pedido.pedir}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Address</dt>
                  <dd>{pedido.direccion || "N/A"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Information</CardTitle>
              <CardDescription>Current status and important dates</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-500">SAP Entry Date</dt>
                  <dd>{formatDate(pedido.introducidaSAP)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Acceptance Date</dt>
                  <dd>{formatDate(pedido.aceptado)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Received</dt>
                  <dd>{pedido.recepcionado}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {pedido.comentario && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="mb-2 font-medium text-gray-500">Comments</h3>
              <p>{pedido.comentario}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

