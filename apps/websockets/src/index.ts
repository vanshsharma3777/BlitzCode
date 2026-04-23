import { serve } from "bun"
import { WebSocketServer } from 'ws';
import { INIT_GAME } from './message.js';
import { GameManager } from './gameManager.js';

const PORT = Number(process.env.PORT) || 3001;

const gameManager = new GameManager()
const server = serve({
  port: PORT,
  fetch(req) {
    return new Response("Worker running 🚀");
  }
});
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (socket) => {
  console.log("Connected");
  gameManager.addUser(socket);
});