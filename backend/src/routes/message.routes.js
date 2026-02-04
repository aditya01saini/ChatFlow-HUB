import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getMessages,
} from "../controllers/message.controller.js";

const router = express.Router();


router.get("/:chatId", protect, getMessages);
router.post("/", protect, sendMessage);

export default router;