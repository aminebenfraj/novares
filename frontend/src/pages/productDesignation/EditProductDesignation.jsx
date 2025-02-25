"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { productSchema } from "@/lib/PdValidation"
import { getPDById, updatePD } from "@/apis/ProductDesignation-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, ArrowLeft } from "lucide-react"

export default function EditProductDesignation({ onSuccess }) {
  const { id: productId } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
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
    if (!productId) {
      setErrorMessage("Invalid Product ID.")
      setIsLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        const product = await getPDById(productId)
        if (!product) {
          setErrorMessage("Product not found.")
          return
        }
        form.reset(product)
      } catch (error) {
        console.error("Error fetching product:", error)
        setErrorMessage("Failed to load product. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId, form])

  const onSubmit = async (data) => {
    setErrorMessage("")

    try {
      await updatePD(productId, data)
      if (onSuccess) {
        onSuccess()
      } else {
        navigate("/pd")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      setErrorMessage(error.message || "Failed to update product. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white dark:bg-zinc-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Edit Product Designation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {["id", "part_name", "reference"].map((field) => (
                <FormField
                  key={field}
                  control={form.control}
                  name={field}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700 dark:text-zinc-300">
                        {field === "id" ? "Product ID" : field === "part_name" ? "Part Name" : "Reference"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          disabled={field === "id"}
                          className="bg-gray-50 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <div className="flex justify-between pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/pd")}
                    className="text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update Product
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

