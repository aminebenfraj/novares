"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema } from "../../utils/PdValidation"
import { createPD, getAllpd, updatePD, deletePD } from "../../utils/apis/ProductDesignation-api"
import { Loader2, Trash2, Edit } from "lucide-react"
import { Navbar } from "../../components/Navbar"
import ContactUs from "../../components/ContactUs";

export default function ProductCRUD() {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
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
      reset()
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
    reset(product)
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Product Designations</h2>

        <div className="mb-8 overflow-hidden bg-white rounded-lg shadow-md">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {["id", "part_name", "reference"].map((field) => (
                  <div key={field}>
                    <label htmlFor={field} className="block mb-1 text-sm font-medium text-gray-700">
                      {field === "id" ? "Product ID" : field === "part_name" ? "Part Name" : "Reference (Optional)"}
                    </label>
                    <input
                      type="text"
                      id={field}
                      {...register(field)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field].message}</p>}
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3">
              <button
  type="button"
  onClick={() => {
    if (editingProduct) {
      reset(editingProduct) 
    } else {
      reset({ id: "", part_name: "", reference: "" }) 
    }
  }}
  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
  Reset
</button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
                      {editingProduct ? "Updating" : "Submitting"}
                    </>
                  ) : editingProduct ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Part Name", "Reference", "Actions"].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{product.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{product.part_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{product.reference}</td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <button onClick={() => handleEdit(product)} className="mr-4 text-blue-600 hover:text-blue-900">
                          <Edit size={18} className="inline" />
                          <span className="ml-1">Edit</span>
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={18} className="inline" />
                          <span className="ml-1">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-sm text-center text-gray-500">
                      No products available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 mt-4 border border-red-200 rounded-md bg-red-50">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}
      </div>
            <ContactUs />
      
    </div>
  )
}

