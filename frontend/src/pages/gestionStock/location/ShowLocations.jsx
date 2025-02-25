"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { getAllLocations, deleteLocation } from "../../../apis/gestionStockApi/locationApi"

const ShowLocations = () => {
  const [locations, setLocations] = useState([])

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const data = await getAllLocations()
      setLocations(data)
    } catch (error) {
      console.error("Failed to fetch locations:", error)
      alert("Failed to fetch locations. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await deleteLocation(id)
        fetchLocations()
        alert("Location deleted successfully!")
      } catch (error) {
        console.error("Failed to delete location:", error)
        alert("Failed to delete location. Please try again.")
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
          <CardTitle className="text-2xl font-bold text-blue-600">Locations</CardTitle>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/locations/create">
              <Button className="text-white bg-blue-600 hover:bg-blue-700">Add New Location</Button>
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
            {locations.map((loc) => (
              <motion.div key={loc._id} variants={itemVariants}>
                <Card className="transition-shadow bg-gray-50 hover:shadow-md">
                  <CardContent className="p-4">
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{loc.location}</h3>
                    <div className="flex justify-end space-x-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to={`/locations/edit/${loc._id}`}>
                          <Button variant="outline" className="text-blue-600 hover:bg-blue-50">
                            Edit
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(loc._id)}
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

export default ShowLocations

