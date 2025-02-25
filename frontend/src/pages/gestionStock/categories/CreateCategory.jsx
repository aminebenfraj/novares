"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { createCategory } from "../../../apis/gestionStockApi/categoryApi"
import { Tag, Sparkles } from "lucide-react"
import ContactUs from "@/components/ContactUs"
import Navbar from "@/components/NavBar"

const CreateCategory = () => {
  const [name, setName] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createCategory({ name })
      setName("")
      alert("Category created successfully!")
      navigate("/categories")
    } catch (error) {
      console.error("Failed to create category:", error)
      alert("Failed to create category. Please try again.")
    }
  }

  return (
    <div>
      <Navbar />
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
      <Card className="w-full max-w-md bg-white dark:bg-zinc-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Create New Category</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category Name
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10"
                  placeholder="Enter category name"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
              <Button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Category
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </div>
    <ContactUs />
    </div>
  )
}

export default CreateCategory

