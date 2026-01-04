// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import useUserStore from "../store/useUserStore.js";

const HomePage = () => {
  const { user} = useUserStore();
console.log("user",user);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          Welcome to Task & Deadline Management System
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {user?.role === "Admin"
            ? "Manage projects and tasks for your team."
            : "Track your assigned tasks and deadlines."}
        </p>
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium"
          >
            Go to Dashboard
          </Link>
          {user?.role === "Admin" && (
            <Link
              to="/admin/projects"
              className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium"
            >
              Manage Projects
            </Link>
          )}
          {user?.role === "User" && (
            <Link
              to="/my-tasks"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md font-medium"
            >
              View My Tasks
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;