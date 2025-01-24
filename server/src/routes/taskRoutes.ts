import express from "express";
import { validateTokenHandler } from "../middlewares/authMiddleware";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllTasks,
  SearchAllTasks,
} from "../controllers/taskController";

const router = express.Router();

router.use(validateTokenHandler);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/search", SearchAllTasks);
router.get("/all-tasks", getAllTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
