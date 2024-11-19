import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.js";
import ChatRoom from "./chatRoom.js";
const RoomInvite = sequelize.define("RoomInvite", {
  room_id: {
    type: DataTypes.INTEGER,
    references: { model: ChatRoom, key: "id" },
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: User, key: "id" },
    allowNull: false,
  },
});

ChatRoom.hasMany(RoomInvite, { foreignKey: "room_id" });
RoomInvite.belongsTo(ChatRoom, { foreignKey: "room_id" });
User.hasMany(RoomInvite, { foreignKey: "user_id" });
RoomInvite.belongsTo(User, { foreignKey: "user_id" });

export default RoomInvite;