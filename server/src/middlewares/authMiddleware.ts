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
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as {
          user: { id: string; role: string };
        };
        req.user = decoded.user;
        return next();
      } catch (err: any) {
        if (err.name !== "TokenExpiredError") {
          res
            .status(403)
            .json({ success: false, message: "Forbidden: Invalid token" });
          return;
        }
      }
    }
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as {
          user: { id: string; role: string };
        };
        const payload = decoded.user;
        const newAccessToken = jwt.sign(
          { user: payload },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        );
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600000, // 1 hour
          sameSite: "strict",
        });
        req.user = payload;
        return next();
      } catch (err) {
        res
          .status(403)
          .json({
            success: false,
            message: "Forbidden: Invalid refresh token",
          });
        return;
      }
    }
    res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized: No valid token provided",
      });
  } catch (error) {
    next(error);
  }
};
