
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getMaterialById, updateMaterial } from "../../../apis/gestionStockApi/materialApi"
import { getAllSuppliers } from "../../../apis/gestionStockApi/supplierApi"
import { getAllCategories } from "../../../apis/gestionStockApi/categoryApi"
import { getAllLocations } from "../../../apis/gestionStockApi/locationApi"
import { getAllMachines } from "../../../apis/gestionStockApi/machineApi"
import { Save, ArrowLeft } from "lucide-react"
import ContactUs from "@/components/ContactUs"
import Navbar from "@/components/NavBar"

const EditMaterial = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [material, setMaterial] = useState({
    supplier: "",
    manufacturer: "",
    reference: "",
    description: "",
    minimumStock: 0,
    currentStock: 0,
    orderLot: 0,
    location: "",
    critical: false,
    consumable: false,
    machines: [],
    comment: "",
    photo: "",
    price: 0,
    category: "",
  })
  const [suppliers, setSuppliers] = useState([])
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  
  const fetchData = async () => {
    await fetchMaterial()
    await fetchSuppliers()
    await fetchCategories()
    await fetchLocations()
    await fetchMachines()
    setLoading(false)
  }
  
  
    useEffect(() => {
      fetchData()
    }, [])
  
  const fetchMaterial = async () => {
    try {
      const data = await getMaterialById(id)
      console.log(data);
      
      setMaterial({...data,
        machines: data.machines.map((machine) => machine._id),
        supplier: data.supplier._id,
        category: data.category._id,
        location: data.location._id,
      })
    } catch (error) {
      console.error("Failed to fetch material:", error)
      alert("Failed to fetch material. Redirecting to materials list.")
      navigate("/materials")
    }
  }

  const fetchSuppliers = async () => {
    try {
      const data = await getAllSuppliers()
      setSuppliers(data)
    } catch (error) {
      console.error("Failed to fetch suppliers:", error)
      alert("Failed to fetch suppliers. Please try again.")
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      alert("Failed to fetch categories. Please try again.")
    }
  }

  const fetchLocations = async () => {
    try {
      const data = await getAllLocations()
      setLocations(data)
    } catch (error) {
      console.error("Failed to fetch locations:", error)
      alert("Failed to fetch locations. Please try again.")
    }
  }

  const fetchMachines = async () => {
    try {
      const data = await getAllMachines()
      setMachines(data)
    } catch (error) {
      console.error("Failed to fetch machines:", error)
      alert("Failed to fetch machines. Please try again.")
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setMaterial((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleMachineChange = (machineId) => {
    setMaterial((prev) => ({
      ...prev,
      machines: prev.machines.includes(machineId)
        ? prev.machines.filter((id) => id !== machineId)
        : [...prev.machines, machineId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateMaterial(id, material)
      alert("Material updated successfully!")
      navigate("/materials")
    } catch (error) {
      console.error("Failed to update material:", error)
      alert("Failed to update material. Please try again.")
    }
  }
if ( loading){
  return null
}
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
        <Card className="w-full max-w-4xl bg-white shadow-lg dark:bg-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Edit Material</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="reference" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Reference
                  </label>
                  <Input
                    id="reference"
                    name="reference"
                    value={material.reference}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="Enter reference"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="manufacturer" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Manufacturer
                  </label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={material.manufacturer}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="Enter manufacturer"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={material.description}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter material description"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="minimumStock" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Minimum Stock
                  </label>
                  <Input
                    id="minimumStock"
                    name="minimumStock"
                    type="number"
                    value={material.minimumStock}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="Enter minimum stock"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="currentStock" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Current Stock
                  </label>
                  <Input
                    id="currentStock"
                    name="currentStock"
                    type="number"
                    value={material.currentStock}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="Enter current stock"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="orderLot" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Order Lot
                  </label>
                  <Input
                    id="orderLot"
                    name="orderLot"
                    type="number"
                    value={material.orderLot}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter order lot"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Price
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={material.price}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="Enter price"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="supplier" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Supplier
                  </label>
                  <Select
                    name="supplier"
                    value={material.supplier}
                    onValueChange={(value) => handleChange({ target: { name: "supplier", value } })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier._id} value={supplier._id}>
                          {supplier.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Category
                  </label>
                  <Select
                    name="category"
                    value={material.category}
                    onValueChange={(value) => handleChange({ target: { name: "category", value } })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Location
                  </label>
                  <Select
                    name="location"
                    value={material.location}
                    onValueChange={(value) => handleChange({ target: { name: "location", value } })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location._id} value={location._id}>
                          {location.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <Checkbox
                        id="critical"
                        name="critical"
                        checked={material.critical}
                        onCheckedChange={(checked) =>
                          handleChange({ target: { name: "critical", type: "checkbox", checked } })
                        }
                      />
                      <label htmlFor="critical" className="ml-2 text-sm text-zinc-700 dark:text-zinc-300">
                        Critical
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="consumable"
                        name="consumable"
                        checked={material.consumable}
                        onCheckedChange={(checked) =>
                          handleChange({ target: { name: "consumable", type: "checkbox", checked } })
                        }
                      />
                      <label htmlFor="consumable" className="ml-2 text-sm text-zinc-700 dark:text-zinc-300">
                        Consumable
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Associated Machines</label>
                  <div className="grid grid-cols-2 gap-2">
                  {machines.map((machine) => (
  <div key={machine._id} className="flex items-center">
    <Checkbox
      id={`machine-${machine._id}`}
      checked={material.machines.includes(machine._id)}  // Check if the machine is in the array
      onCheckedChange={() => handleMachineChange(machine._id)}
    />
    <label
      htmlFor={`machine-${machine._id}`}
      className="ml-2 text-sm text-zinc-700 dark:text-zinc-300"
    >
      {machine.name}
    </label>
  </div>
))}
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Comment
                  </label>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={material.comment}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter any additional comments"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label htmlFor="photo" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Photo URL
                  </label>
                  <Input
                    id="photo"
                    name="photo"
                    value={material.photo}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Enter photo URL"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="button" variant="outline" onClick={() => navigate("/materials")}>
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
                  Update Material
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

export default EditMaterial

