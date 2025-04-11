"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { getLocationById, updateLocation } from "../../../apis/gestionStockApi/locationApi"
import { Save, ArrowLeft, MapPin } from "lucide-react"
import ContactUs from "@/components/ContactUs"
import Navbar from "@/components/NavBar"
import MainLayout from "@/components/MainLayout"

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
    <MainLayout>
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
          <Card className="w-full max-w-md bg-white shadow-lg dark:bg-zinc-800">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Edit Location</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Location Name
                  </label>
                  <div className="relative">
                    <MapPin className="absolute transform -translate-y-1/2 left-3 top-1/2 text-zinc-500 dark:text-zinc-400" />
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
              <CardFooter className="flex justify-between">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button type="button" variant="outline" onClick={() => navigate("/locations")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Location
                  </Button>
                </motion.div>
              </CardFooter>
            </form>
          </Card>
        </div>
        <ContactUs />
      </div>
    </MainLayout>
  )
}

export default EditLocation
