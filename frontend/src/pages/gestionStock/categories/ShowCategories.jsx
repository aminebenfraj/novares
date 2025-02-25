"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { getAllCategories, deleteCategory } from "../../../apis/gestionStockApi/categoryApi"
import { Plus, Edit, Trash2, Tag } from "lucide-react"
import ContactUs from "@/components/ContactUs"
import Navbar from "@/components/NavBar"
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

  return (
    <div>
      <Navbar />
    <div className="container p-4 mx-auto">
      <Card className="bg-white dark:bg-zinc-800 shadow-lg">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Categories</CardTitle>
          <Link to="/categories/create">
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
              <Plus className="w-4 h-4 mr-2" />
              Add New Category
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((category) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gray-50 dark:bg-zinc-700 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                      <Tag className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{category.name}</h3>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Link to={`/categories/edit/${category._id}`}>
                        <Button
                          variant="outline"
                          className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={() => handleDelete(category._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </div>
    <ContactUs />
    </div>
  )
}

export default ShowCategories

