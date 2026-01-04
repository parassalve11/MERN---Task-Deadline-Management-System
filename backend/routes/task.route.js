


import { Router } from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
} from "../controllers/task.controller.js";

import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();



router.post("/", protectRoute, createTask);


router.get("/", protectRoute, getAllTasks);


router.put("/:id", protectRoute, updateTask);


router.delete("/:id", protectRoute, deleteTask);


router.get("/my", protectRoute, getMyTasks);


router.patch("/:id/status", protectRoute, updateTaskStatus);

export default router;
