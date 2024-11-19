import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
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
