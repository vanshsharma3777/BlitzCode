import WebSocket from "ws";
import { Game } from "./game.js";
import { EXIT_GAME, INIT_GAME } from "./message.js";
import type { CustomSocket } from "./types.js";


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

    private  addHandler(socket: CustomSocket) {
        socket.on("message", async (data) => {
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
            if (msg.type === INIT_GAME) {
                if (!msg.payload.topic || !msg.payload.questionLength || !msg.payload.questionType || !msg.payload.difficulty || !msg.payload.language) {
                    socket.send(JSON.stringify({
                        type: "Error",
                        reason: "Error in getting the fields. Try again"
                    }))
                    return
                }

                socket.payload = msg?.payload

                if (!this.pendingUser) {
                    this.pendingUser = socket;
                    console.log("User added as pending:", socket.emailId);
                    return;
                }
                if (this.pendingUser === socket) {
                    return;
                }
                const isMatch = JSON.stringify(this.pendingUser?.payload) === JSON.stringify(socket.payload)

                if (!isMatch) {
                    console.log("Payload mismatch. Finding new user.");
                    return;
                }
                else {
                    const fields = {
                        difficulty : socket.payload?.difficulty!,
                        topic : socket.payload?.topic!,
                        language : socket.payload?.language!,
                        questionType : socket.payload?.questionType!,
                        questionLength : socket.payload?.questionLength!,
                    }
                    const game = new Game([this.pendingUser , socket] , fields)
                    try{
                        await game.start()
                    }catch(err){
                        console.log("error in gameManager class in starting th game " , err)
                    }
                    this.games.push(game)
                    this.socketToGame.set(this.pendingUser, game)
                    this.socketToGame.set(socket, game)
                    this.pendingUser = null;

                    socket.send(JSON.stringify({ type: "GAME_START" }));
                }
            }
            if (msg.type === EXIT_GAME) {
                console.log("User exit")
                // more code to write...
            }
        })
    }

}