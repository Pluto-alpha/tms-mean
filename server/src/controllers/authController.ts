import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import 'express-session';
import jwt from "jsonwebtoken";
import User from "../models/UserModel";

declare module "express-session" {
  interface SessionData {
      user?: { id: string; role: string };
  }
}

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required." });
      return;
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
      role,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const Login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
          res.status(400).json({ success: false, message: 'Invalid email or password' });
          return;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          res.status(400).json({ success: false, message: 'Invalid email or password' });
          return;
      }
      const payload = { id: user.id, role: user.role };
      const accessToken = jwt.sign({ user: payload }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ user: payload }, process.env.JWT_SECRET!, { expiresIn: '1d' });
      req.session.user = payload;
      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 3600000, // 1 day
          sameSite: 'strict',
      });
      res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000, // 1 hour
          sameSite: 'strict',
      });
      res.status(200).json({
          success: true,
          message: 'Login successful',
          id: user.id,
          accessToken,
      });
  } catch (error: any) {
      next(error);
  }
};

export const Logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      req.session?.destroy((err) => {
          if (err) {
              return res.status(500).json({ success: false, message: 'Failed to log out' });
          }
          res.clearCookie('accessToken', {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
          });
          res.clearCookie('refreshToken', {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
          });
          res.clearCookie('connect.sid');
          return res.status(200).json({ success: true, message: 'Logout successful' });
      });
  } catch (error: any) {
      next(error);
  }
};

export const RefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) {
          res.status(401).json({ success: false, message: 'Access Denied. No refresh token provided.' });
          return;
      }
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, (err: any, decoded: any) => {
          if (err || !decoded) {
              return res.status(403).json({ success: false, message: 'Invalid or expired refresh token.' });
          }
          const { user } = decoded as { user: { id: string; role: string } };
          const newAccessToken = jwt.sign({ user }, process.env.JWT_SECRET!, { expiresIn: '1h' });
          res.cookie('accessToken', newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 3600000, // 1 hour
          });
          return res.status(200).json({
              success: true,
              message: 'Token refreshed successfully',
              accessToken: newAccessToken,
          });
      });
  } catch (error: any) {
      next(error);
  }
};
