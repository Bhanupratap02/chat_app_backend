import jwt from "jsonwebtoken"

const generateToken = (res,userId) =>{
  const token = jwt.sign({ userId }, "chat-app-key", {
    expiresIn: "30d",
  });
  // Set JWT as an HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "None", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

export default generateToken