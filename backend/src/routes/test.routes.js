import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/create-test-user", async(req, res) => {
  try {
    const user = await User.create({
      name: "Test User3wew",
      email: "test@chatflowweqewhghhub.com",
      password: "12345qwew6ghfhgh",
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
