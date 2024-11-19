import express from "express";
import {
  createChatRoom,
  joinChatRoom,
  getAllChatRooms,
  getRoomParticipants,
  generateInviteLink,
  validateInviteLink,
  searchChatRooms
} from "../controllers/chatController.js";
const router = express.Router();

router.post("/create",createChatRoom);
router.post("/join", joinChatRoom);
router.post("/invite", generateInviteLink);
router.get("/invite/:token", validateInviteLink); // Validate invite link
// GET / api / chat / rooms;
router.get("/rooms", getAllChatRooms);// Fetch all rooms sorted by participants
// GET /api/chat/rooms/:roomId/participants
router.get("/rooms/:roomId/participants", getRoomParticipants); // Fetch participants in a room

router.get('/rooms/search', searchChatRooms); // Search rooms by name


export default router;
