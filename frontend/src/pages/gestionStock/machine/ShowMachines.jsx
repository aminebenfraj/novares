"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { getAllMachines, deleteMachine } from "../../../apis/gestionStockApi/machineApi"

const ShowMachines = () => {
  const [machines, setMachines] = useState([])

  useEffect(() => {
    fetchMachines()
  }, [])

  const fetchMachines = async () => {
    try {
      const data = await getAllMachines()
      setMachines(data)
    } catch (error) {
      console.error("Failed to fetch machines:", error)
      alert("Failed to fetch machines. Please try again.")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this machine?")) {
      try {
        await deleteMachine(id)
        fetchMachines()
        alert("Machine deleted successfully!")
      } catch (error) {
        console.error("Failed to delete machine:", error)
        alert("Failed to delete machine. Please try again.")
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-red-500"
      case "maintenance":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
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
          <CardTitle className="text-2xl font-bold text-blue-600">Machines</CardTitle>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/machines/create">
              <Button className="text-white bg-blue-600 hover:bg-blue-700">Add New Machine</Button>
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
            {machines.map((machine) => (
              <motion.div key={machine._id} variants={itemVariants}>
                <Card className="transition-shadow bg-gray-50 hover:shadow-md">
                  <CardContent className="p-4">
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{machine.name}</h3>
                    <p className="mb-2 text-sm text-gray-600">{machine.description}</p>
                    <Badge className={`mb-4 ${getStatusColor(machine.status)}`}>{machine.status}</Badge>
                    <div className="flex justify-end space-x-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to={`/machines/edit/${machine._id}`}>
                          <Button variant="outline" className="text-blue-600 hover:bg-blue-50">
                            Edit
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(machine._id)}
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

export default ShowMachines

