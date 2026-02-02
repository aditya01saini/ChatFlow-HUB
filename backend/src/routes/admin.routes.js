import express from "express";
import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/role.middleware.js";
import {
  getAllUsers,
  toggleBlockUser,
  registerAdmin,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);
router.put("/block/:id", protect, adminOnly, toggleBlockUser);


router.post("/register", protect, adminOnly, registerAdmin);

export default router;
