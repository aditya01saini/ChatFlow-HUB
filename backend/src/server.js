import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import initSocket from "./socket.js";

import testRoutes from "./routes/test.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);



app.use(cors());
app.use(express.json());
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
    console.log("chatflow backend is running");
    res.send("chatflow-HUB backend is running ")
})

initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`server + socket${PORT}`);
})

