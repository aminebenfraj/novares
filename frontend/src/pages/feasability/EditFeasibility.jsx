"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeasibilityById, updateFeasibility } from "@/apis/feasabilityApi";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/MainLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


// List of checkin fields
const CHECKIN_FIELDS = [
  "business_manager",
  "economic_financial_leader",
  "engineering_leader_manager",
  "industrial_engineering",
  "launch_manager_method",
  "logistics",
  "maintenance",
  "plant_quality_leader",
  "project_manager",
  "purchasing",
  "quality_leader",
  "sales",
];

const EditFeasibility = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [feasibilityData, setFeasibilityData] = useState({});
  const [checkinData, setCheckinData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 📌 Fetch Feasibility Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFeasibilityById(id);
        // ✅ Extract Feasibility Data (Properly Handles `{ value, details }`)
        const feasibilityFields = {};
        Object.entries(response.data).forEach(([key, value]) => {
          if (value && typeof value === "object" && "value" in value) {
            feasibilityFields[key] = {
              value: value.value ?? false,
              details: value.details || { description: "", cost: 0, sales_price: 0, comments: "" },
            };
          }
        });
        setFeasibilityData(feasibilityFields);

        // ✅ Extract Checkin Data
        if (response.data.checkin) {
          const checkinFields = CHECKIN_FIELDS.reduce((acc, field) => {
            acc[field] = response.data.checkin[field] ?? false;
            return acc;
          }, {});
          setCheckinData(checkinFields);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch data");
        toast({ title: "Error", description: "Failed to fetch Feasibility data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, toast]);

  // ✅ Handle Feasibility Field Changes
  const handleFeasibilityChange = (key, field, value) => {
    setFeasibilityData((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  // ✅ Handle Checkin Field Changes
  const handleCheckinChange = (key) => {
    setCheckinData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = {
        ...Object.entries(feasibilityData).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {}),
        checkin: checkinData,
      };

      console.log("Sending data to server:", JSON.stringify(formData, null, 2));
      await updateFeasibility(id, formData);

      toast({ title: "Success", description: "Feasibility and Checkin Updated Successfully!" });
      navigate(`/feasibility/${id}`);
    } catch (error) {
      console.error("Update error:", error);
      toast({ title: "Error", description: "Failed to update Feasibility and Checkin", variant: "destructive" });
    } finally {
        setSubmitting(false);
    }
};

  // ✅ Show Loader While Fetching Data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  // ✅ Show Error Message if API Fails
  if (error) {
      console.log(feasibilityData);
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Error Loading Data</h2>
        <p className="mb-4 text-gray-600">{error}</p>
        <Button onClick={() => navigate("/")}>Go Back to List</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainLayout />
      <div className="container p-6 mx-auto">
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              Edit Feasibility & Checkin
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ✅ Feasibility Fields */}
              <h3 className="text-lg font-semibold text-gray-700">Feasibility Details</h3>
              <AnimatePresence>
              <Accordion type="single" collapsible className="w-full">
  {Object.entries(feasibilityData).map(([key, value], index) => (
    <AccordionItem key={key} value={`item-${index}`}>
      {/* ✅ Accordion Trigger */}
      <AccordionTrigger className="text-lg font-semibold">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={key}
            checked={value.value}
            onCheckedChange={(checked) => handleFeasibilityChange(key, "value", checked)}
          />
          <Label htmlFor={key} className="text-left capitalize">
            {key.replace(/_/g, " ")}
          </Label>
        </div>
      </AccordionTrigger>

      {/* ✅ Accordion Content */}
      <AccordionContent>
        <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
          {/* ✅ Description */}
          <div className="space-y-2">
            <Label htmlFor={`${key}-description`}>Description</Label>
            <Textarea
              id={`${key}-description`}
              value={value.details?.description || ""}
              onChange={(e) =>
                handleFeasibilityChange(key, "details", { ...value.details, description: e.target.value })
              }
              placeholder="Enter description..."
            />
          </div>

          {/* ✅ Cost */}
          <div className="space-y-2">
            <Label htmlFor={`${key}-cost`}>Cost</Label>
            <Input
              id={`${key}-cost`}
              type="number"
              value={value.details?.cost || ""}
              onChange={(e) =>
                handleFeasibilityChange(key, "details", { ...value.details, cost: Number(e.target.value) })
              }
              placeholder="Enter cost..."
            />
          </div>

          {/* ✅ Sales Price */}
          <div className="space-y-2">
            <Label htmlFor={`${key}-sales-price`}>Sales Price</Label>
            <Input
              id={`${key}-sales-price`}
              type="number"
              value={value.details?.sales_price || ""}
              onChange={(e) =>
                handleFeasibilityChange(key, "details", { ...value.details, sales_price: Number(e.target.value) })
              }
              placeholder="Enter sales price..."
            />
          </div>

          {/* ✅ Comments */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`${key}-comments`}>Comments</Label>
            <Textarea
              id={`${key}-comments`}
              value={value.details?.comments || ""}
              onChange={(e) =>
                handleFeasibilityChange(key, "details", { ...value.details, comments: e.target.value })
              }
              placeholder="Enter comments..."
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
</AnimatePresence>

              {/* ✅ Checkin Fields */}
              <h3 className="text-lg font-semibold text-gray-700">Checkin Details</h3>
              <AnimatePresence>
                {CHECKIN_FIELDS.map((field) => (
                  <motion.div key={field} className="flex items-center p-2 bg-white border rounded-md">
                    <Checkbox checked={checkinData[field]} onCheckedChange={() => handleCheckinChange(field)} />
                    <Label className="ml-2 capitalize">{field.replace(/_/g, " ")}</Label>
                  </motion.div>
                ))}
              </AnimatePresence>
            </form>
          </CardContent>
          <CardFooter className="bg-gray-50">
            <Button type="submit" disabled={submitting} onClick={handleSubmit}>
              {submitting ? "Updating..." : "Update"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EditFeasibility;
