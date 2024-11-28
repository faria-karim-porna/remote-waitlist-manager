import { Server } from "socket.io";
import { server } from "../server";

const socket = () => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", (name: string) => {
      console.log(`${socket.id} joined ${name}`);
      socket.join(name);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default socket;
