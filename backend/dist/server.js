"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts (Backend)
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Define CORS options for WebSocket
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL (React app)
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
}));
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
