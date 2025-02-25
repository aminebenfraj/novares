"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { getLocationById, updateLocation } from "../../../apis/gestionStockApi/locationApi"

const EditLocation = () => {
  const [location, setLocation] = useState("")
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await getLocationById(id)
        setLocation(data.location)
      } catch (error) {
        console.error("Failed to fetch location:", error)
        alert("Failed to fetch location. Redirecting to locations list.")
        navigate("/locations")
      }
    }
    fetchLocation()
  }, [id, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateLocation(id, { location })
      alert("Location updated successfully!")
      navigate("/locations")
    } catch (error) {
      console.error("Failed to update location:", error)
      alert("Failed to update location. Please try again.")
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
          <CardTitle className="text-2xl font-bold text-blue-600">Edit Location</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4"
            >
              <label htmlFor="location" className="block mb-1 text-sm font-medium text-gray-700">
                Location Name
              </label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter location name"
              />
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="button" variant="outline" onClick={() => navigate("/locations")}>
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="text-white bg-blue-600 hover:bg-blue-700">
                Update Location
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

export default EditLocation

