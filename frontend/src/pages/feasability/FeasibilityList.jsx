import { useEffect, useState } from "react";
import { getFeasibilities } from "../../apis/feasabilityApi";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronRight } from 'lucide-react';
import { motion } from "framer-motion";

const FeasibilityList = () => {
  const [feasibilities, setFeasibilities] = useState([]);

  useEffect(() => {
    getFeasibilities()
      .then((res) => setFeasibilities(res.data))
      .catch((err) => console.error("Error fetching feasibilities:", err));
  }, []);

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
          Feasibilities
        </motion.h1>
        <Link to="/create">
          <Button className="text-white transition-all duration-300 ease-in-out transform bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 hover:scale-105">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>
      <motion.div 
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
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
        {feasibilities.map((item) => (
          <motion.div
            key={item._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <Card className="transition-shadow duration-300 bg-white border-t-4 border-indigo-500 shadow-md hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-700">
                  {item.product ? "Product Feasibility" : "General Feasibility"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-600">
                  Created: {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <Link to={`/feasibility/${item._id}`}>
                  <Button variant="outline" className="justify-between w-full group">
                    View Details
                    <ChevronRight className="w-4 h-4 transition-transform transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default FeasibilityList;