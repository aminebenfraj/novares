"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { getAllCategories, deleteCategory } from "../../../apis/gestionStockApi/categoryApi"

const ShowCategories = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      alert("Failed to fetch categories. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id)
        fetchCategories()
        alert("Category deleted successfully!")
      } catch (error) {
        console.error("Failed to delete category:", error)
        alert("Failed to delete category. Please try again.")
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="container p-4 mx-auto"
    >
      <Card className="bg-white shadow-lg">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-blue-600">Categories</CardTitle>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/categories/create">
              <Button className="text-white bg-blue-600 hover:bg-blue-700">Add New Category</Button>
            </Link>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((category) => (
              <motion.div key={category._id} variants={itemVariants}>
                <Card className="transition-shadow bg-gray-50 hover:shadow-md">
                  <CardContent className="p-4">
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{category.name}</h3>
                    <div className="flex justify-end space-x-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to={`/categories/edit/${category._id}`}>
                          <Button variant="outline" className="text-blue-600 hover:bg-blue-50">
                            Edit
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(category._id)}
                        >
                          Delete
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ShowCategories

