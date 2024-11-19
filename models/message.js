import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./user.js";
import ChatRoom from "./chatRoom.js";

const Message = sequelize.define(
  "Message",
  {
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for group messages
      references: {
        model: User,
        key: "id",
      },
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for private messages
      references: {
        model: ChatRoom,
        key: "id",
      },
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);
 User.hasMany(Message, { foreignKey: "sender_id" });
 Message.belongsTo(User, { foreignKey: "sender_id", as: "Sender" });
 
User.hasMany(Message, { foreignKey: "receiver_id" });
Message.belongsTo(User, { foreignKey: "receiver_id", as: "Receiver" });

ChatRoom.hasMany(Message, { foreignKey: "room_id" });
Message.belongsTo(ChatRoom, { foreignKey: "room_id" });

export default Message;

// Stores individual messages, including the sender’s ID, the room ID, the message text, and a timestamp.

// CREATE TABLE messages (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   sender_id INT NOT NULL,
//   room_id INT NOT NULL,
//   message TEXT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (sender_id) REFERENCES users(id),
//   FOREIGN KEY (room_id) REFERENCES chat_rooms(id)
// );