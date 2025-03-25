"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { getTableStatusById } from "../../../apis/pedido/tableStatusApi.jsx"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, Loader2 } from 'lucide-react'
import MainLayout from "@/components/MainLayout"

function ShowTableStatus() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Extract ID from URL path
  const pathSegments = location.pathname.split('/');
  const id = params.id || pathSegments[pathSegments.length - 1];
  
  const [isLoading, setIsLoading] = useState(true);
  const [tableStatus, setTableStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTableStatus = async () => {
      if (!id) {
        setError("ID parameter is missing");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching table status with ID:", id);
        const data = await getTableStatusById(id);
        
        if (!data) {
          setError("Table status not found");
        } else {
          console.log("Table status data:", data);
          setTableStatus(data);
        }
      } catch (error) {
        console.error("Error fetching table status:", error);
        setError(error.message || "Failed to load table status data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTableStatus();
  }, [id, toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error || !tableStatus) {
    return (
      <MainLayout>
        <div className="container py-8 mx-auto">
          <div className="flex items-center mb-6 space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/table-status")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Error</h1>
              <p className="text-muted-foreground">{error || "Table status not found"}</p>
            </div>
          </div>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <p>Unable to load the table status. Please try again or go back to the list.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate("/table-status")}>
                Back to List
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="container py-8 mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/table-status")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Table Status Details</h1>
              <p className="text-muted-foreground">View information about this table status</p>
            </div>
          </div>
          <Button onClick={() => navigate(`/table-status/edit/${id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Table Status Information</CardTitle>
            <CardDescription>Detailed information about this table status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="mt-1 text-lg font-medium">{tableStatus.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Display Order</h3>
                <p className="mt-1 text-lg font-medium">{tableStatus.order}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Color</h3>
              <div className="flex items-center mt-1 space-x-3">
                <div className="w-10 h-10 border rounded-md" style={{ backgroundColor: tableStatus.color }} />
                <span className="text-lg font-medium">{tableStatus.color}</span>
              </div>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Preview</h3>
              <div
                className="flex items-center justify-between p-3 rounded-md"
                style={{ backgroundColor: `${tableStatus.color}20` }}
              >
                <span className="font-medium" style={{ color: tableStatus.color }}>
                  {tableStatus.name}
                </span>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tableStatus.color }}></div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate("/table-status")}>
              Back to List
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </MainLayout>
  );
}

export default ShowTableStatus;
