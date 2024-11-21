/** @format */

import User from "../models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user && !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Generate and set the JWT as a cookie
    generateToken(res, user.id);
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout successful" });
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
   
    
    const user = new User({
      username,
      password_hash: hashedPassword,
    });
    await user.save();
     console.log("user", user);
    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    console.log("Error during register:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};
export const getUserProfile = async (req,res) =>{
  try {
      const user = await User.findByPk(req?.userId, {
        attributes: { exclude: ["password_hash"] }, // Exclude sensitive fields
      });
     if (!user) {
       return res.status(404).json({ message: "User not found" });
     } 
     
     res.status(200).json(user);

  } catch (error) {
     console.log("Error fetching user profile:", error);
     res.status(500).json({ error: "Failed to get user profile" });
  }
}
export const updateUserProfile = async (req, res) => {
  const { email, profilePicture } = req.body;
  try {
    const user = await User.findByPk(req?.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update email and profile picture if provided
    if (user) user.email = email;
    if (profilePicture) user.profile_picture = profilePicture;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.log("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const checkUsernameAvailability = async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(409).json({ error: "Username is already taken" }); // HTTP 409 Conflict
    }
    res.status(200).json({ message: "Username is available" });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Failed to check username availability" });
  }
};
