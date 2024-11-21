import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
 const token = req?.cookies?.jwt || req?.headers?.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, "chat-app-key");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error at verifyToken",error);
    res.status(401).json({ error: "Unauthorized access" });
  }
};

export const validateRoomData = (roomData) => {
  const { roomName, isPrivate } = roomData;
  if (!roomName || typeof isPrivate !== "boolean") {
    throw new Error("Invalid room data");
  }
  return true;
};
