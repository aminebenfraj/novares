import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllfacilities, deletefacilities } from "../../apis/facilitiesApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Navbar from "@/components/NavBar";

const FacilitiesList = () => {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      fetchFacilities(searchTerm);
    } else {
      fetchFacilities();
    }
  }, [searchTerm]);

  const fetchFacilities = async (search = "") => {
    try {
      setIsLoading(true);
      const data = await getAllfacilities(); // Modify the API call here to handle search if necessary
      if (search) {
        // If search term is provided, filter facilities here
        const filteredData = data.filter(facility =>
          facility._id.toLowerCase().includes(search.toLowerCase()) || 
          (facility.reception_of_modified_means?.value ? "Yes" : "No").toLowerCase().includes(search.toLowerCase()) ||
          (facility.reception_of_modified_tools?.value ? "Yes" : "No").toLowerCase().includes(search.toLowerCase()) ||
          (facility.reception_of_modified_fixtures?.value ? "Yes" : "No").toLowerCase().includes(search.toLowerCase()) ||
          (facility.reception_of_modified_parts?.value ? "Yes" : "No").toLowerCase().includes(search.toLowerCase()) ||
          (facility.control_plan?.value ? "Yes" : "No").toLowerCase().includes(search.toLowerCase())
        );
        setFacilities(filteredData);
      } else {
        setFacilities(data);
      }
      setError(null);
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
      setError("Failed to fetch facilities. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        await deletefacilities(id);
        fetchFacilities();
      } catch (error) {
        console.error("Failed to delete facility:", error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/facilities/edit/${id}`);
  };

  const handleCreate = () => {
    navigate("/facilities/create");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Facilities</h1>
          <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" /> Create New Facility
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <Input
              type="text"
              placeholder="Search facilities..."
              className="w-full py-2 pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Reception of Modified Means</TableHead>
                <TableHead>Reception of Modified Tools</TableHead>
                <TableHead>Reception of Modified Fixtures</TableHead>
                <TableHead>Reception of Modified Parts</TableHead>
                <TableHead>Control Plan</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility._id}>
                  <TableCell>{facility._id.slice(0, 8)}...</TableCell>
                  <TableCell>{facility.reception_of_modified_means?.value ? "Yes" : "No"}</TableCell>
                  <TableCell>{facility.reception_of_modified_tools?.value ? "Yes" : "No"}</TableCell>
                  <TableCell>{facility.reception_of_modified_fixtures?.value ? "Yes" : "No"}</TableCell>
                  <TableCell>{facility.reception_of_modified_parts?.value ? "Yes" : "No"}</TableCell>
                  <TableCell>{facility.control_plan?.value ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(facility._id)} variant="outline" size="sm" className="mr-2">
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button onClick={() => handleDelete(facility._id)} variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {facilities.length === 0 && <p className="mt-8 text-center text-gray-500">No facilities found.</p>}
      </div>
    </div>
  );
};

export default FacilitiesList;
