import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";

export const Register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password,role } = req.body;
    if (!name || !email || !password ) {
      res.status(400).json({ message: "All fields are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const Login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    if ( !email || !password) {
      res.status(400).json({ message: "All fields are required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "Invalid email or password" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ success: false, message: "Invalid email or password" });
      return;
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    const payload = { id: user.id, role: user.role };
    const accessToken = jwt.sign({ user: payload }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
      success: true,
      message: "Login successful",
      id: user.id,
      accessToken,
    });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const Logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};


