import { Router } from "express";
import {
  Register,
  Login,
  Logout,
  RefreshToken,
} from "../controllers/authController";
import { getUser, updateUser } from "../controllers/userController";

const authRouter = Router();

authRouter.post("/user/register", Register);
authRouter.post("/user/login", Login);
authRouter.post("/user/refresh-token", RefreshToken);
authRouter.post("/user/logout", Logout);
authRouter.get("/user/:id", getUser);
authRouter.put("/user/:id", updateUser);

export default authRouter;
