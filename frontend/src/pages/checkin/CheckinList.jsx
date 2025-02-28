  "use client";

  import { useEffect, useState } from "react";
  import { getCheckins, deleteCheckin } from "../../apis/checkIn";
  import { Link } from "react-router-dom";
  import { Button } from "@/components/ui/button";
  import { toast } from "@/hooks/use-toast";
  import { Loader2, Trash, Pencil, PlusCircle, Eye } from "lucide-react";
  import { Skeleton } from "@/components/ui/skeleton";
  import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
  import Navbar from "@/components/NavBar";
  import ContactUs from "@/components/ContactUs";
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";

  const CheckinList = () => {
    const [checkins, setCheckins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [selectedCheckin, setSelectedCheckin] = useState(null);
    const [filter, setFilter] = useState("");

    useEffect(() => {
      getCheckins()
        .then((res) => setCheckins(res.data))
        .catch(() => toast({ title: "Error fetching check-ins", variant: "destructive" }))
        .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this check-in?")) return;
      setDeletingId(id);
      try {
        await deleteCheckin(id);
        setCheckins((prev) => prev.filter((item) => item._id !== id));
        toast({ title: "Check-in deleted", variant: "destructive" });
      } catch (error) {
        toast({ title: "Error deleting check-in", variant: "error" });
      } finally {
        setDeletingId(null);
      }
    };

    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container py-10 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">Check-ins</h1>
            <div className="flex gap-4">
              <Input 
                type="text" 
                placeholder="Search by ID..." 
                className="px-4 py-2 border rounded-md" 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Link to="/checkins/create">
                <Button className="px-4 py-2 shadow-md">Add Check-in</Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="w-full h-10 rounded" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checkins.filter(item => item._id.includes(filter)).map((item) => {
                  const isComplete = Object.entries(item)
                    .filter(([key]) => !["_id", "__v", "createdAt", "updatedAt"].includes(key))
                    .every(([, value]) => value === true);
                  return (
                    <TableRow key={item._id}>
                      <TableCell>{item._id}</TableCell>
                      <TableCell>{isComplete ? "Everything Checked" : "Incomplete"}</TableCell>
                      <TableCell className="flex gap-2">
                        <Dialog>
                          <DialogTrigger>
                            <Button size="sm" variant="outline" onClick={() => setSelectedCheckin(item)}>View</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Check-in Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              {Object.keys(item)
                                .filter((key) => !["_id", "__v", "createdAt", "updatedAt"].includes(key))
                                .map((key) => (
                                  <p key={key} className="text-sm">
                                    <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>: {item[key] ? "Yes" : "No"}
                                  </p>
                                ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Link to={`/checkins/edit/${item._id}`}>
                          <Button size="sm" variant="outline">Edit</Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                        >
                          {deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
        <ContactUs />
      </div>
    );
  };

  export default CheckinList;
