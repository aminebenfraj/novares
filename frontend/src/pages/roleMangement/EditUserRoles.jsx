"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getUserByLicense, adminUpdateUser, updateUserRoles } from "../../apis/admin"
import { motion } from "framer-motion"
import { Check, Search, Loader2, ArrowLeft, User, Mail, ImageIcon } from "lucide-react"
import Navbar from "../../components/NavBar"
import ContactUs from "../../components/ContactUs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

const rolesEnum = [
  "Admin",
  "Manager",
  "Project Manager",
  "Business Manager",
  "Financial Leader",
  "Manufacturing Eng. Manager",
  "Manufacturing Eng. Leader",
  "Tooling Manager",
  "Automation Leader",
  "SAP Leader",
  "Methodes UAP1&3",
  "Methodes UAP2",
  "Maintenance Manager",
  "Maintenance Leader UAP2",
  "Purchasing Manager",
  "Logistic Manager",
  "Logistic Leader UAP1",
  "Logistic Leader UAP2",
  "Logistic Leader",
  "POE Administrator",
  "Material Administrator",
  "Warehouse Leader UAP1",
  "Warehouse Leader UAP2",
  "Prod. Plant Manager UAP1",
  "Prod. Plant Manager UAP2",
  "Quality Manager",
  "Quality Leader UAP1",
  "Quality Leader UAP2",
  "Quality Leader UAP3",
  "Laboratory Leader",
  "Customer",
  "User",
  "PRODUCCION",
  "LOGISTICA",
]

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function EditUserRoles() {
  const { license } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    image: "",
    roles: [],
  })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchRole, setSearchRole] = useState("")

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const data = await getUserByLicense(license)
      setFormData({
        username: data.username || "",
        email: data.email || "",
        image: data.image || "",
        roles: data.roles || [],
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user data.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleRole = (role) => {
    setFormData((prevData) => ({
      ...prevData,
      roles: prevData.roles.includes(role) ? prevData.roles.filter((r) => r !== role) : [...prevData.roles, role],
    }))
  }

  const filteredRoles = rolesEnum.filter((role) => role.toLowerCase().includes(searchRole.toLowerCase()))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await adminUpdateUser(license, formData)
      await updateUserRoles(license, formData.roles)
      setMessage("User updated successfully!")
      toast({
        title: "Success",
        description: "User updated successfully!",
        variant: "default",
      })
      setTimeout(() => navigate("/admin"), 2000)
    } catch (error) {
      setMessage("Error updating user.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-32 h-4" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container max-w-4xl px-4 py-8 mx-auto"
      >
        <div className="flex items-center mb-6 space-x-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Card as={motion.div} variants={fadeIn}>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Update user details and manage role assignments for license: <strong>{license}</strong>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <motion.div variants={fadeIn} className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </motion.div>

                <motion.div variants={fadeIn} className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </motion.div>

                <motion.div variants={fadeIn} className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Profile Image URL
                  </Label>
                  <Input type="text" id="image" name="image" value={formData.image} onChange={handleChange} />
                </motion.div>

                <motion.div variants={fadeIn} className="space-y-2">
                  <Label className="flex items-center gap-2">Assign Roles</Label>
                  <div className="relative mb-4">
                    <Search className="absolute w-4 h-4 text-muted-foreground left-3 top-3" />
                    <Input
                      type="text"
                      placeholder="Search roles..."
                      value={searchRole}
                      onChange={(e) => setSearchRole(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <motion.div
                    variants={staggerContainer}
                    className="flex flex-wrap gap-2 p-4 border rounded-lg bg-background min-h-[100px] max-h-[300px] overflow-y-auto"
                  >
                    {filteredRoles.map((role) => (
                      <motion.div key={role} variants={fadeIn} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge
                          variant={formData.roles.includes(role) ? "default" : "outline"}
                          className="px-3 py-1.5 cursor-pointer"
                          onClick={() => toggleRole(role)}
                        >
                          {role}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate("/admin")}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
      <ContactUs />
    </div>
  )
}

