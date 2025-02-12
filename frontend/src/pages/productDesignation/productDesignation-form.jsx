"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../../utils/PdValidation";
import { Loader2 } from "lucide-react";
import { createPD } from "../../utils/apis/ProductDesignation-api";
import { Navbar } from "../../components/Navbar"


export default function ProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  // 🔹 Submit Form Data
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSubmitSuccess(false);

    try {
      const response = await createPD(data); // ✅ Send Data to API

      if (response.error) {
        throw new Error(response.message || "Failed to create product");
      }

      console.log("Product Created:", response);
      setSubmitSuccess(true);
      reset(); // ✅ Reset form after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-100">
      <Navbar />
    <div className="p-8 sm:p-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#0066CC]">Product Designation</h2>
        <p className="mt-2 text-gray-600">Enter product details below</p>
      </div>

      {/* 🔹 Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {["id", "part_name", "reference"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block mb-1 text-sm font-medium text-gray-700">
                {field === "id" ? "Product ID" : field === "part_name" ? "Part Name" : "Reference (Optional)"}
              </label>
              <input
                type="text"
                id={field}
                {...register(field)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] transition-all"
                placeholder={`Enter ${field === "id" ? "product ID" : field === "part_name" ? "part name" : "reference number"}`}
              />
              {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field].message}</p>}
            </div>
          ))}
        </div>

        {/* 🔹 Buttons */}
        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066CC] transition-all"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-medium text-white bg-[#0066CC] rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
        
      </form>
      </div>


      {/* 🔹 Success Message */}
      {submitSuccess && (
        <div className="p-4 mt-8 border border-green-200 rounded-md bg-green-50">
          <p className="text-sm text-center text-green-600">Product designation submitted successfully!</p>
        </div>
      )}

      {/* 🔹 Error Message */}
      {errorMessage && (
        <div className="p-4 mt-8 border border-red-200 rounded-md bg-red-50">
          <p className="text-sm text-center text-red-600">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
