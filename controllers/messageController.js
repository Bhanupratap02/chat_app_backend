import  Message  from "../models/message.js";
import { Op } from "sequelize";
// Fetch messages for a specific room
export const fetchMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    if (!roomId){
      return res.status(400).json({ error: "Room ID is required" });
    }
    const messages = await Message.findAll({
      where: { room_id: roomId },
      order: [["created_at", "ASC"]],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Failed to fetch messages",error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
// Fetch personal messages between two users
export const fetchPersonalMessages = async (req,res) =>{
  const { userId1, userId2 } = req.params;
  try {
    if (!userId1 || !userId2) {
      return res
        .status(400)
        .json({ error: "Sender ID and Receiver ID are required" });
    }
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId1, receiver_id: userId2 },
          { sender_id: userId2, receiver_id: userId1 },
        ],
      },
      order: [["created_at", "ASC"]],
    });
    res.status(200).json(messages);
  } catch (error) {
       console.error("Error fetching personal messages:", error);
       res.status(500).json({ error: "Failed to fetch personal messages" }); 
  }

}
// Search messages in a room
export const searchMessages = async (req,res) =>{
  const {roomId,keyword} = req.query
  try {
    if (!roomId || !keyword) {
      return res
      .status(400)
      .json({ error: "Room ID and keyword are required" });
      }
    const messages = await Message.findAll({
      where:{
        room_id:roomId,
        message:{[Op.like]:`%${keyword}%`}
      },
      order:[['created_at','ASC']]
    })
    res.status(200).json(messages)
  } catch (error) {
    console.log("Error in search message:",error);
    res.status(500).json({ error: "Failed to search messages" });
    
  }
}

/// Delete a message ( for both group and personal chats):
export const deleteMessage = async (req,res) =>{
  const {messageId} = req.body
  try {
    if (!messageId || !req?.userId) {
      return res
      .status(400)
      .json({ error: "Message ID and User ID are required" });
      }
    // ensure the user owns the message
    const message = await Message.findOne({
      where: { id: messageId, sender_id: req?.userId },
    });
     if (!message) {
       return res
         .status(403)
         .json({ error: "Unauthorized or message not found" });
     }
      await message.destroy();
      res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error deleting Message:",error);
    res.status(500).json({ error: "Failed to delete message" });
    
  }
}
// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    if (!senderId || !receiverId){
      return res.status(400).json({error:"Sender Id and Recevier Id are required"})
    }
    await Message.update(
      { is_read: true },
      {
        where: {
          sender_id: senderId,
          receiver_id: receiverId,
          is_read: false,
        },
      }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
};

// const privateMessages = await Message.findAll({
//   where: {
//     sender_id: 1,
//     receiver_id: 2,
//   },
//   include: [
//     { model: User, as: "Sender", attributes: ["id", "username"] },
//     { model: User, as: "Receiver", attributes: ["id", "username"] },
//   ],
// });
