import { Request, Response, NextFunction } from "express";
import Task from "../models/TaskModel";
import User from '../models/UserModel';

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
/**@des All task of users can see only Admin
 * @Route GET api/v1/task/all-tasks
 * @access private
 */
export const getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
