"use client"

import { useState, useEffect } from "react"
import { getAllUsers, deleteUser, createUser } from "../../apis/admin"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, Search, Loader2, Users, AlertCircle } from "lucide-react"
import Navbar from "../../components/NavBar"
import ContactUs from "../../components/ContactUs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

const tableRowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newUserData, setNewUserData] = useState({
    license: "",
    username: "",
    email: "",
    password: "",
    roles: ["User"],
  })

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    fetchUsers()
  }, [currentPage])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getAllUsers(currentPage, ITEMS_PER_PAGE)
      setUsers(data.users)
      setTotalPages(data.pagination.totalPages)
    } catch (err) {
      setError("Failed to load users.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users.",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.roles.some((role) => role.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDelete = async (license) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(license)
        setUsers(users.filter((user) => user.license !== license))
        toast({
          title: "Success",
          description: "User deleted successfully.",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete user.",
        })
      }
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const newUser = await createUser(newUserData)
      setUsers([...users, newUser])
      setIsCreateModalOpen(false)
      setNewUserData({ license: "", username: "", email: "", password: "", roles: ["User"] })
      toast({
        title: "Success",
        description: "User created successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUserData({ ...newUserData, [name]: value })
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, i) => {
            // Show first page, last page, current page, and pages around current
            if (
              i === 0 ||
              i === totalPages - 1 ||
              i === currentPage - 1 ||
              i === currentPage - 2 ||
              i === currentPage
            ) {
              return (
                <PaginationItem key={i + 1}>
                  <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            }

            // Show ellipsis for gaps
            if ((i === 1 && currentPage > 3) || (i === totalPages - 2 && currentPage < totalPages - 2)) {
              return (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            return null
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Skeleton className="w-48 h-10 mb-6" />
        <Skeleton className="w-full h-10 mb-6" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="container px-4 py-8 mx-auto">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-3xl font-bold">
                  <Users className="w-6 h-6" />
                  Admin Dashboard
                </CardTitle>
                <CardDescription>Manage users, roles, and permissions</CardDescription>
              </div>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1">
                    <Plus className="w-4 h-4" />
                    Create New User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>Add a new user to the system with default role.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="license">License</Label>
                      <Input
                        type="text"
                        name="license"
                        id="license"
                        value={newUserData.license}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        type="text"
                        name="username"
                        id="username"
                        value={newUserData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        value={newUserData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        value={newUserData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <DialogFooter className="pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create User"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users by name, email, license, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.license}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={tableRowVariants}
                          className="group"
                        >
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((role, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="w-8 h-8 text-slate-600 hover:text-slate-900"
                              >
                                <Link to={`/admin/edit-user/${user.license}`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 text-red-600 hover:text-red-900 hover:bg-red-50"
                                onClick={() => handleDelete(user.license)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {renderPagination()}
          </CardContent>
        </Card>
      </motion.div>
      <ContactUs />
    </div>
  )
}

