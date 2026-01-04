// src/pages/admin/AdminTasksPage.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../lib/axios"; 
import { PencilIcon, TrashIcon } from "lucide-react";

const AdminTasksPage = () => {
  const [tasks, setTasks] = useState([]);
//   const [editingTask, setEditingTask] = useState(null);

  

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks/");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };


  useEffect(() => {
    fetchTasks();
  }, []);
  const handleUpdateStatus = async (taskId, status) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };



  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await axiosInstance.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "High": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getDeadlineColor = (deadline, status) => {
    const now = new Date();
    const due = new Date(deadline);
    if (status === "Completed") return "text-green-600";
    if (due < now) return "text-red-600";
    if (due.toDateString() === now.toDateString()) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Tasks</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className="px-6 py-4">{task.title}</td>
                <td className="px-6 py-4">{task.projectName || "N/A"}</td>
                <td className="px-6 py-4">
                  <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={getDeadlineColor(task.deadline, task.status)}>
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">{task.assignedIntern}</td>
                <td className="px-6 py-4">
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTasksPage;