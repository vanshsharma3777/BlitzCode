import { WebSocketServer } from 'ws';
import { GameManager } from './gameManager.js';
import express from 'express';
import http from 'http';

const app = express();
const port = Number(process.env.PORT) || 3001;

app.get('/ping/ws', (_req, res) => {
  res.status(200).send('OK');
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const gameManager = new GameManager();

wss.on('connection', (socket) => {
  console.log('Connected');
  gameManager.addUser(socket);
});

server.listen(port, () => {
  console.log(`WS running on ${port}`);
});