"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/lib/AuthValidation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BadgeIcon as IdCard, User, Mail, Lock, Loader2, Info, CheckCircle, XCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Register() {
  const navigate = useNavigate()
  const { register: authRegister } = useAuth()
  const [serverError, setServerError] = useState("")
  const [passwordValue, setPasswordValue] = useState("")

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      license: "",
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    mode: "onChange", // Enable validation on change
  })

  const onSubmit = async (data) => {
    setServerError("")
    try {
      // Make sure we're calling the authRegister function with the correct parameters
      await authRegister(data.license, data.username, data.email, data.password)

      // Show success message before redirecting
      alert("Registration successful! You will now be redirected to the login page.")

      // Navigate to login page after successful registration
      navigate("/login")
    } catch (error) {
      console.error("Registration failed:", error)
      setServerError(error.message || "Registration failed. Please try again.")
    }
  }

  // Password validation checks
  const hasMinLength = passwordValue.length >= 8
  const hasUppercase = /[A-Z]/.test(passwordValue)
  const hasLowercase = /[a-z]/.test(passwordValue)
  const hasNumber = /[0-9]/.test(passwordValue)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordValue)

  // For debugging - log form errors to console
  console.log("Form errors:", form.formState.errors)

  return (
    <section className="flex items-center justify-center h-full min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="container p-12">
        <div className="flex items-center justify-center text-gray-900 dark:text-white">
          <div className="flex flex-wrap w-full max-w-4xl overflow-hidden bg-white shadow-xl rounded-2xl dark:bg-gray-700">
            {/* Left Column */}
            <div className="flex flex-col justify-center w-full p-8 lg:w-6/12">
              <CardHeader className="text-center">
                <img src="/novares-logo.webp" alt="Novares" className="w-56 mx-auto" />
                <CardTitle className="mt-4 text-2xl font-semibold text-blue-600">Create Your Account</CardTitle>
              </CardHeader>
              <CardContent>
                {serverError && (
                  <Alert variant="destructive" className="mb-6 text-white bg-red-500">
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {[
                      { name: "license", label: "License", icon: IdCard },
                      { name: "username", label: "Username", icon: User },
                      { name: "email", label: "Email", icon: Mail },
                    ].map((field) => (
                      <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name}
                        render={({ field: fieldProps }) => (
                          <FormItem>
                            <FormLabel className="text-blue-600">{field.label}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <field.icon className="absolute text-gray-500 transform -translate-y-1/2 left-4 top-1/2" />
                                <Input
                                  {...fieldProps}
                                  className="py-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder={`Enter ${field.label.toLowerCase()}`}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    ))}

                    {/* Password field with validation feedback */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel className="text-blue-600">Password</FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-4 h-4 ml-2 text-blue-500" />
                                </TooltipTrigger>
                                <TooltipContent className="p-4 space-y-2 bg-white border border-gray-200 rounded-lg shadow-lg w-80">
                                  <p className="font-medium text-gray-800">Password must contain:</p>
                                  <ul className="pl-5 space-y-1 text-sm text-gray-600 list-disc">
                                    <li>At least 8 characters</li>
                                    <li>At least one uppercase letter (A-Z)</li>
                                    <li>At least one lowercase letter (a-z)</li>
                                    <li>At least one number (0-9)</li>
                                    <li>At least one special character (!@#$%^&*)</li>
                                  </ul>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute text-gray-500 transform -translate-y-1/2 left-4 top-1/2" />
                              <Input
                                {...field}
                                type="password"
                                className="py-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter password"
                                onChange={(e) => {
                                  field.onChange(e)
                                  setPasswordValue(e.target.value)
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />

                          {/* Password strength indicators */}
                          {passwordValue.length > 0 && (
                            <div className="mt-2 space-y-1 text-sm">
                              <p className="font-medium text-gray-700">Password strength:</p>
                              <ul className="space-y-1">
                                <li className="flex items-center">
                                  {hasMinLength ? (
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                  )}
                                  <span className={hasMinLength ? "text-green-600" : "text-red-500"}>
                                    At least 8 characters
                                  </span>
                                </li>
                                <li className="flex items-center">
                                  {hasUppercase ? (
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                  )}
                                  <span className={hasUppercase ? "text-green-600" : "text-red-500"}>
                                    Uppercase letter
                                  </span>
                                </li>
                                <li className="flex items-center">
                                  {hasLowercase ? (
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                  )}
                                  <span className={hasLowercase ? "text-green-600" : "text-red-500"}>
                                    Lowercase letter
                                  </span>
                                </li>
                                <li className="flex items-center">
                                  {hasNumber ? (
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                  )}
                                  <span className={hasNumber ? "text-green-600" : "text-red-500"}>Number</span>
                                </li>
                                <li className="flex items-center">
                                  {hasSpecialChar ? (
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                  )}
                                  <span className={hasSpecialChar ? "text-green-600" : "text-red-500"}>
                                    Special character
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* Password Confirmation field */}
                    <FormField
                      control={form.control}
                      name="passwordConfirmation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-600">Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute text-gray-500 transform -translate-y-1/2 left-4 top-1/2" />
                              <Input
                                {...field}
                                type="password"
                                className="py-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm your password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <motion.div className="mt-6" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        className="w-full py-4 text-xl text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>

                {/* Moved outside the form to prevent form submission */}
                <p className="mt-6 text-center text-gray-700">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Sign in here
                  </Link>
                </p>
              </CardContent>
            </div>
            {/* Right Column */}
            <div
              className="items-center justify-center hidden w-6/12 p-12 text-white lg:flex"
              style={{ background: "linear-gradient(to right, #3b82f6, #2563eb, #1d4ed8, #1e40af)" }}
            >
              <div>
                <h4 className="mb-6 text-2xl font-semibold">Join our growing community</h4>
                <p className="text-lg">
                  Create an account to access exclusive features and become part of the Novares ecosystem. Your journey
                  with us begins here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

