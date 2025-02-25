"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/AuthValidation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import ContactUs from "@/components/ContactUs"
import { BadgeIcon as IdCard, Lock, Loader2 } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState(null)

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      license: "",
      password: "",
    },
  })

  const onSubmit = async (data) => {
    setServerError(null)
    try {
      await login(data.license, data.password)
      navigate("/")
    } catch (err) {
      console.error(err)
      setServerError(err.message || "Login failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 flex flex-col justify-between">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-white dark:bg-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            {serverError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {[
                  { name: "license", label: "License", icon: IdCard },
                  { name: "password", label: "Password", icon: Lock },
                ].map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: fieldProps }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700 dark:text-zinc-300">{field.label}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
                            <Input
                              {...fieldProps}
                              type={field.name === "password" ? "password" : "text"}
                              className="pl-10 bg-gray-50 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-violet-500 dark:focus:ring-violet-400"
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox id="remember-me" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
            <p className="mt-6 text-sm text-center text-zinc-600 dark:text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
              >
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <ContactUs />
    </div>
  )
}

