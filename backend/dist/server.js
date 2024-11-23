"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
// Create a Socket.IO server
const io = new socket_io_1.Server(5000, {
    cors: {
        origin: "http://localhost:5173", // Replace with your React app's URL
        methods: ["GET", "POST"],
    },
});
// Handle client connections
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Join a specific room by name
    socket.on("join", (name) => {
        console.log(`${socket.id} joined ${name}`);
        socket.join(name); // Join the room named `name`
    });
    // Handle notifications to a specific room
    socket.on("notify", (data) => {
        const { name, message } = data;
        console.log(`Sending message to ${name}: ${message}`);
        setTimeout(() => {
            io.to("Faria KP").emit("notification", message);
        }, 5000);
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
