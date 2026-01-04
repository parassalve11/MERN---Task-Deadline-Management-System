// controllers/task.controller.js
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import User from "../models/user.model.js";

export const createTask = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      title,
      description,
      priority,
      deadline,
      project,
      assignedTo,
    } = req.body;

    if (!title || !description || !deadline || !project || !assignedTo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const intern = await User.findById(assignedTo);
    if (!intern || intern.role !== "User") {
      return res.status(400).json({ message: "Invalid intern assigned" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      deadline,
      project,
      assignedTo,
      createdBy: req.user._id,
    });

    // Populate after creation for response
    await task.populate("project", "name");
    await task.populate("assignedTo", "name email");

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.log("Error in createTask", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const {
      title,
      description,
      priority,
      deadline,
      status,
      assignedTo,
    } = req.body;

    if (assignedTo) {
      const intern = await User.findById(assignedTo);
      if (!intern || intern.role !== "User") {
        return res.status(400).json({ message: "Invalid intern assigned" });
      }
      task.assignedTo = assignedTo;
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.deadline = deadline || task.deadline;
    task.status = status || task.status;

    await task.save();

    // Populate for response
    await task.populate("project", "name");
    await task.populate("assignedTo", "name email");

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.log("Error in updateTask", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("Error in deleteTask", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await Task.find()
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .sort({ deadline: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in getAllTasks", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log("Error in getTaskById", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("project", "name")
      .sort({ deadline: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in getMyTasks", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Fix: Match schema enum (title case)
    if (!["Pending", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    task.status = status;
    await task.save();

    // Populate for response
    await task.populate("project", "name");
    await task.populate("assignedTo", "name email");

    res.status(200).json({
      message: "Task status updated",
      task,
    });
  } catch (error) {
    console.log("Error in updateTaskStatus", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Utility function (can be used in frontend or other controllers)
export const getDeadlineStatus = (task) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(task.deadline);
  deadline.setHours(0, 0, 0, 0);

  if (task.status === "Completed") return "Completed";
  if (deadline < today) return "Overdue";
  if (deadline.getTime() === today.getTime()) return "Due Today";
  return "Upcoming";
};