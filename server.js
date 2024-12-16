/** @format */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";
import sequelize from "./config/db.js";
import setupChatSocket from "./sockets/chatSocket.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import User from "./models/user.js";
import ChatRoom from "./models/chatRoom.js";
import UserRoom, { setupUserRoomAssociations } from "./models/userRoom.js";
import "./models/message.js";
const isDevelopment = process.env.NODE_ENV === "development";
// Initialize associations
setupUserRoomAssociations(User, ChatRoom);
// Test database connection and sync models
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .then(() => sequelize.sync({ alter: false, force: false }))
  .catch((err) => console.error("Error connecting to the database:", err));
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your client URL
    credentials: true, // Allow cookies to be sent cross-origin
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes); // Protected chat routes
app.use("/api/messages", messageRoutes);
setupChatSocket(io);



server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});
