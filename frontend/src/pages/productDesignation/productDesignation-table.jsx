import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema } from "../../lib/PdValidation"
import { createPD, getAllpd, updatePD, deletePD } from "../../apis/ProductDesignation-api"
import { Loader2, Trash2, Edit, Plus } from "lucide-react"
import { Navbar } from "../../components/Navbar"
import ContactUs from "../../components/ContactUs"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProductCRUD() {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: "",
      part_name: "",
      reference: "",
    },
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await getAllpd()
      setProducts(response || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setErrorMessage("Failed to load products. Please try again.")
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      if (editingProduct) {
        await updatePD(editingProduct.id, data)
      } else {
        await createPD(data)
      }
      form.reset()
      setEditingProduct(null)
      fetchProducts()
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    form.reset(product)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deletePD(id)
        fetchProducts()
      } catch (error) {
        console.error("Error deleting product:", error)
        setErrorMessage("Failed to delete product. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold">Product Designations</h2>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {["id", "part_name", "reference"].map((field) => (
                    <FormField
                      key={field}
                      control={form.control}
                      name={field}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {field === "id"
                              ? "Product ID"
                              : field === "part_name"
                                ? "Part Name"
                                : "Reference (Optional)"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (editingProduct) {
                        form.reset(editingProduct)
                      } else {
                        form.reset({ id: "", part_name: "", reference: "" })
                      }
                    }}
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingProduct ? "Updating" : "Submitting"}
                      </>
                    ) : editingProduct ? (
                      "Update"
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {["ID", "Part Name", "Reference", "Actions"].map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.part_name}</TableCell>
                      <TableCell>{product.reference}</TableCell>
                      <TableCell>
                        <Button variant="ghost" onClick={() => handleEdit(product)} className="mr-2">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="ghost" onClick={() => handleDelete(product.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No products available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>
      <ContactUs />
    </div>
  )
}

