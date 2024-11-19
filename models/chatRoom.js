import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";
import UserRoom from "./userRoom.js";
const ChatRoom = sequelize.define(
  "ChatRoom",
  {
    room_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_private: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    host_id: {
      type: DataTypes.INTEGER, // Host user ID
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

ChatRoom.hasMany(UserRoom, { foreignKey: "room_id" });
UserRoom.belongsTo(ChatRoom, { foreignKey: "room_id" });

export default ChatRoom