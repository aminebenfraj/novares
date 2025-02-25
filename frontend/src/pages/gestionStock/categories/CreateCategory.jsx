"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { createCategory } from "../../../apis/gestionStockApi/categoryApi"

const CreateCategory = () => {
  const [name, setName] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createCategory({ name })
      setName("")
      alert("Category created successfully!")
    } catch (error) {
      console.error("Failed to create category:", error)
      alert("Failed to create category. Please try again.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container p-4 mx-auto"
    >
      <Card className="max-w-md mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">Create New Category</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4"
            >
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                Category Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter category name"
              />
            </motion.div>
          </CardContent>
          <CardFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
              <Button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700">
                Create Category
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

export default CreateCategory

