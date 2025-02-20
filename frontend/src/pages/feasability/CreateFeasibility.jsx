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

const initialFormData = {
  product: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  raw_material_type: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  raw_material_qty: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  packaging: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  purchased_part: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  injection_cycle_time: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  moulding_labor: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  press_size: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  assembly_finishing_paint_cycle_time: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  assembly_finishing_paint_labor: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  ppm_level: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  pre_study: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  project_management: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  study_design: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  cae_design: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  monitoring: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  measurement_metrology: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  validation: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  molds: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  special_machines: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  checking_fixture: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  equipment_painting_prehension: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  run_validation: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  stock_production_coverage: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  is_presentation: { value: false, description: "", cost: 0, sales_price: 0, comments: "" },
  documentation_update: { value: false, description: "", cost: 0, sales_price: 0, comments: "" }
};


const CreateFeasibility = () => {
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();

  const handleChange = (e, field, type) => {
    setFormData({
      ...formData,
      [field]: { ...formData[field], [type]: e.target.value }
    });
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData({
      ...formData,
      [field]: { ...formData[field], value: checked }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createFeasibility(formData);
    navigate("/");
  };

  return (
    <div>
        <Navbar/>
    <div className="container p-6 mx-auto bg-gray-50">
      <Card className="max-w-4xl mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900">Create Feasibility</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {Object.keys(formData).map((field, index) => (
                <AccordionItem key={field} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={formData[field].value}
                        onCheckedChange={(checked) => handleCheckboxChange(field, checked)}
                      />
                      <Label htmlFor={field} className="text-left">
                        {field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`${field}-description`}>Description</Label>
                        <Textarea
                          id={`${field}-description`}
                          value={formData[field].description}
                          onChange={(e) => handleChange(e, field, "description")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${field}-cost`}>Cost</Label>
                        <Input
                          id={`${field}-cost`}
                          type="number"
                          value={formData[field].cost}
                          onChange={(e) => handleChange(e, field, "cost")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${field}-sales-price`}>Sales Price</Label>
                        <Input
                          id={`${field}-sales-price`}
                          type="number"
                          value={formData[field].sales_price}
                          onChange={(e) => handleChange(e, field, "sales_price")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${field}-comments`}>Comments</Label>
                        <Textarea
                          id={`${field}-comments`}
                          value={formData[field].comments}
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
    <ContactUs/>
    </div>
  );
};

export default CreateFeasibility;