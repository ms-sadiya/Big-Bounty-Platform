import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

  //  Global Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


  //  Routes Import
import authRouter from "./routes/auth.route.js";
import bugRouter from "./routes/bug.route.js";
import submissionRouter from "./routes/submission.route.js";


  //  Routes Declaration

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/bugs", bugRouter);
app.use("/api/v1/submissions", submissionRouter);

  //  404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

//  Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || []
  });
});

export { app };
