// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import http from "http";
import { initializeSocket } from "./socket/socket.js";
import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";


dotenv.config();

const app = express();

app.use(cookieParser());

const allowedOrigins = [process.env.CLIENT_URL || "", "http://localhost:4173"]
  .filter(Boolean);

app.use(
  cors({
    origin: process.env.CLIENT_URL ,
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "5mb" }));

const server = http.createServer(app);

const io = initializeSocket(server);



app.use((req, res, next) => {
  req.io = io;
  req.socketUserMap = io.socketUserMap;
  next();
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);


server.listen(PORT, () => {
  console.log("Server is running on", PORT);
  connectDB();
});
