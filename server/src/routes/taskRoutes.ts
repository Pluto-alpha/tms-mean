import { Router } from "express";
import {
  createTask,
  getTask,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const taskRouter = Router();

taskRouter.post("/create", createTask);
taskRouter.get("/:id", getTask);
taskRouter.get("/all-tasks", getAllTasks);
taskRouter.put("/tasks/:id", updateTask);
taskRouter.delete("/delete/:id", deleteTask);

export default taskRouter;
