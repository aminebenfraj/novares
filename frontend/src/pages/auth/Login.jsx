import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/AuthValidation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeIcon as IdCard, Lock, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState(null);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      license: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await login(data.license, data.password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setServerError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <section className="flex items-center justify-center h-full min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="container p-12">
        <div className="flex items-center justify-center text-gray-900 dark:text-white">
          <div className="flex flex-wrap w-full max-w-4xl overflow-hidden bg-white shadow-xl rounded-2xl dark:bg-gray-700">
            {/* Left Column */}
            <div className="flex flex-col justify-center w-full p-8 lg:w-6/12">
              <CardHeader className="text-center">
                <img src="/novares-logo.webp" alt="Novares" className="w-56 mx-auto" />
                <CardTitle className="mt-4 text-2xl font-semibold text-blue-600">
                  Welcome Back
                </CardTitle>
              </CardHeader>
              <CardContent>
                {serverError && (
                  <Alert variant="destructive" className="mb-6 text-white bg-red-500">
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {[{ name: "license", label: "License", icon: IdCard }, { name: "password", label: "Password", icon: Lock }].map((field) => (
                      <FormField
                        key={field.name}
                        control={form.control}
                        name={field.name}
                        render={({ field: fieldProps }) => (
                          <FormItem>
                            <FormLabel className="text-lg text-blue-600">{field.label}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <field.icon className="absolute text-gray-500 transform -translate-y-1/2 left-4 top-1/2" />
                                <Input
                                  {...fieldProps}
                                  type={field.name === "password" ? "password" : "text"}
                                  className="py-4 pl-12 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder={`Enter ${field.label.toLowerCase()}`}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <Checkbox id="remember-me" />
                        <label htmlFor="remember-me" className="ml-2 text-lg text-gray-700">Remember me</label>
                      </div>
                      <Link to="/forgot-password" className="text-lg text-blue-600 hover:underline">Forgot Password?</Link>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        className="w-full py-4 text-xl text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Form>
                <p className="mt-6 text-lg text-center text-gray-700">
                  Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
                </p>
              </CardContent>
            </div>
            {/* Right Column */}
            <div
              className="items-center justify-center hidden w-6/12 p-12 text-white lg:flex"
              style={{ background: "linear-gradient(to right, #3b82f6, #2563eb, #1d4ed8, #1e40af)" }}
            >
              <div>
                <h4 className="mb-6 text-2xl font-semibold">We are more than just a company</h4>
                <p className="text-lg">Novares is a global supplier of plastic solutions specializing in the design and manufacture of complex components and systems for the automotive industry.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
