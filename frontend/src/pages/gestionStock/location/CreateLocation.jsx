"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { createLocation } from "../../../apis/gestionStockApi/locationApi"

const CreateLocation = () => {
  const [location, setLocation] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createLocation({ location })
      setLocation("")
      alert("Location created successfully!")
    } catch (error) {
      console.error("Failed to create location:", error)
      alert("Failed to create location. Please try again.")
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
          <CardTitle className="text-2xl font-bold text-blue-600">Create New Location</CardTitle>
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
          <CardFooter>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
              <Button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700">
                Create Location
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

export default CreateLocation

