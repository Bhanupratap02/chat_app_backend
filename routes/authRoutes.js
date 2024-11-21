/** @format */

import express from "express";
import {
  login,
  register,
  logout,
  checkUsernameAvailability,
  updateUserProfile,
  getUserProfile
} from "../controllers/authController.js";
import { verifyToken } from "../utils/helper.js";
const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.post("/check-username",checkUsernameAvailability);
router.put("/update",verifyToken ,updateUserProfile);
router.get("/user-info", verifyToken, getUserProfile);
router.post("/logout",logout);
export default router;
