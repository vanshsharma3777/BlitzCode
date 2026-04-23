import { WebSocketServer } from 'ws';
import { GameManager } from './gameManager.js';

const PORT = Number(process.env.PORT) || 3001;

const gameManager = new GameManager()
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (socket) => {
  console.log("Connected");
  gameManager.addUser(socket);
});