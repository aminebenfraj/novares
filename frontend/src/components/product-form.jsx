"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema } from "../lib/schema"

export default function ProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Form data:", data)
      setSubmitSuccess(true)
      reset()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto overflow-hidden bg-white shadow-md rounded-xl md:max-w-2xl">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0066CC]">Product Designation</h2>
            <p className="mt-2 text-gray-600">Enter product details below</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                Product ID
              </label>
              <input
                type="text"
                id="id"
                {...register("id")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066CC] focus:border-[#0066CC] transition-colors"
                placeholder="Enter product ID"
              />
              {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>}
            </div>

            <div>
              <label htmlFor="part_name" className="block text-sm font-medium text-gray-700">
                Part Name
              </label>
              <input
                type="text"
                id="part_name"
                {...register("part_name")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066CC] focus:border-[#0066CC] transition-colors"
                placeholder="Enter part name"
              />
              {errors.part_name && <p className="mt-1 text-sm text-red-600">{errors.part_name.message}</p>}
            </div>

            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                Reference (Optional)
              </label>
              <input
                type="text"
                id="reference"
                {...register("reference")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0066CC] focus:border-[#0066CC] transition-colors"
                placeholder="Enter reference number"
              />
              {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference.message}</p>}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066CC] transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0066CC] hover:bg-[#0052a3] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          {submitSuccess && (
            <div className="p-4 mt-6 rounded-md bg-green-50">
              <p className="text-sm text-green-600">Product designation submitted successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

