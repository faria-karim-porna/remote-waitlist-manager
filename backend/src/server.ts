import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import database from "./config/database";
import router from "./routes";
import { socket, SocketSingleton } from "./config/socket";

dotenv.config();

export const app = express();
export const server = http.createServer(app);

app.use(cors());
app.use(express.json());

database();

SocketSingleton.init();
socket();

app.use(router);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
