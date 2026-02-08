import { WebSocketServer } from 'ws';
import { INIT_GAME } from './message.js';
import { GameManager } from './gameManager.js';

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager()
wss.on('connection', (socket)=> {
    console.log("Connected")
    gameManager.addUser(socket)
    console.log(`connected socket ${socket}`)

  
  socket.on('error', console.error);
});