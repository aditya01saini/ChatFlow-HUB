import express from "express"
import protect from "../middlewares/auth.middleware.js"
import { createChat, getMyChats } from "../controllers/chat.controller.js";


const router = express.Router();

router.post("/", protect, createChat);
router.get("/", protect, getMyChats);

export default router;