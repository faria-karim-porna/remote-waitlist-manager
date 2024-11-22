// server.ts (Backend)
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

// Define CORS options for WebSocket
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL (React app)
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const interval = setInterval(() => {
    socket.emit("message", `Message from server at ${new Date().toLocaleTimeString()}`);
  }, 5000);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    clearInterval(interval);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
