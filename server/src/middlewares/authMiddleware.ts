import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}


export const validateTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.body.accessToken ||
      req.query.accessToken ||
      req.headers["x-access-token"];
    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
      return;
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        user: { id: string; role: string };
      };
      req.user = decoded.user;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ success: false, message: "Unauthorized: Token expired" });
        return;
      }
      res.status(403).json({ success: false, message: "Forbidden: Invalid token" });
      return;
    }
  } catch (error) {
    next(error);
  }
};
