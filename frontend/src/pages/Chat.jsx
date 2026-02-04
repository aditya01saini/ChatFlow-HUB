import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { socket } from "../socket/socket";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { user, logout } = useContext(AuthContext);

  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Load old messages
  const fetchMessages = async (id) => {
    try {
      const res = await API.get(`/message/${id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  //Socket listeners
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // Join chat
  const joinChat = async () => {
    if (!chatId) return alert("Enter Chat ID");

    socket.emit("join_chat", chatId);
    fetchMessages(chatId);

    alert("Joined Chat: " + chatId);
  };

  // Send message
  const sendMessage = async () => {
    if (!message || !chatId) return;

    try {
      // Save in DB
      await API.post("/message", {
        chatId,
        content: message,
      });

      // Send via socket
      socket.emit("send_message", {
        chatId,
        message,
      });

      // Show my message
      setMessages((prev) => [
        ...prev,
        { sender: { name: "Me" }, content: message },
      ]);

      setMessage("");
    } catch (err) {
      console.error("Send error:", err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Welcome, {user?.name}</h3>
        <button onClick={logout}>Logout</button>
      </div>

      <hr />

      {/* Join Chat */}
      <div>
        <input
          placeholder="Enter Chat ID"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
        />
        <button onClick={joinChat}>Join</button>
      </div>

      <hr />

      {/* Messages Box */}
      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid gray",
          padding: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.sender?.name || "User"}:</b>{" "}
            {msg.content || msg.message}
          </div>
        ))}
      </div>

      {/* Input  */}
      <div style={{ marginTop: "10px" }}>
        <input
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
