import { useState, useEffect } from "react";
import { getAllPedidos, deletePedido } from "../../apis/pedido/pedidoApi";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MoreVertical,
  FileText,
  Trash2,
  Edit3,
  Filter,
  RefreshCw,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function PedidoList() {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchPedidos = async (page) => {
    try {
      setIsLoading(true);
      const response = await getAllPedidos(page, pagination.limit);
      if (response && response.data) {
        setPedidos(response.data);
        setPagination({
          ...pagination,
          page: response.page,
          total: response.total,
          totalPages: response.totalPages,
        });
      } else {
        setError("Invalid data received from server.");
      }
    } catch (error) {
      console.error("❌ Error fetching pedidos:", error);
      setError("Failed to load pedidos. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos(pagination.page);
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleDelete = async (id) => {
    try {
      await deletePedido(id);
      await fetchPedidos(pagination.page);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("❌ Error deleting pedido:", error);
      setError("Failed to delete the pedido. Please try again.");
    }
  };

  const getStatusFromPedido = (pedido) => {
    if (pedido.recepcionado === "Si") return "completed";
    if (pedido.aceptado) return "in_progress";
    if (pedido.introducidaSAP) return "pending";
    return "cancelled";
  };

  const getStatusDetails = (status) => {
    const statusMap = {
      pending: {
        label: "Pending",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      in_progress: {
        label: "In Progress",
        icon: Package,
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      completed: {
        label: "Completed",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      cancelled: {
        label: "Cancelled",
        icon: AlertCircle,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Pedidos Management</h1>
              <p className="mt-2 text-muted-foreground">
                Track and manage your purchase orders efficiently
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Order
            </Button>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute w-4 h-4 transform -translate-y-1/2 text-muted-foreground left-3 top-1/2" />
                    <Input
                      placeholder="Search orders by any field..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                  <TabsList className="justify-start w-full px-6 border-b rounded-none">
                    <TabsTrigger value="all">All Orders</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                  <TabsContent value={currentTab} className="m-0">
                    <ScrollArea className="h-[calc(100vh-20rem)]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Referencia</TableHead>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Fabricante</TableHead>
                            <TableHead>Proveedor</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio Unidad</TableHead>
                            <TableHead>Importe</TableHead>
                            <TableHead>Fecha Solicitud</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <AnimatePresence>
                            {pedidos.map((pedido) => {
                              const status = getStatusFromPedido(pedido);
                              const statusDetails = getStatusDetails(status);
                              const StatusIcon = statusDetails.icon;
                              return (
                                <motion.tr
                                  key={pedido._id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="group"
                                >
                                  <TableCell>{pedido.tipo}</TableCell>
                                  <TableCell className="font-medium">
                                    {pedido.referencia}
                                  </TableCell>
                                  <TableCell>{pedido.solicitante}</TableCell>
                                  <TableCell>{pedido.fabricante}</TableCell>
                                  <TableCell>{pedido.proveedor}</TableCell>
                                  <TableCell>{pedido.cantidad}</TableCell>
                                  <TableCell>{formatCurrency(pedido.precioUnidad)}</TableCell>
                                  <TableCell>{formatCurrency(pedido.importePedido)}</TableCell>
                                  <TableCell>{formatDate(pedido.fechaSolicitud)}</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary" className={statusDetails.className}>
                                      <StatusIcon className="w-3 h-3 mr-1" />
                                      {statusDetails.label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100"
                                        >
                                          <MoreVertical className="w-4 h-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedPedido(pedido);
                                            setIsDialogOpen(true);
                                          }}
                                        >
                                          <FileText className="w-4 h-4 mr-2" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Edit3 className="w-4 h-4 mr-2" />
                                          Edit Order
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onClick={() => {
                                            setSelectedPedido(pedido);
                                            setIsDeleteDialogOpen(true);
                                          }}
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Delete Order
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </motion.tr>
                              );
                            })}
                          </AnimatePresence>
                        </TableBody>
                      </Table>
                    </ScrollArea>
                    <div className="flex items-center justify-between px-6 py-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                        {pagination.total} entries
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page >= pagination.totalPages}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about order {selectedPedido?.referencia}
            </DialogDescription>
          </DialogHeader>
          {selectedPedido && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Type</label>
                      <p>{selectedPedido.tipo || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Reference</label>
                      <p>{selectedPedido.referencia}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Requester</label>
                      <p>{selectedPedido.solicitante}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Year</label>
                      <p>{selectedPedido.ano}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Product Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Manufacturer</label>
                      <p>{selectedPedido.fabricante}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Provider</label>
                      <p>{selectedPedido.proveedor}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Internal Description</label>
                      <p>{selectedPedido.descripcionInterna}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Provider Description</label>
                      <p>{selectedPedido.descripcionProveedor}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Order Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Quantity</label>
                      <p>{selectedPedido.cantidad}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Unit Price</label>
                      <p>{formatCurrency(selectedPedido.precioUnidad)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Total Amount</label>
                      <p>{formatCurrency(selectedPedido.importePedido)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Request Date</label>
                      <p>{formatDate(selectedPedido.fechaSolicitud)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Status Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Order</label>
                      <p>{selectedPedido.pedir}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">SAP Entry Date</label>
                      <p>{formatDate(selectedPedido.introducidaSAP)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Acceptance Date</label>
                      <p>{formatDate(selectedPedido.aceptado)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Expected Reception</label>
                      <p>{formatDate(selectedPedido.recepcionPrevista)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Received</label>
                      <p>{selectedPedido.recepcionado}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Address</label>
                      <p>{selectedPedido.direccion}</p>
                    </div>
                  </div>
                </div>

                {selectedPedido.comentario && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Additional Information</h4>
                    <div>
                      <label className="text-sm text-muted-foreground">Comments</label>
                      <p>{selectedPedido.comentario}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button>Edit Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedPedido && handleDelete(selectedPedido._id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PedidoList;