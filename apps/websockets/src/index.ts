import { WebSocketServer } from 'ws';
import { GameManager } from './gameManager.js';
import express from 'express';
const port = Number(process.env.PORT) || 3001;

const gameManager = new GameManager()
const wss = new WebSocketServer({ port });
wss.on("connection", (socket) => {
  console.log("Connected");
  gameManager.addUser(socket);
});

console.log(`WS running on ${port}`);

const app = express();

app.get('/ping/ws' , (req, res)=>{
  res.send("OK").status(200);

})

app.listen(port)