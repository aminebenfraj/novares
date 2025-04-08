
import { useEffect, useState } from "react";
import { getFeasibilityById } from "../../apis/feasabilityApi";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import MainLayout from "@/components/MainLayout";
// List of feasibility fields (same as backend)
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
  "documentation_update",
];

const FeasibilityDetails = () => {
  const { id } = useParams();
  const [feasibility, setFeasibility] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFeasibilityById(id)
      .then((res) => setFeasibility(res.data))
      .catch((err) => {
        console.error("Error fetching feasibility details:", err);
        setError("Failed to load feasibility details. Please try again.");
      });
  }, [id]);

  // **📌 Show Error Message if API Fails**
  if (error) {
    return (
      <div className="container p-6 mx-auto text-center bg-white">
        <p className="text-lg font-semibold text-red-600">{error}</p>
        <Link to="/">
          <Button className="mt-4 text-white bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </Link>
      </div>
    );
  }

  // **📌 Show Skeleton Loader While Fetching**
  if (!feasibility) {
    return (
      <div className="container p-6 mx-auto bg-white">
        <Skeleton className="w-full h-12 mb-6" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="w-full h-48 bg-gray-200" />
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
      className="container p-6 mx-auto bg-white"
    >
      {/* ✅ Header Section */}
      <div className="flex items-center justify-between mb-6">
        <motion.h1 initial={{ x: -20 }} animate={{ x: 0 }} className="text-3xl font-bold text-gray-900">
          Feasibility Details
        </motion.h1>
        <Link to="/">
          <Button
            variant="outline"
            className="flex items-center text-gray-700 border-gray-300 group hover:text-blue-700 hover:border-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform transform group-hover:-translate-x-1" />
            Back to List
          </Button>
        </Link>
      </div>

      {/* ✅ Feasibility Details Section */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {feasibilityFields
          .filter((key) => feasibility[key]) // ✅ Show only existing fields
          .map((key) => {
            const field = feasibility[key];
            return (
              <motion.div
                key={key}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Card className="transition-shadow duration-300 bg-white border border-gray-300 shadow-lg hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-600 capitalize">
                      {key.replace(/_/g, " ")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {/* ✅ Boolean Status */}
                      <p className="text-gray-700">
                        <span className="font-semibold">Value:</span>
                        <span className={field.value ? "text-green-600" : "text-red-600"}>
                          {field.value ? "Yes" : "No"}
                        </span>
                      </p>

                      {/* ✅ Description */}
                      {field.details?.description && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Description:</span> {field.details.description}
                        </p>
                      )}

                      {/* ✅ Cost */}
                      {field.details?.cost !== undefined && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Cost:</span>
                          <span className="text-blue-600">${field.details.cost?.toFixed(2) || "0.00"}</span>
                        </p>
                      )}

                      {/* ✅ Sales Price */}
                      {field.details?.sales_price !== undefined && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Sales Price:</span>
                          <span className="text-green-600">${field.details.sales_price?.toFixed(2) || "0.00"}</span>
                        </p>
                      )}

                      {/* ✅ Comments */}
                      {field.details?.comments && (
                        <p className="text-gray-700">
                          <span className="font-semibold">Comments:</span> {field.details.comments}
                        </p>
                      )}
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

export default FeasibilityDetails;
