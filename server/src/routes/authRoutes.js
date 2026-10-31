import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  registerStudent
} from "../controllers/authController.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateUser, getCurrentUser);

export default router;
