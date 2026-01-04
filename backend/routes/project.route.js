import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", protectRoute, createProject);
router.get("/", protectRoute, getAllProjects);
router.get("/:id", protectRoute, getProjectById);
router.put("/:id", protectRoute, updateProject);
router.delete("/:id", protectRoute, deleteProject);

export default router;
