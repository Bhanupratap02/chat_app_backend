/** @format */

import express from "express";
import {
  createChatRoom,
  joinChatRoom,
  getAllChatRooms,
  getRoomParticipants,
  generateInviteLink,
  validateInviteLink,
  searchChatRooms,
} from "../controllers/chatController.js";
import { verifyToken } from "../utils/helper.js";

const router = express.Router();

router.post("/create", verifyToken, createChatRoom);
router.post("/join", verifyToken, joinChatRoom);
router.post("/invite", verifyToken, generateInviteLink);
router.get("/invite/:token", verifyToken, validateInviteLink); // Validate invite link
// GET / api / chat / rooms;
router.get("/rooms", getAllChatRooms); // Fetch all rooms sorted by participants
// GET /api/chat/rooms/:roomId/participants
router.get("/rooms/:roomId/participants", verifyToken, getRoomParticipants); // Fetch participants in a room

router.get("/rooms/search", searchChatRooms); // Search rooms by name

export default router;
