"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getOkForLunch, deleteOkForLunch } from "@/apis/okForLunch"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, XCircle, FileText, Trash2, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "@/components/NavBar";
import ContactUs from "@/components/ContactUs";

const OkForLunchList = () => {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      setLoading(true)
      const data = await getOkForLunch()
      setEntries(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch OkForLunch data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteOkForLunch(id)
      toast({
        title: "Success",
        description: "Entry deleted successfully",
      })
      setEntries(entries.filter((entry) => entry._id !== id))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <div>
        <Navbar/>
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="container p-6 mx-auto">
      <Card className="w-full max-w-4xl mx-auto overflow-hidden">
        <CardHeader className="bg-gray-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800">OkForLunch List</CardTitle>
            <Link to="/okforlunch/create">
              <Button className="text-white bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {entries.map((entry) => (
                      <motion.tr
                        key={entry._id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        layout
                      >
                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            {entry.check ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </motion.div>
                        </TableCell>
                        <TableCell>
                          {entry.upload ? (
                            <motion.a
                              href={`http://192.168.1.187:5000/${entry.upload}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-500 transition-colors hover:text-blue-700"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              View File
                            </motion.a>
                          ) : (
                            <span className="text-gray-400">No File</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={() => handleDelete(entry._id)}
                              variant="destructive"
                              size="sm"
                              className="flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </motion.div>
                        </TableCell>
                        <TableCell>
  <Link to={`/okforlunch/edit/${entry._id}`}>
    <Button variant="outline" size="sm" className="flex items-center">
      Edit
    </Button>
  </Link>
</TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
       <ContactUs/>
       </div>
  )
}

export default OkForLunchList

