import { WebSocketServer } from 'ws';
import { GameManager } from './gameManager.js';

const port = Number(process.env.PORT) || 8080;

const gameManager = new GameManager()
const wss = new WebSocketServer({ port });
wss.on("connection", (socket) => {
  console.log("Connected");
  gameManager.addUser(socket);
});

console.log(`WS running on ${port}`);