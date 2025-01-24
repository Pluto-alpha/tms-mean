import express, { Request, Response, Application } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import dbConnect from "./config/DbConnection";
import router from "./routes/index";
import { errorHandler } from './middlewares/errorHandler';


dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true,
  })
);app.use(morgan("dev"));
app.use(errorHandler);

/*API Routes*/
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Node.js!");
});
app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "API is working!" });
});


/**Database Connection */

dbConnect();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
