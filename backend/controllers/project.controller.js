// controllers/project.controller.js
import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
    });

    // Populate for response
    await project.populate("createdBy", "name email role");

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.log("Error in createProject", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const projects = await Project.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.log("Error in getAllProjects", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.log("Error in getProjectById", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const tasks = await Task.find({ project: req.params.id })
      .populate("assignedTo", "name email")
      .sort({ deadline: 1 });

    res.status(200).json({
      project,
      tasks,
    });
  } catch (error) {
    console.log("Error in getProjectTasks", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.name = name || project.name;
    project.description = description || project.description;

    await project.save();

    // Populate for response
    await project.populate("createdBy", "name email role");

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.log("Error in updateProject", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Optionally delete associated tasks
    await Task.deleteMany({ project: req.params.id });

    await project.deleteOne();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProject", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};