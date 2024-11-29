"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const routes_1 = __importDefault(require("./routes"));
const socket_1 = require("./config/socket");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.server = http_1.default.createServer(exports.app);
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
(0, database_1.default)();
socket_1.SocketSingleton.init();
(0, socket_1.socket)();
exports.app.use(routes_1.default);
const PORT = 5000;
exports.server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
