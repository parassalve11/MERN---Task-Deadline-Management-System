// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../lib/axios"; 
// import useUserStore from "../store/useUserStore.js";

const DashboardPage = () => {
  // const { user } = useUserStore();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [upcoming, setUpcoming] = useState([]);

  

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/tasks/");
      const tasks = res.data; // Assume API returns array of tasks
      const now = new Date();
      const overdue = tasks.filter(
        (task) =>
          task.status !== "Completed" &&
          new Date(task.deadline) < now
      ).length;
      setStats({
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "Pending").length,
        inProgress: tasks.filter((t) => t.status === "In Progress").length,
        completed: tasks.filter((t) => t.status === "Completed").length,
        overdue,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchUpcoming = async () => {
    try {
      const res = await axiosInstance.get("/tasks/");
      const tasks = res.data;
      const now = new Date();
      const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcomingTasks = tasks
        .filter(
          (task) =>
            task.status !== "Completed" &&
            new Date(task.deadline) >= now &&
            new Date(task.deadline) <= next7Days
        )
        .slice(0, 5) // Limit to 5
        .map((task) => ({
          title: task.title,
          project: task.projectName || "No Project", // Assume projectName in task
          dueDate: new Date(task.deadline).toLocaleDateString(),
        }));
      setUpcoming(upcomingTasks);
    } catch (err) {
      console.error("Error fetching upcoming:", err);
    }
  };
  useEffect(() => {
    fetchStats();
    fetchUpcoming();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className={`p-4 rounded-lg shadow ${getStatusColor(key)}`}>
            <h3 className="text-sm font-medium uppercase tracking-wide">{key}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines (Next 7 Days)</h2>
        {upcoming.length === 0 ? (
          <p>No upcoming tasks.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((task, idx) => (
              <li key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span>{task.title} - {task.project}</span>
                <span className="font-medium">{task.dueDate}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;