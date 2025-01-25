import express, { Request, Response, Application } from "express";
import cors from "cors";
import { corsOptions } from "./utils/corsOptions";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import dbConnect from "./config/DbConnection";
import router from "./routes/index";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app: Application = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "http://localhost:8081"],
      connectSrc: ["'self'", "http://localhost:8081"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "strict",
    },
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
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
