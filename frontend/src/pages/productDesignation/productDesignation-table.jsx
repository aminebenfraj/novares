"use client"

import { useState, useEffect } from "react"
import { getAllpd, deletePD } from "../../apis/ProductDesignation-api"
import { Trash2, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/NavBar"
import ContactUs from "@/components/ContactUs"
import { Link } from "react-router-dom"

export default function ProductDesignationTable() {
  const [products, setProducts] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await getAllpd()
      setProducts(response || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setErrorMessage("Failed to load products. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
    <div>
      <Navbar />
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Product Designations</h2>
          <Link to="/pd/create">
            <Button>Add New Product</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
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
                        <TableCell>{product.reference || "-"}</TableCell>
                        <TableCell>
                          <Link to={`/pd/edit/${product.id}`}>
                            <Button variant="ghost" className="mr-2">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
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
            )}
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
