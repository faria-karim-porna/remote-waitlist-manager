import http from 'http';
import express, { Request, Response } from 'express';
import WebSocket, { Server as WebSocketServer, WebSocket as Ws } from 'ws';
import waitlistRouter from './routes/waitlist';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use('/waitlist', waitlistRouter);

// Type for WebSocket connections stored by party ID
interface ClientConnections {
  [partyId: string]: Ws;
}

const clientConnections: ClientConnections = {}; // Map to store WebSocket connections by party ID

wss.on('connection', (ws: Ws, req: Request) => {
  ws.on('message', (message: string) => {
    const { partyId }: { partyId: string } = JSON.parse(message);
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

export { clientConnections };
