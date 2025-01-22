import { Router } from "express";
import authRouter from "./authRoutes";
import taskRouter from "./taskRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use("/task", taskRouter);

export default router;
