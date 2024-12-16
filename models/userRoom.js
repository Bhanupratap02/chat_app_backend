import sequelize from "../config/db.js";
// import User from "./user.js";
// import ChatRoom from "./chatRoom.js";

const UserRoom = sequelize.define("UserRoom", {}, { timestamps: false });

export const setupUserRoomAssociations = (User, ChatRoom) => {
  User.belongsToMany(ChatRoom, { through: UserRoom, foreignKey: "user_id" });
  ChatRoom.belongsToMany(User, { through: UserRoom, foreignKey: "room_id" });

  UserRoom.belongsTo(User, { foreignKey: "user_id" }); // Establish association
  UserRoom.belongsTo(ChatRoom, { foreignKey: "room_id" });
};

export default UserRoom;








// This is a join table for users and chat rooms, allowing multiple users to be members of a single room for group chats.
// CREATE TABLE user_rooms (
//   user_id INT,
//   room_id INT,
//   PRIMARY KEY (user_id, room_id),
//   FOREIGN KEY (user_id) REFERENCES users(id),
//   FOREIGN KEY (room_id) REFERENCES chat_rooms(id)
// );