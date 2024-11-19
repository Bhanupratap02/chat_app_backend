import express from "express";
import {
  fetchMessages,
  fetchPersonalMessages,
  searchMessages,
  deleteMessage,
  markMessagesAsRead
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/:roomId", fetchMessages); // Endpoint to get message history for a room
router.get("/private/:userId1/:userId2", fetchPersonalMessages);
router.get("/search",searchMessages)
router.delete("/",deleteMessage)
router.patch("/read",markMessagesAsRead)
export default router;
