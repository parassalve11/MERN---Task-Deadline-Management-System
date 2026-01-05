// src/pages/user/MyTasksPage.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../../lib/axios"; 

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);

  
  const fetchMyTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks/my");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching my tasks:", err);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);


  const handleUpdateStatus = async (taskId, status) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, { status });
      fetchMyTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDeadlineIndicator = (deadline, status) => {
    const now = new Date();
    const due = new Date(deadline);
    if (status === "Completed") return { color: "bg-green-100 text-green-800", icon: "✅" };
    if (due < now) return { color: "bg-red-100 text-red-800", icon: "🚨 Overdue" };
    if (due.toDateString() === now.toDateString()) return { color: "bg-yellow-100 text-yellow-800", icon: "⚠️ Due Today" };
    return { color: "bg-gray-100 text-gray-800", icon: "" };
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const indicator = getDeadlineIndicator(task.deadline, task.status);
          return (
            <div key={task._id} className={`bg-white shadow rounded-lg p-6 ${indicator.color}`}>
              <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
              <p className="text-gray-600 mb-4">{task.description}</p>
              <div className="space-y-2 mb-4">
                <button onclick={getPriorityColor(task.priority)} className="px-2 py-1 rounded text-sm">
                  {task.priority}
                </button>
                <p className="text-sm">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                <span className="text-sm font-medium">{indicator.icon}</span>
              </div>
              <select
                value={task.status}
                onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          );
        })}
      </div>
      {tasks.length === 0 && <p>No tasks assigned.</p>}
    </div>
  );
};

export default MyTasksPage;