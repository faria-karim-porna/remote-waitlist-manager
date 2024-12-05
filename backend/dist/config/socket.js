"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = exports.SocketSingleton = void 0;
const socket_io_1 = require("socket.io");
const server_1 = require("../server");
class SocketSingleton {
    constructor() { }
    static init() {
        if (!SocketSingleton.instance) {
            SocketSingleton.instance = new socket_io_1.Server(server_1.server, {
                cors: {
                    origin: "http://localhost:5173",
                    methods: ["GET", "POST"],
                },
            });
        }
        return SocketSingleton.instance;
    }
    static getInstance() {
        if (!SocketSingleton.instance) {
            throw new Error("Socket.io instance has not been initialized!");
        }
        return SocketSingleton.instance;
    }
}
exports.SocketSingleton = SocketSingleton;
SocketSingleton.instance = null;
const socket = () => {
    const io = SocketSingleton.getInstance();
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
};
exports.socket = socket;
