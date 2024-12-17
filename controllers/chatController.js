/** @format */

import ChatRoom from "../models/chatRoom.js";
import UserRoom from "../models/userRoom.js";
import User from "../models/user.js";
import RoomInvite from "../models/RoomInvite.js";
import { Sequelize } from "sequelize";
import crypto from "node:crypto";
export const createChatRoom = async (req, res) => {
  const { roomName, isPrivate,bio } = req.body;
  try {
    if (!roomName) {
      return res.status(400).json({ error: "Room name is required" });
    }
    const newRoom = await ChatRoom.create({
      room_name: roomName,
      is_private: isPrivate,
      host_id: req?.userId, // Assign the host
      bio:bio
    });
    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
};

export const generateInviteLink = async (req, res) => {
  const { roomId } = req.body;
  try {
    // Verify the inviter is the host of the room
    const room = await ChatRoom.findByPk(roomId);
    if (!room || room.host_id !== req.userId) {
      return res
        .status(403)
        .json({ error: "Only the host can generate an invite link." });
    }
    // Generate an unique token
    const token = crypto.randomBytes(16).toString("hex");
    // save the invite
    const invite = await RoomInvite.create({
      room_id: roomId,
      token,
    });
    // return the invitation link
    const inviteLink = `${req.protocol}://${req.get(
      "host"
    )}/api/chatrooms/invite/${token}`;
    res.status(201).json({ inviteLink });
  } catch (error) {
    console.error("Error generating invite link:", error);
    res.status(500).json({ error: "Failed to generate invite link" });
  }
};
export const validateInviteLink = async (req, res) => {
  const { token } = req.params;

  try {
    // Find the invite by token
    const invite = await RoomInvite.findOne({ where: { token } });
    if (!invite) {
      return res
        .status(404)
        .json({ error: "Invalid or expired invitation link." });
    }
    const room = await ChatRoom.findByPk(invite.room_id);
    if (!room) {
      return res.status(404).json({ error: "Chat room not found." });
    }
    res.status(200).json({ room });
  } catch (error) {
    console.error("Error validating invite link:", error);
    res.status(500).json({ error: "Failed to validate invitation link." });
  }
};
export const joinChatRoom = async (req, res) => {
  const { roomId, token } = req.body;
  try {
    if (!req?.userId || !roomId) {
      return res
        .status(400)
        .json({ error: "User ID and Room ID are required" });
    }
    const room = await ChatRoom.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ error: "Chat room not found" });
    }
    // Check if user is already in the room
    const existingEntry = await UserRoom.findOne({
      where: { user_id: req?.userId, room_id: roomId },
    });
    if (existingEntry) {
      return res.status(400).json({ error: "User already in the room" });
    }

    if (room.is_private) {
      // Check if the user has a valid invite token
      const isInvited = token
        ? await RoomInvite.findOne({ where: { token, room_id: roomId } })
        : null;
      const isHost = room.host_id === req?.userId;

      if (!isInvited && !isHost) {
        return res
          .status(403)
          .json({ error: "Access denied to private room." });
      }

      // If token was used, delete it to prevent reuse
      // if (isInvited) {
      //   await isInvited.destroy();
      // }
    }

    await UserRoom.create({ user_id: req?.userId, room_id: roomId });
    res.status(200).json({ message: "Joined room successfully" });
  } catch (error) {
    console.error("Error joining chat room:", error);
    res.status(500).json({ error: "Failed to join room" });
  }
};

// Get all group chat rooms sorted by participant count

export const getAllChatRooms = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Step 1: Paginated query without participant count
    const chatRooms = await ChatRoom.findAll({
      attributes: [
        "id",
        "room_name",
        "is_private",
        "bio",
        "host_id",
        "created_at",
      ],
      include: [
        {
          model: User,
          as: "host",
          attributes: ["id", "username", "profile_picture"],
        },
      ],
      where: {
        room_name: { [Sequelize.Op.like]: `%${search}%` },
      },
      limit: parseInt(limit),
      offset: offset,
    });

    // Step 2: Fetch participant count separately
    const chatRoomsWithCount = await Promise.all(
      chatRooms.map(async (chatRoom) => {
        const participantCount = await UserRoom.count({
          where: { room_id: chatRoom.id },
        });
        return {
          ...chatRoom.get({ plain: true }),
          participantCount,
        };
      })
    );

    // Step 3: Count total chat rooms matching the query
    const total = await ChatRoom.count({
      where: { room_name: { [Sequelize.Op.like]: `%${search}%` } },
    });
    // Calculate next cursor (if more pages are available)
    const nextCursor =
      page < Math.ceil(total / limit) ? parseInt(page) + 1 : null;
    // Step 4: Send response
    res.status(200).json({
      total: total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      nextCursor,
      data: chatRoomsWithCount,
    });
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ error: "Failed to fetch chat rooms" });
  }
};




// Get all participants in a specific chat room
export const getRoomParticipants = async (req, res) => {
  const { roomId } = req.params;
  try {
    if (!roomId) {
      return res.status(400).json({ error: "Room ID is required" });
    }
    const participants = await UserRoom.findAll({
      where: { room_id: roomId },
      include: [{ model: User, attributes: ["id", "username", "email"] }],
    });
    const participantDetails = participants.map((p) => p.User);
    res.status(200).json(participantDetails); // Return user info only
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
};

export const searchChatRooms = async (req, res) => {
  const { query } = req.query;
  try {
    if (!query) {
      return res.status(400).json({ error: "Room Name is required" });
    }
    const rooms = await ChatRoom.findAll({
      where: {
        room_name: {
          [Sequelize.Op.like]: `%${query}%`, // Search for rooms containing the query
        },
      },
    });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to search chat rooms" });
  }
};
