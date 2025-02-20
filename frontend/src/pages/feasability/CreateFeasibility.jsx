import { useState } from "react";
import { createFeasibility } from "../../apis/feasabilityApi";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ContactUs from "@/components/ContactUs";
import Navbar from "@/components/NavBar";

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
  "documentation_update"
];

// Initial state
const initialFormData = feasibilityFields.reduce((acc, field) => {
  acc[field] = { value: false, details: { description: "", cost: 0, sales_price: 0, comments: "" } };
  return acc;
}, {});

const CreateFeasibility = () => {
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e, field, type) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        details: { ...formData[field].details, [type]: e.target.value },
      },
    });
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (field, checked) => {
    setFormData({
      ...formData,
      [field]: { ...formData[field], value: checked },
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createFeasibility(formData);
    navigate("/");
  };

  return (
    <div>
      <Navbar />
      <div className="container p-6 mx-auto bg-gray-50">
        <Card className="max-w-4xl mx-auto bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">Create Feasibility</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                {feasibilityFields.map((field, index) => (
                  <AccordionItem key={field} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={field}
                          checked={formData[field].value}
                          onCheckedChange={(checked) => handleCheckboxChange(field, checked)}
                        />
                        <Label htmlFor={field} className="text-left">
                          {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Label>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-description`}>Description</Label>
                          <Textarea
                            id={`${field}-description`}
                            value={formData[field].details.description}
                            onChange={(e) => handleChange(e, field, "description")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-cost`}>Cost</Label>
                          <Input
                            id={`${field}-cost`}
                            type="number"
                            value={formData[field].details.cost}
                            onChange={(e) => handleChange(e, field, "cost")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-sales-price`}>Sales Price</Label>
                          <Input
                            id={`${field}-sales-price`}
                            type="number"
                            value={formData[field].details.sales_price}
                            onChange={(e) => handleChange(e, field, "sales_price")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${field}-comments`}>Comments</Label>
                          <Textarea
                            id={`${field}-comments`}
                            value={formData[field].details.comments}
                            onChange={(e) => handleChange(e, field, "comments")}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button type="submit" className="w-full text-white bg-green-600 hover:bg-green-700">
                Submit Feasibility
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <ContactUs />
    </div>
  );
};

export default CreateFeasibility;
