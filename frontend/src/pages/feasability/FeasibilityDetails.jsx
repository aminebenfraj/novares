import { useEffect, useState } from "react";
import { getFeasibilityById } from "../../apis/feasabilityApi";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from 'lucide-react';
import { motion } from "framer-motion";

const FeasibilityDetails = () => {
  const { id } = useParams();
  const [feasibility, setFeasibility] = useState(null);

  useEffect(() => {
    getFeasibilityById(id).then((res) => setFeasibility(res.data));
  }, [id]);

  if (!feasibility) {
    return (
      <div className="container p-6 mx-auto bg-gradient-to-br from-blue-50 to-purple-50">
        <Skeleton className="w-full h-12 mb-6" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="w-full h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container p-6 mx-auto bg-gradient-to-br from-blue-50 to-purple-50"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-bold text-indigo-800"
        >
          Feasibility Details
        </motion.h1>
        <Link to="/">
          <Button variant="outline" className="flex items-center group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform transform group-hover:-translate-x-1" />
            Back to List
          </Button>
        </Link>
      </div>
      <motion.div 
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {Object.entries(feasibility).map(([key, value], index) => (
          <motion.div
            key={key}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card className="transition-shadow duration-300 bg-white border-t-4 border-indigo-500 shadow-md hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-700 capitalize">
                  {key.replace(/_/g, ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Value:</span> 
                    <span className={value.value ? "text-green-600" : "text-red-600"}>
                      {value.value ? "Yes" : "No"}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Description:</span> {value.description || "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Cost:</span> 
                    <span className="text-blue-600">${value.cost?.toFixed(2) || "0.00"}</span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Sales Price:</span> 
                    <span className="text-green-600">${value.sales_price?.toFixed(2) || "0.00"}</span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Comments:</span> {value.comments || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default FeasibilityDetails;