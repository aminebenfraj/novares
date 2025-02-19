"use client";

import { useEffect, useState } from "react";
import { getCheckins, deleteCheckin } from "../../apis/checkIn";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast"
import { Loader2, Trash, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CheckinList = () => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getCheckins()
      .then((res) => setCheckins(res.data))
      .catch((err) => console.error("Error fetching checkins:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this checkin?")) {
      setDeletingId(id);
      try {
        await deleteCheckin(id);
        setCheckins(checkins.filter((item) => item._id !== id));
        toast({ title: "Check-in deleted", variant: "destructive" });
      } catch (error) {
        toast({ title: "Error deleting check-in", variant: "error" });
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="container p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Check-in List</h1>
        <Link to="/checkins/create">
          <Button className="transition-transform duration-200 shadow-md hover:scale-105">
            + Add Check-in
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="w-full h-40 rounded-lg" />
          ))}
        </div>
      ) : (
        <AnimatePresence>
          {checkins.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {checkins.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-4 transition-transform duration-200 shadow-lg hover:scale-105">
                    <CardHeader>
                      <CardTitle className="text-lg">Check-in ID: {item._id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(item)
                        .filter((key) => !["_id", "__v", "createdAt", "updatedAt"].includes(key))
                        .map((key) => (
                          <p key={key} className="text-sm">
                            {key.replace(/_/g, " ")}: {item[key] ? "✅" : "❌"}
                          </p>
                        ))}
                      <div className="flex items-center gap-2 mt-4">
                        <Link to={`/checkins/edit/${item._id}`}>
                          <Button size="icon" variant="outline" className="hover:bg-yellow-500 hover:text-white">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                        >
                          {deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No check-ins available.</div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default CheckinList;
