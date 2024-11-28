"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const server_1 = require("../server");
const socket = () => {
    const io = new socket_io_1.Server(server_1.server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on("join", (name) => {
            console.log(`${socket.id} joined ${name}`);
            socket.join(name);
        });
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.default = socket;
