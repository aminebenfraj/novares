

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPedidoById, updatePedido } from "../../apis/pedido/pedidoApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Save, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

function EditPedido() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pedido, setPedido] = useState({
    tipo: "",
    descripcionInterna: "",
    fabricante: "",
    referencia: "",
    descripcionProveedor: "",
    solicitante: "",
    cantidad: 0,
    precioUnidad: 0,
    importePedido: 0,
    fechaSolicitud: new Date(),
    proveedor: "",
    comentario: "",
    pedir: "",
    introducidaSAP: null,
    aceptado: null,
    direccion: "",
    recepcionado: "",
    ano: new Date().getFullYear(),
  })

  useEffect(() => {
    fetchPedido()
  }, [id])

  const fetchPedido = async () => {
    try {
      setIsLoading(true)
      const data = await getPedidoById(id)

      // Convert date strings to Date objects
      const formattedData = {
        ...data,
        fechaSolicitud: data.fechaSolicitud ? new Date(data.fechaSolicitud) : null,
        introducidaSAP: data.introducidaSAP ? new Date(data.introducidaSAP) : null,
        aceptado: data.aceptado ? new Date(data.aceptado) : null,
      }

      setPedido(formattedData)
    } catch (error) {
      console.error("Error fetching pedido:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load pedido data. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Handle numeric fields
    if (["cantidad", "precioUnidad", "importePedido", "ano"].includes(name)) {
      const numValue = name === "ano" ? Number.parseInt(value) : Number.parseFloat(value)
      setPedido((prev) => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }))
    } else {
      setPedido((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name, value) => {
    setPedido((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name, date) => {
    setPedido((prev) => ({ ...prev, [name]: date }))
  }

  const calculateImporte = () => {
    const importe = pedido.cantidad * pedido.precioUnidad
    setPedido((prev) => ({ ...prev, importePedido: importe }))
  }

  useEffect(() => {
    calculateImporte()
  }, [pedido.cantidad, pedido.precioUnidad])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updatePedido(id, pedido)
      toast({
        title: "Success",
        description: "Pedido updated successfully",
      })
      navigate("/pedido")
    } catch (error) {
      console.error("Error saving pedido:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update pedido. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="flex items-center mb-6 space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/pedido")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Order</h1>
          <p className="text-muted-foreground">Editing order reference: {pedido.referencia}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="product">Product Details</TabsTrigger>
            <TabsTrigger value="order">Order Details</TabsTrigger>
            <TabsTrigger value="status">Status Information</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-6 pb-10">
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the basic details of the order</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="tipo">Type</Label>
                        <Input id="tipo" name="tipo" value={pedido.tipo} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referencia">Reference</Label>
                        <Input
                          id="referencia"
                          name="referencia"
                          value={pedido.referencia}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="solicitante">Requester</Label>
                        <Input
                          id="solicitante"
                          name="solicitante"
                          value={pedido.solicitante}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ano">Year</Label>
                        <Input
                          id="ano"
                          name="ano"
                          type="number"
                          value={pedido.ano}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="product" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Enter the details about the product being ordered</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fabricante">Manufacturer</Label>
                        <Input
                          id="fabricante"
                          name="fabricante"
                          value={pedido.fabricante}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proveedor">Provider</Label>
                        <Input id="proveedor" name="proveedor" value={pedido.proveedor} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcionInterna">Internal Description</Label>
                      <Textarea
                        id="descripcionInterna"
                        name="descripcionInterna"
                        value={pedido.descripcionInterna}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcionProveedor">Provider Description</Label>
                      <Textarea
                        id="descripcionProveedor"
                        name="descripcionProveedor"
                        value={pedido.descripcionProveedor}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="order" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                    <CardDescription>Enter the quantity, price, and other order details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="cantidad">Quantity</Label>
                        <Input
                          id="cantidad"
                          name="cantidad"
                          type="number"
                          value={pedido.cantidad}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="precioUnidad">Unit Price (€)</Label>
                        <Input
                          id="precioUnidad"
                          name="precioUnidad"
                          type="number"
                          step="0.01"
                          value={pedido.precioUnidad}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="importePedido">Total Amount (€)</Label>
                        <Input
                          id="importePedido"
                          name="importePedido"
                          type="number"
                          step="0.01"
                          value={pedido.importePedido}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fechaSolicitud">Request Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {pedido.fechaSolicitud ? format(pedido.fechaSolicitud, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={pedido.fechaSolicitud}
                            onSelect={(date) => handleDateChange("fechaSolicitud", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comentario">Comments</Label>
                      <Textarea
                        id="comentario"
                        name="comentario"
                        value={pedido.comentario}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="status" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status Information</CardTitle>
                    <CardDescription>Enter the status details of the order</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="pedir">Order</Label>
                        <Select value={pedido.pedir} onValueChange={(value) => handleSelectChange("pedir", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select order status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="si">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="direccion">Address</Label>
                        <Input id="direccion" name="direccion" value={pedido.direccion} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="introducidaSAP">SAP Entry Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {pedido.introducidaSAP ? format(pedido.introducidaSAP, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={pedido.introducidaSAP}
                              onSelect={(date) => handleDateChange("introducidaSAP", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aceptado">Acceptance Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {pedido.aceptado ? format(pedido.aceptado, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={pedido.aceptado}
                              onSelect={(date) => handleDateChange("aceptado", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recepcionado">Received</Label>
                      <Select
                        value={pedido.recepcionado}
                        onValueChange={(value) => handleSelectChange("recepcionado", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select reception status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Si">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" type="button" onClick={() => navigate("/pedido")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditPedido

