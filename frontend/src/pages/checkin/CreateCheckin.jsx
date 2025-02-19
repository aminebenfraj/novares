import { useState } from "react";
import { createCheckin } from "../../apis/checkIn";
import { useNavigate } from "react-router-dom";

const initialCheckinState = {
  project_manager: false,
  business_manager: false,
  engineering_leader_manager: false,
  quality_leader: false,
  plant_quality_leader: false,
  industrial_engineering: false
};

const CreateCheckin = () => {
  const [formData, setFormData] = useState(initialCheckinState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCheckin(formData);
    navigate("/checkins");
  };

  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Create Checkin</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex items-center">
            <input type="checkbox" name={key} checked={formData[key]} onChange={handleChange} className="mr-2" />
            <label className="font-semibold">{key.replace(/_/g, " ")}</label>
          </div>
        ))}
        <button type="submit" className="px-4 py-2 text-white bg-green-500 rounded">Create</button>
      </form>
    </div>
  );
};

export default CreateCheckin;
