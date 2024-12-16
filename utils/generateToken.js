import jwt from "jsonwebtoken"

const generateToken = (res,userId) =>{
  const token = jwt.sign({ userId }, "chat-app-key", {
    expiresIn: "30d",
  });
  // Set JWT as an HTTP-Only cookie
 console.log(token,"token generated");
 const isProduction = process.env.NODE_ENV === "production";
  res.cookie("jwt", token, {
    httpOnly: true, // Prevent client-side JavaScript access
    sameSite: isProduction ? "None" : "Lax", // Use 'Lax' for local development
    secure: isProduction, // Only secure in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/", // Ensure it's accessible site-wide
  });
}

export default generateToken