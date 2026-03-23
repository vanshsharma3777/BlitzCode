import WebSocket from "ws";
import { Game } from "./game.js";
import { ANSWER, EXIT_GAME, INIT_GAME, NEXT_QUESTION, OVER_GAME, START_GAME } from "./message.js";
import type { CustomSocket } from "./types.js";


export class GameManager {
    private games: Game[];
    private pendingQueues = new Map<string, CustomSocket[]>();
    private socketToGame = new Map<CustomSocket, Game>;
    private users: CustomSocket[]

    constructor() {
        this.games = [];
        this.users = []
    }

    addUser(socket: CustomSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    private addHandler(socket: CustomSocket) {
        socket.on("message", async (data) => {
            const msg = JSON.parse(data.toString())
            console.log("msg received :" , msg)
            if (msg.type === "AUTH") {
                socket.emailId = msg?.meta?.emailId;
                if (!socket.emailId) {
                    socket.send(JSON.stringify({
                        type: "error",
                        data: "Email not found"
                    }));
                    socket.close(1003, "Email Not Found")
                    return
                }
                socket.send(JSON.stringify({
                    data: "AUTH OK",
                }))
                return
            }

            if (!socket.emailId) {
                socket.send(JSON.stringify({
                    type: "error",
                    data: "Unauthenticated"
                }));
                socket.close(1008, "Unauthenticated");
                return;
            }
            if (msg.type === INIT_GAME) {
                if (!msg.payload.topic || !msg.payload.questionLength || !msg.payload.questionType || !msg.payload.difficulty || !msg.payload.language) {
                    socket.send(JSON.stringify({
                        type: "Error",
                        data: "Error in getting the fields. Try again"
                    }))
                    return
                }

                socket.payload = msg?.payload
                const key =
                    `${msg.payload.topic}_${msg.payload.difficulty}_${msg.payload.language}_${msg.payload.questionType}_${msg.payload.questionLength}`;

                console.log("Queue key:", key);


                if (!this.pendingQueues.has(key)) {
                    this.pendingQueues.set(key, []);
                }

                const queue = this.pendingQueues.get(key)!;
                if (queue.length === 0) {

                    queue.push(socket);

                    console.log("Player waiting:", socket.emailId);

                    return;
                }
                const opponent = queue.shift()!;
                console.log("Match found:", opponent.emailId, socket.emailId);
                const fields = {
                    topic: msg.payload.topic,
                    difficulty: msg.payload.difficulty,
                    language: msg.payload.language,
                    questionType: msg.payload.questionType,
                    questionLength: msg.payload.questionLength
                };
                const game = new Game([opponent, socket], fields);
                this.games.push(game)
                this.socketToGame.set(opponent, game);
                this.socketToGame.set(socket, game);

                try {
                    await game.start();
                    opponent.send(JSON.stringify({
                        type: START_GAME,
                        opponent: socket.emailId
                    }));

                    socket.send(JSON.stringify({
                        type: START_GAME,
                        opponent: opponent.emailId
                    }));



                } catch (err) {
                    console.error("Game start error:", err);
                }
                return;
            }
            const game = this.socketToGame.get(socket)
            if (!game) {
                socket.send(JSON.stringify({
                    type: "ERROR",
                    data: "You are not in an active game"
                }))
                return
            }
            if (msg.type === NEXT_QUESTION) {
                console.log("clicked next question")
                game.handleNextQuestion(socket)
                return
            }
            if (msg.type === "ANSWER") {
                console.log("Answer received");
                const { questionId, answer } = msg.payload;
                console.log("quesId ", questionId)
                console.log("answer ", answer)

                game.handleAnswer(socket, questionId, answer);

                return;
            }
            if (msg.type === OVER_GAME) {
                console.log("clicked over game")
                game.endThisGame("manual" , socket)
                return
            }
        })
        socket.on("close", () => {
            console.log("User disconnected:", socket.emailId);
            for (const [key, queue] of this.pendingQueues.entries()) {
                const index = queue.indexOf(socket);
                if (index !== -1) {
                    queue.splice(index, 1);
                }
                if (queue.length === 0) {
                    this.pendingQueues.delete(key);
                }
            }
        });
    }
}
