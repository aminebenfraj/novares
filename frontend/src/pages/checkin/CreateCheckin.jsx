
import { useState } from "react";
import { createCheckin } from "../../apis/checkIn";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import ContactUs from "@/components/ContactUs";
import Navbar from "@/components/NavBar";

const initialCheckinState = {
  project_manager: false,
  business_manager: false,
  engineering_leader_manager: false,
  quality_leader: false,
  plant_quality_leader: false,
  industrial_engineering: false,
  launch_manager_method: false,
  maintenance: false,
  purchasing: false,
  logistics: false,
  sales: false,
  economic_financial_leader: false,
};

const CreateCheckin = () => {
  const [formData, setFormData] = useState(initialCheckinState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCheckin(formData);
      window.alert("Check-in created successfully!");
      navigate("/checkins");
    } catch (error) {
      console.error("Error creating check-in:", error);
      window.alert("Error creating check-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div>
            <Navbar/>
    <div className="container p-6 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-lg mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">Create Check-in</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(formData).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={formData[key]}
                    onCheckedChange={(value) => handleChange(key, value)}
                  />
                  <Label htmlFor={key} className="capitalize">{key.replace(/_/g, " ")}</Label>
                </div>
              ))}
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Check-in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    <ContactUs/>
    </div>
  );
};

export default CreateCheckin;
