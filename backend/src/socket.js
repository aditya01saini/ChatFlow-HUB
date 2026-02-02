import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/user.model.js";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // Online users store
  const onlineUsers = new Map();

  // SOCKET AUTH (JWT)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.user.name);

    // USER ONLINE
    onlineUsers.set(socket.user._id.toString(), socket.id);
    io.emit("online_users", Array.from(onlineUsers.keys()));

    // JOIN CHAT
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`${socket.user.name} joined chat ${chatId}`);
    });

    // SEND MESSAGE
    socket.on("send_message", ({ chatId, message }) => {
      socket.to(chatId).emit("receive_message", {
        message,
        sender: socket.user.name,
      });
    });

    // TYPING
    socket.on("typing", (chatId) => {
      socket.to(chatId).emit("user_typing", socket.user.name);
    });

    socket.on("stop_typing", (chatId) => {
      socket.to(chatId).emit("user_stop_typing");
    });

    //  DISCONNECT
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.user.name);
      onlineUsers.delete(socket.user._id.toString());
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });
  });
};

export default initSocket;
