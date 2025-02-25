"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { createLocation } from "../../../apis/gestionStockApi/locationApi"
import { MapPin, Sparkles } from "lucide-react"
import ContactUs from "@/components/ContactUs"
import Navbar from "@/components/NavBar"

const CreateLocation = () => {
  const [location, setLocation] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createLocation({ location })
      setLocation("")
      alert("Location created successfully!")
      navigate("/locations")
    } catch (error) {
      console.error("Failed to create location:", error)
      alert("Failed to create location. Please try again.")
    }
  }

  return (
    <div>
      <Navbar />
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
      <Card className="w-full max-w-md bg-white dark:bg-zinc-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Create New Location</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Location Name
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full pl-10"
                  placeholder="Enter location name"
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
                Create Location
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

export default CreateLocation

