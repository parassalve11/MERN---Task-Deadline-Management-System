// src/pages/admin/AdminProjectDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../lib/axios"; 
import { ArrowLeftIcon, PlusIcon, PencilIcon, TrashIcon } from "lucide-react";

const AdminProjectDetailsPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    assignedTo: "", // Changed to match backend field
    status: "Pending",
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null); // For edit functionality
  const [users, setUsers] = useState([]); // For intern select

  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get(`/projects/${projectId}`);
      setProject(res.data);
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  const fetchProjectTasks = async () => {
    try {
      // Use the new /projects/:id/tasks endpoint
      const res = await axiosInstance.get(`/projects/${projectId}/tasks`);
      setTasks(res.data.tasks || []); // Backend returns { project, tasks }
    } catch (err) {
      console.error("Error fetching project tasks:", err);
      // Fallback to all tasks if endpoint not available
      const allRes = await axiosInstance.get("/tasks/");
      const projectTasks = allRes.data.filter((task) => task.project?._id === projectId);
      setTasks(projectTasks);
    }
  };

  const fetchUsers = async () => {
    try {
      // Assume you have a GET /users endpoint for admins to list users
      const res = await axiosInstance.get("/auth/users"); // Add this endpoint if needed
      const interns = res.data.filter((user) => user.role === "User");
      console.log("Interns",interns);
      
      setUsers(interns);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = { ...taskForm, project: projectId }; // Backend expects 'project'
      if (editingTaskId) {
        await axiosInstance.put(`/tasks/${editingTaskId}`, taskData);
        setEditingTaskId(null);
      } else {
        await axiosInstance.post("/tasks", taskData);
      }
      setTaskForm({
        title: "",
        description: "",
        priority: "Medium",
        deadline: "",
        assignedTo: "",
        status: "Pending",
      });
      setShowTaskForm(false);
      fetchProjectTasks();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const handleEditTask = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
      assignedTo: task.assignedTo?._id || task.assignedTo, // Use ID
      status: task.status,
    });
    setEditingTaskId(task._id);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Delete this task?")) {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        fetchProjectTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  useEffect(() => {
    fetchProject();
    fetchProjectTasks(); // Use dedicated endpoint
    fetchUsers(); // Fetch users for select
  }, [projectId]);

  if (!project) return <div>Loading...</div>;

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
      <Link to="/admin/projects" className="flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Projects
      </Link>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-600">{project.description}</p>
        <p className="text-sm text-gray-500 mt-2">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={() => {
            setEditingTaskId(null);
            setTaskForm({
              title: "",
              description: "",
              priority: "Medium",
              deadline: "",
              assignedTo: "",
              status: "Pending",
            });
            setShowTaskForm(!showTaskForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          {showTaskForm ? "Cancel" : "Add Task"}
        </button>
      </div>

      {showTaskForm && (
        <form onSubmit={handleSubmitTask} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows={2}
          />
          <select
            value={taskForm.priority}
            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            value={taskForm.deadline}
            onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={taskForm.assignedTo}
            onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Intern</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {editingTaskId ? "Update Task" : "Add Task"}
          </button>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
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
                <td className="px-6 py-4">
                  <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={getDeadlineColor(task.deadline, task.status)}>
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">{task.assignedTo?.name || "N/A"}</td> {/* Fixed to use populated name */}
                <td className="px-6 py-4">{task.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
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

export default AdminProjectDetailsPage;