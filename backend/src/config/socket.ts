import { Server } from "socket.io";
import { server } from "../server";

export class SocketSingleton {
  private static instance: Server | null = null;

  private constructor() {}

  static init(): Server {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = new Server(server, {
        cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST"],
        },
      });
    }
    return SocketSingleton.instance;
  }

  static getInstance(): Server {
    if (!SocketSingleton.instance) {
      throw new Error("Socket.io instance has not been initialized!");
    }
    return SocketSingleton.instance;
  }
}

export const socket = () => {
  const io = SocketSingleton.getInstance();
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
};
