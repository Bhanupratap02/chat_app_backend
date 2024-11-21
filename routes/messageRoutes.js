/** @format */

import express from "express";
import {
  fetchMessages,
  fetchPersonalMessages,
  searchMessages,
  deleteMessage,
  markMessagesAsRead,
} from "../controllers/messageController.js";
import { verifyToken } from "../utils/helper.js";
const router = express.Router();

router.get("/:roomId", verifyToken, fetchMessages); // Endpoint to get message history for a room
router.get("/private/:userId1/:userId2", verifyToken, fetchPersonalMessages);
router.get("/search", verifyToken, searchMessages);
router.delete("/", verifyToken, deleteMessage);
router.patch("/read", verifyToken, markMessagesAsRead);
export default router;
