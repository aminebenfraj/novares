"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../../utils/PdValidation";
import { createPD, getAllpd, updatePD, deletePD } from "../../utils/apis/ProductDesignation-api";
import { Loader2, Trash2, Edit } from "lucide-react";

export default function ProductCRUD() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllpd();
      setProducts(response || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      if (editingProduct) {
        await updatePD(editingProduct.id, data);
      } else {
        await createPD(data);
      }
      reset();
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    reset(product);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deletePD(id);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="p-8 sm:p-12">
      <h2 className="text-3xl font-bold text-[#0066CC] text-center mb-6">Product Designations</h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          {["id", "part_name", "reference"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                {field === "id" ? "Product ID" : field === "part_name" ? "Part Name" : "Reference (Optional)"}
              </label>
              <input
                type="text"
                id={field}
                {...register(field)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#0066CC]"
              />
              {errors[field] && <p className="text-sm text-red-600">{errors[field].message}</p>}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={() => reset()} className="px-4 py-2 border bg-gray-100 rounded-md">Reset</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#0066CC] text-white rounded-md">
            {isSubmitting ? <Loader2 className="animate-spin inline-block w-5 h-5" /> : editingProduct ? "Update" : "Submit"}
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Part Name</th>
              <th className="border p-2">Reference</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="border">
                  <td className="border p-2 text-center">{product.id}</td>
                  <td className="border p-2 text-center">{product.part_name}</td>
                  <td className="border p-2 text-center">{product.reference}</td>
                  <td className="border p-2 text-center">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 px-2">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 px-2">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">No products available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 mt-4 bg-red-50 border border-red-200 text-center text-red-600">{errorMessage}</div>
      )}
    </div>
  );
}
