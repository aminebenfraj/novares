import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask } from "../../apis/taskApi";

const EditTask = () => {
  const { id } = useParams(); // Get task ID from URL
  const navigate = useNavigate();

  const [task, setTask] = useState({
    comments: "",
    responsible: "",
    planned: "",
    file: null,
  });

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const data = await getTaskById(id);
      setTask({
        comments: data.comments,
        responsible: data.responsible,
        planned: data.planned.split("T")[0], // Format date
        file: null, // Reset file selection
      });
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setTask({ ...task, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("comments", task.comments);
    formData.append("responsible", task.responsible);
    formData.append("planned", task.planned);
    if (task.file) {
      formData.append("file", task.file);
    }

    try {
      await updateTask(id, formData);
      navigate("/"); // Redirect to Task List
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Edit Task</h1>
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold">Comments</label>
          <input
            type="text"
            name="comments"
            value={task.comments}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold">Responsible</label>
          <input
            type="text"
            name="responsible"
            value={task.responsible}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold">Planned Date</label>
          <input
            type="date"
            name="planned"
            value={task.planned}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold">Upload File (optional)</label>
          <input type="file" name="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
        </div>
        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">Update Task</button>
      </form>
    </div>
  );
};

export default EditTask;
