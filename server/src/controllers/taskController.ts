import { Request, Response, NextFunction } from "express";
import Task from "../models/TaskModel";
import User from "../models/UserModel";
import { parseDate } from "../utils/DateParsing";

/**
 * @desc Create a new task
 * @route POST /api/v1/task/create
 * @access Private
 */
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, dueDate, status } = req.body;
    const userId = req.user?.id;
    if (!title || !description || !dueDate || !status || !userId) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }
    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      userId,
    });
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc Get all user tasks
 * @route GET /api/v1/task/:id
 * @access Private
 */
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all tasks (Admin only)
 * @route GET /api/v1/task/all-tasks
 * @access Private (Only can access Admin)
 */
export const getAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user || user.role !== "Admin") {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
    const tasks = await Task.find().populate("userId", "name email");
    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
/**
 * @desc Update a task
 * @route PUT /api/v1/task/:id
 * @access Private
 */
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;
    const userId = req.user?.id;
    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { title, description, dueDate, status },
      { new: true, runValidators: true }
    );
    if (!task) {
      res
        .status(404)
        .json({ success: false, message: "Task not found or unauthorized" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
/**
 * @desc Delete a task
 * @route DELETE /api/v1/task/:id
 * @access Private
 */
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      res
        .status(404)
        .json({ success: false, message: "Task not found or unauthorized" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const SearchAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    let { status, dueDate } = req.query;
    console.log(`Status`,status);
    console.log(`DueDate`,dueDate);
    let searchCriteria: any = { userId };
    if (status) {
      const formattedStatus =
        status.toString().charAt(0).toUpperCase() +
        status.toString().slice(1).toLowerCase();
      searchCriteria.status = formattedStatus;
    }
    if (dueDate) {
      const parsedDate = parseDate(dueDate as string);
      if (parsedDate) {
        const startOfDay = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(parsedDate.setUTCHours(23, 59, 59, 999));
        searchCriteria.dueDate = { $gte: startOfDay, $lte: endOfDay };
      }
    }
    const tasks = await Task.find(searchCriteria).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};
