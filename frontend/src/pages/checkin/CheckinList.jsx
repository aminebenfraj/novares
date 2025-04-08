import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCheckins, deleteCheckin } from "../../apis/checkIn";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Skeleton } from "../../components/ui/skeleton";
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, MoreHorizontal, Eye, Pencil, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';
import MainLayout from "@/components/MainLayout";

const CheckinList = () => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [filter, setFilter] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    try {
      setLoading(true);
      const res = await getCheckins();
      setCheckins(res.data);
    } catch (error) {
      toast({
        title: "Error fetching check-ins",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this check-in?")) return;
    
    setDeletingId(id);
    try {
      await deleteCheckin(id);
      setCheckins((prev) => prev.filter((item) => item._id !== id));
      toast({
        title: "Check-in deleted",
        description: "The check-in has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error deleting check-in",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getCompletionStatus = (checkin) => {
    const fields = Object.keys(checkin).filter(
      key => !["_id", "__v", "createdAt", "updatedAt"].includes(key)
    );
    
    const completedFields = fields.filter(key => checkin[key] === true);
    const isComplete = completedFields.length === fields.length;
    
    return {
      status: isComplete ? "Complete" : "Incomplete",
      percentage: Math.round((completedFields.length / fields.length) * 100),
      variant: isComplete ? "success" : "warning"
    };
  };

  const filteredCheckins = checkins.filter(item => 
    item._id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <MainLayout/>
      <div className="container py-8 mx-auto">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Check-ins</CardTitle>
                <CardDescription>
                  Manage and view all check-ins
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute w-4 h-4 -translate-y-1/2 text-muted-foreground left-3 top-1/2" />
                  <Input
                    placeholder="Search by ID..."
                    className="pl-9"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>
                <Link to="/checkins/create">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" /> Add Check-in
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="w-full h-12" />
                ))}
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCheckins.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No check-ins found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCheckins.map((checkin) => {
                        const { status, percentage, variant } = getCompletionStatus(checkin);
                        return (
                          <TableRow key={checkin._id}>
                            <TableCell className="font-medium">
                              {checkin._id.substring(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <Badge variant={variant} className="flex items-center justify-center w-24 gap-1">
                                {status === "Complete" ? (
                                  <><CheckCircle className="w-3 h-3" /> Complete</>
                                ) : (
                                  <><XCircle className="w-3 h-3" /> Incomplete</>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-full h-2 rounded-full bg-secondary">
                                  <div 
                                    className={`h-full rounded-full ${variant === "success" ? "bg-green-500" : "bg-amber-500"}`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs w-9">{percentage}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => {
                                        e.preventDefault();
                                        setSelectedCheckin(checkin);
                                      }}>
                                        <Eye className="w-4 h-4 mr-2" /> View details
                                      </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Check-in Details</DialogTitle>
                                      </DialogHeader>
                                      {selectedCheckin && (
                                        <div className="grid gap-4 py-4">
                                          <div className="grid items-center grid-cols-2 gap-4">
                                            <span className="font-medium">ID:</span>
                                            <span>{selectedCheckin._id}</span>
                                          </div>
                                          <div className="grid items-center grid-cols-2 gap-4">
                                            <span className="font-medium">Status:</span>
                                            <Badge variant={getCompletionStatus(selectedCheckin).variant}>
                                              {getCompletionStatus(selectedCheckin).status}
                                            </Badge>
                                          </div>
                                          <div className="h-px my-2 bg-border" />
                                          {Object.entries(selectedCheckin)
                                            .filter(([key]) => !["_id", "__v", "createdAt", "updatedAt"].includes(key))
                                            .map(([key, value]) => (
                                              <div key={key} className="grid items-center grid-cols-2 gap-4">
                                                <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
                                                <Badge variant={value ? "success" : "secondary"}>
                                                  {value ? "Yes" : "No"}
                                                </Badge>
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                    </DialogContent>
                                  </Dialog>
                                  <Link to={`/checkins/edit/${checkin._id}`}>
                                    <DropdownMenuItem>
                                      <Pencil className="w-4 h-4 mr-2" /> Edit
                                    </DropdownMenuItem>
                                  </Link>
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      handleDelete(checkin._id);
                                    }}
                                    disabled={deletingId === checkin._id}
                                  >
                                    {deletingId === checkin._id ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4 mr-2" />
                                    )}
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <MainLayout />
    </div>
  );
};

export default CheckinList;
