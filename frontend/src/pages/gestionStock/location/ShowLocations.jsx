import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { getAllLocations, deleteLocation } from "../../../apis/gestionStockApi/locationApi"
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import ContactUs from "@/components/ContactUs"
import Navbar from "@/components/NavBar"
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

  return (
    <div>
      <Navbar />
    <div className="container p-4 mx-auto">
      <Card className="bg-white dark:bg-zinc-800 shadow-lg">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Locations</CardTitle>
          <Link to="/locations/create">
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
              <Plus className="w-4 h-4 mr-2" />
              Add New Location
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
            {locations.map((loc) => (
              <motion.div
                key={loc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gray-50 dark:bg-zinc-700 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                      <MapPin className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{loc.location}</h3>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Link to={`/locations/edit/${loc._id}`}>
                        <Button variant="outline" className="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={() => handleDelete(loc._id)}
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

export default ShowLocations
