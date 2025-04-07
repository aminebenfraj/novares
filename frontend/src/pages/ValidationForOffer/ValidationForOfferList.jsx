"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getValidationForOffers, deleteValidationForOffer } from "@/apis/validationForOfferApi";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, FileText, Trash2, Plus, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/NavBar";
import ContactUs from "@/components/ContactUs";

const ValidationForOfferList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await getValidationForOffers();
      setEntries(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch ValidationForOffer data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteValidationForOffer(id);
      toast({
        title: "Success",
        description: "Entry deleted successfully",
      });
      setEntries(entries.filter((entry) => entry._id !== id));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <motion.div initial="hidden" animate="visible" className="container p-6 mx-auto">
        <Card className="w-full max-w-4xl mx-auto overflow-hidden">
          <CardHeader className="bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-800">Validation For Offer List</CardTitle>
              <Link to="/validationforoffer/create">
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
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {entries.map((entry) => (
                        <motion.tr key={entry._id} layout>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {entry.check ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell>
                            {entry.upload ? (
                              <a
                                href={`http://192.168.1.187:5000/${entry.upload}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-500 transition-colors hover:text-blue-700"
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                View File
                              </a>
                            ) : (
                              <span className="text-gray-400">No File</span>
                            )}
                          </TableCell>
                          <TableCell className="flex space-x-2">
                            <Link to={`/validationforoffer/edit/${entry._id}`}>
                              <Button size="sm" variant="outline">
                                <Pencil className="w-4 h-4 mr-1" /> Edit
                              </Button>
                            </Link>
                            <Button onClick={() => handleDelete(entry._id)} size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
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
      <ContactUs />
    </div>
  );
};

export default ValidationForOfferList;
