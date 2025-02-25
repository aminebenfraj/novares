"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Select } from "../../../components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { getMachineById, updateMachine } from "../../../apis/gestionStockApi/machineApi"

const EditMachine = () => {
  const [machine, setMachine] = useState({
    name: "",
    description: "",
    status: "active",
  })
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const data = await getMachineById(id)
        setMachine(data)
      } catch (error) {
        console.error("Failed to fetch machine:", error)
        alert("Failed to fetch machine. Redirecting to machines list.")
        navigate("/machines")
      }
    }
    fetchMachine()
  }, [id, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setMachine((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateMachine(id, machine)
      alert("Machine updated successfully!")
      navigate("/machines")
    } catch (error) {
      console.error("Failed to update machine:", error)
      alert("Failed to update machine. Please try again.")
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
          <CardTitle className="text-2xl font-bold text-blue-600">Edit Machine</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                  Machine Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={machine.name}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter machine name"
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={machine.description}
                  onChange={handleChange}
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter machine description"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="status" className="block mb-1 text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  id="status"
                  name="status"
                  value={machine.status}
                  onChange={handleChange}
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </Select>
              </div>
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="button" variant="outline" onClick={() => navigate("/machines")}>
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" className="text-white bg-blue-600 hover:bg-blue-700">
                Update Machine
              </Button>
            </motion.div>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

export default EditMachine

