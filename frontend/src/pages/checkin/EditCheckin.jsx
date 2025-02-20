import { useEffect, useState } from "react";
import { getCheckinById, updateCheckin } from "../../apis/checkIn";
import { useNavigate, useParams } from "react-router-dom";
import ContactUs from "@/components/ContactUs";
import Navbar from "@/components/NavBar";

const EditCheckin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    getCheckinById(id).then((res) => setFormData(res.data));
  }, [id]);

  const handleChange = (e) => {
    const { name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCheckin(id, formData);
    navigate("/checkins");
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div>
        <Navbar/>
    <div className="container p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Edit Checkin</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex items-center">
            <input type="checkbox" name={key} checked={formData[key]} onChange={handleChange} className="mr-2" />
            <label className="font-semibold">{key.replace(/_/g, " ")}</label>
          </div>
        ))}
        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">Update</button>
      </form>
    </div>
    <ContactUs/>
    </div>
  );
};

export default EditCheckin;
