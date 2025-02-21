import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getKickOffById, updateKickOff } from "../../apis/kickOffApi";

const EditKickOff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kickOff, setKickOff] = useState({
    projectRiskAssessment: false,
    validationOfCosts: false,
  });

  useEffect(() => {
    if (id) {
      fetchKickOff();
    }
  }, [id]);

  const fetchKickOff = async () => {
    const data = await getKickOffById(id);
    setKickOff(data);
  };

  const handleChange = (e) => {
    setKickOff({ ...kickOff, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateKickOff(id, kickOff);
    navigate("/");
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Edit Kick-Off</h1>
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
        <label className="block mb-2">
          <input type="checkbox" name="projectRiskAssessment" checked={kickOff.projectRiskAssessment} onChange={handleChange} /> Project Risk Assessment
        </label>
        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">Update Kick-Off</button>
      </form>
    </div>
  );
};

export default EditKickOff;
