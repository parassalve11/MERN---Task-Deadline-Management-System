// src/pages/user/TaskDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { ArrowLeftIcon } from "lucide-react";

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

 
  const fetchTask = async () => {
    try {
      const res = await axiosInstance.get(`/tasks/${taskId}`); // Assume GET /tasks/:id exists, add to backend if not
      setTask(res.data);
    } catch (err) {
      console.error("Error fetching task:", err);
    }
  };

   useEffect(() => {
    fetchTask();
  }, [taskId]);


  const handleUpdateStatus = async (status) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, { status });
      fetchTask();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (!task) return <div>Loading...</div>;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "High": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getDeadlineIndicator = (deadline, status) => {
    const now = new Date();
    const due = new Date(deadline);
    if (status === "Completed") return "✅ Completed";
    if (due < now) return "🚨 Overdue";
    if (due.toDateString() === now.toDateString()) return "⚠️ Due Today";
    return "";
  };

  return (
    <div className="p-6">
      <Link to="/my-tasks" className="flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to My Tasks
      </Link>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
        <p className="text-gray-600 mb-6">{task.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Priority</p>
            <span className={getPriorityColor(task.priority)} className="text-lg">
              {task.priority}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Deadline</p>
            <p className="text-lg">{new Date(task.deadline).toLocaleDateString()}</p>
            <p className="text-sm font-medium">{getDeadlineIndicator(task.deadline, task.status)}</p>
          </div>
          {task.projectName && (
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Project</p>
              <p>{task.projectName}</p>
            </div>
          )}
        </div>
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
          <select
            value={task.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;