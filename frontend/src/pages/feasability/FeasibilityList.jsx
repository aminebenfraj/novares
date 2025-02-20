

import { useEffect, useState } from "react";
import { getFeasibilities } from "../../apis/feasabilityApi";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronRight, Pencil } from "lucide-react";
import { motion } from "framer-motion";

// Feasibility fields list (same as backend)
const feasibilityFields = [
  "product",
  "raw_material_type",
  "raw_material_qty",
  "packaging",
  "purchased_part",
  "injection_cycle_time",
  "moulding_labor",
  "press_size",
  "assembly_finishing_paint_cycle_time",
  "assembly_finishing_paint_labor",
  "ppm_level",
  "pre_study",
  "project_management",
  "study_design",
  "cae_design",
  "monitoring",
  "measurement_metrology",
  "validation",
  "molds",
  "special_machines",
  "checking_fixture",
  "equipment_painting_prehension",
  "run_validation",
  "stock_production_coverage",
  "is_presentation",
  "documentation_update"
];

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
      className="container p-6 mx-auto bg-white"
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-bold text-gray-900"
        >
          Feasibilities
        </motion.h1>
        <Link to="/CreateFeasibility">
          <Button className="text-white transition-all duration-300 ease-in-out transform bg-blue-600 hover:bg-blue-700 hover:scale-105">
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
        {feasibilities.map((item) => {
          // ✅ Determine the feasibility type based on active fields
          const activeField = feasibilityFields.find((field) => item[field]?.value);
          const feasibilityTitle = activeField
            ? `${activeField.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} Feasibility`
            : "General Feasibility";

          return (
            <motion.div
              key={item._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <Card className="transition-shadow duration-300 bg-white border border-gray-300 shadow-lg hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">
                    {feasibilityTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    {/* ✅ View Details Button */}
                    <Link to={`/feasibility/${item._id}`} className="w-full">
                      <Button variant="outline" className="justify-between w-full text-gray-700 border-gray-300 hover:text-blue-700 hover:border-blue-500 group">
                        View Details
                        <ChevronRight className="w-4 h-4 transition-transform transform group-hover:translate-x-1" />
                      </Button>
                    </Link>

                    {/* ✅ Edit Feasibility Button */}
                    <Link to={`/feasibility/edit/${item._id}`} className="w-full">
                      <Button variant="outline" className="flex items-center justify-center w-full text-gray-700 border-gray-300 hover:text-green-700 hover:border-green-500">
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default FeasibilityList;
