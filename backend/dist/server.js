"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientConnections = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const waitlist_1 = __importDefault(require("./routes/waitlist"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.Server({ server });
app.use(express_1.default.json());
app.use('/waitlist', waitlist_1.default);
const clientConnections = {}; // Map to store WebSocket connections by party ID
exports.clientConnections = clientConnections;
wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        const { partyId } = JSON.parse(message);
        clientConnections[partyId] = ws; // Store WebSocket connection for the party
        console.log(`WebSocket connection established for party: ${partyId}`);
    });
    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
