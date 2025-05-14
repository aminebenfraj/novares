"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { createPD } from "../../apis/ProductDesignation-api"
import { Navbar } from "../../components/Navbar"
import ContactUs from "../../components/ContactUs"

export default function ProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      part_name: "",
      reference: "",
    },
  })

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data)
    setIsSubmitting(true)
    setErrorMessage("")
    setSubmitSuccess(false)

    try {
      const response = await createPD(data)
      console.log("API response:", response)

      if (response && response.error) {
        throw new Error(response.message || "Failed to create product")
      }

      setSubmitSuccess(true)
      reset()
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage(error.message || "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container max-w-4xl px-4 py-8 mx-auto">
        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Product Designation</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="part_name" className="block mb-1 text-sm font-medium text-gray-700">
                  Part Name
                </label>
                <input
                  type="text"
                  id="part_name"
                  {...register("part_name", { required: "Part name is required" })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter part name"
                />
                {errors.part_name && <p className="mt-1 text-sm text-red-600">{errors.part_name.message}</p>}
              </div>
              <div>
                <label htmlFor="reference" className="block mb-1 text-sm font-medium text-gray-700">
                  Reference (Optional)
                </label>
                <input
                  type="text"
                  id="reference"
                  {...register("reference")}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reference number"
                />
                {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference.message}</p>}
              </div>
              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => reset()}
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
                      Submitting
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
            {submitSuccess && (
              <div className="p-4 mt-4 border border-green-200 rounded-md bg-green-50">
                <p className="text-sm text-green-600">Product designation submitted successfully!</p>
              </div>
            )}
            {errorMessage && (
              <div className="p-4 mt-4 border border-red-200 rounded-md bg-red-50">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <ContactUs />
    </div>
  )
}
