import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import sequelize from "./config/db.js";
import setupChatSocket from "./sockets/chatSocket.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { verifyToken } from "./utils/helper.js";
import "./models/user.js";
import "./models/chatRoom.js";
import "./models/userRoom.js";
import "./models/message.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/chat", verifyToken, chatRoutes); // Protected chat routes
app.use("/api/messages", verifyToken, messageRoutes);
setupChatSocket(io);

// Test database connection and sync models
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .then(() => sequelize.sync({ alter: true }))
  .catch((err) => console.error("Error connecting to the database:", err));

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});
