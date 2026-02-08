import WebSocket from "ws";
import { Game } from "./game.js";
import { EXIT_GAME, INIT_GAME } from "./message.js";


export interface CustomSocket extends WebSocket {
    emailId?: string;
}

export class GameManager {
    private games: Game[];
    private pendingUser: CustomSocket | null;
    private socketToGame = new Map<CustomSocket, Game>;
    private users: CustomSocket[]

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = []
    }

    addUser(socket: CustomSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    private addHandler(socket: CustomSocket) {
        socket.on("message", (data) => {
            const msg = JSON.parse(data.toString())
            if (msg.type === "AUTH") {
                socket.emailId = msg?.meta?.emailId;
                if (!socket.emailId) {
                    socket.send(JSON.stringify({
                        type: "error",
                        reason: "Email not found"
                    }));
                    socket.close(1003, "Email Not Found")
                    return
                }
                socket.send(JSON.stringify({
                    type: "AUTH OK",
                }))
            return
            }

            if (!socket.emailId) {
                socket.send(JSON.stringify({
                    type: "error",
                    reason: "Unauthenticated"
                }));
                socket.close(1008, "Unauthenticated");
                return;
            }

            console.log("data", data.toString())

            if (msg.type === INIT_GAME) {
                if (this.pendingUser && this.pendingUser !== socket) {
                    console.log("Opponent found")

                    const game = new Game(this.pendingUser, socket)
                    game.got()
                    this.games.push(game)
                    this.socketToGame.set(this.pendingUser, game)
                    this.socketToGame.set(socket, game)

                    this.pendingUser = null;

                }
                else {
                    this.pendingUser = socket;
                    console.log("User added as pending");
                }

            }
            if (msg.type === EXIT_GAME) {
                console.log("User exit")
                // more code to write...
            }
            if (socket.emailId) {
                if (!msg.payload.topic || !msg.payload.difficulty || !msg.payload.questionType || !msg.payload.language || !msg.payload.questionLength) {
                    socket.send(JSON.stringify({
                        type: "error",
                        reason: "Invalid JSON format"
                    }));
                }
                socket.send(JSON.stringify({
                    type: "ACK",
                    payload: msg
                }));
            }

        })
    }

}