import cookieParser from "cookie-parser";
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./src/middlewares/error.middleware.js";
import path from "path";
import { fileURLToPath } from "url";

import session from "express-session";
import MongoStore from "connect-mongo";

// Init env
config();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL],
//     credentials: true,
//   })
// );





app.set('trust proxy', 1);

const allowedOrigins = [
  "http://localhost:5173", // local frontend dev
  process.env.FRONTEND_URL, // production
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(morgan("dev"));
app.use(cookieParser());

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       sameSite: "none", // VERY IMPORTANT if frontend and backend are on different domains
//       secure: true,     // true if using HTTPS, false if local
//     },
//   })
// );


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // your MongoDB connection string
      collectionName: "sessions",
    }),
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);


// File path setup (ESM-safe __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Health check routes
app.get("/", (_req, res) => res.send("🚀 Xlblog API is running..."));
app.get("/ping", (_req, res) => res.send("Pong"));

// ---------------- API Routes ----------------
import userRoutes from "./src/routes/user.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import summaryRoutes from "./src/routes/summary.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import resumeRoutes from "./src/routes/resume.routes.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/ai/summary", summaryRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/resume", resumeRoutes);

// ---------------- Frontend (Production) ----------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../client/dist");
  app.use(express.static(frontendPath));

  // Serve React/Vite index.html for any other route
  app.get((_req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ---------------- Error Handling ----------------
app.use(errorMiddleware);

app.use((_req, res) => {
  res.status(404).send("OOPS!!! 404 Page Not Found");
});

export default app;
