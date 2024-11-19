import User from "../models/user"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
export const login = async  (req,res) => {
  const { email, password } = req.body;
try {
  const user = await User.findOne({ where: { email } });
   if (user && (await bcrypt.compare(password, user.password_hash))) {
     const token = jwt.sign({ userId: user.id },"Sachin-chat-app-key", {
       expiresIn: "30d",
     });
     res.status(200).json({ message: "Login successful", token });
   } else {
     res.status(401).json({ error: "Invalid credentials" });
   }
} catch (error) {
   res.status(500).json({ error: "Failed to login" });
}
}

export const register = async (req,res) =>{
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({
          username,
          email,
          password_hash: hashedPassword,
        });
        res.status(201).json({
          message: "User registered successfully",
          userId: user.id,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to register user" });
    }
}