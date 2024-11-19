import Message from "../models/message.js";
const setupChatSocket = (io) => {
    io.on('connection',(socket)=>{
      console.log(`user connected:${socket.id}`);

      // Join room
      socket.on("joinRoom", ({ roomId, userId }) => {
        //   console.log("user joined room");
        socket.join(roomId);
        //   Notify other users in the room
        socket.join(`user:${userId}`); // Create a personal room for the user
        socket.to(roomId).emit("userJoined", userId);
      });

      // handling message
      socket.on("message", async ({ roomId, userId, text }) => {
        try {
          //   console.log("message received");
          const message = await Message.create({
            room_id: roomId,
            sender_id: userId,
            message: text,
          });
          io.to(roomId).emit("message", message); // Broadcast to room
        } catch (error) {
          console.error("Error saving group message:", error);
        }
      });
      socket.on("privateMessage", async ({ senderId, receiverId, text }) => {
        try {
          // Save private message to the database
          const privateMessage = await Message.create({
            sender_id: senderId,
            receiver_id: receiverId,
            message: text,
          });
          // Emit the message to the receiver and sender
          io.to(`user:${receiverId}`).emit("privateMessage", privateMessage);
          io.to(`user:${senderId}`).emit("privateMessage", privateMessage);
        } catch (error) {
          console.error("Error saving private message:", error);
        }
      });
      // Typing status
      socket.on("typing", ({ roomId, userId }) => {
        socket.to(roomId).emit("typing", userId);
      });
      // Typing status (private chat)
      socket.on("privateTyping", ({ senderId, receiverId }) => {
        io.to(`user:${receiverId}`).emit("privateTyping", senderId);
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    })
}

export default setupChatSocket