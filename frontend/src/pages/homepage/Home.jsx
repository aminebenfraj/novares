"use client"
import { Link } from "react-router-dom"
import { Navbar } from "../../components/Navbar"
import ContactUs from "../../components/ContactUs"
import {
  Box,
  Atom,
  Users,
  Settings,
  ClipboardCheck,
  FileText,
  Rocket,
  ListChecks,
  Utensils,
  CheckCircle,
  MapPin,
} from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card"
import { Button } from "../../components/ui/button"

const FeatureCard = ({ to, icon: Icon, title, description, color }) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex flex-col items-center">
    <Card className="w-full h-full transition-shadow shadow-md hover:shadow-lg">
      <CardHeader className="items-center pb-4 space-y-6">
        <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center pt-2">
        <Button variant="ghost" asChild className="text-blue-600 hover:text-blue-800">
          <Link to={to} className="flex items-center">
            Learn more
            <svg className="w-4 h-4 ml-1" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.5 3.5l4 4.5-4 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
)

const Home = () => {
  const features = [
    {
      icon: Box,
      title: "Product Designation",
      description: "View and manage your product designations.",
      to: "/pd",
      color: "bg-blue-500",
    },
    {
      icon: Atom,
      title: "Mass Production",
      description: "Handle mass production forms and data.",
      to: "/masspd",
      color: "bg-gray-500",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Manage users and their roles.",
      to: "/admin",
      color: "bg-indigo-500",
    },
    { icon: Settings, title: "Tests", description: "Access various test modules.", to: "/test", color: "bg-green-500" },
    {
      icon: ClipboardCheck,
      title: "Feasibility",
      description: "Manage and view feasibility studies.",
      to: "/Feasibility",
      color: "bg-yellow-500",
    },
    {
      icon: CheckCircle,
      title: "Check-ins",
      description: "Manage check-ins for projects and feasibility studies.",
      to: "/checkins",
      color: "bg-red-500",
    },
    {
      icon: Utensils,
      title: "Ok For Lunch",
      description: "Manage OkForLunch approvals and records.",
      to: "/okforlunch",
      color: "bg-purple-500",
    },
    {
      icon: FileText,
      title: "Validation For Offer",
      description: "Manage and validate offers efficiently.",
      to: "/validationforoffer",
      color: "bg-teal-500",
    },
    {
      icon: ListChecks,
      title: "Tasks",
      description: "Manage and validate tasks.",
      to: "/tasklist",
      color: "bg-cyan-500",
    },
    {
      icon: Rocket,
      title: "Kickoff",
      description: "Manage and validate kick-offs.",
      to: "/kickoff",
      color: "bg-orange-500",
    },
    { icon: FileText, title: "Design", description: "Manage and modify designs.", to: "/design", color: "bg-pink-500" },
    {
      icon: Box,
      title: "Categories",
      description: "Manage and organize product categories.",
      to: "/categories",
      color: "bg-lime-500",
    },
    {
      icon: MapPin,
      title: "Locations",
      description: "Manage warehouse and material locations.",
      to: "/location",
      color: "bg-emerald-500",
    },
    {
      icon: Settings,
      title: "Machines",
      description: "View and manage machines in production.",
      to: "/machine",
      color: "bg-sky-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <Navbar />
      <div className="container px-6 py-16 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 space-y-4 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">Welcome to Novares Management System</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Manage your products, production, feasibility, check-ins, and more efficiently.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-7xl"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <ContactUs />
    </div>
  )
}

export default Home

