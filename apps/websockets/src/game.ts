import { sendQuestion } from "./Game Functions/sendQuestions.js"
import type { CustomSocket } from "./types.js";
import { generateQuestion } from "./LLM/router.js"
import { startGlobalTimer } from "./Game Functions/startGlobalTimer.js";
import { endGame } from "./Game Functions/endGame.js";
import { ques } from "./getQuestions.js";

export class Game {
    public players: CustomSocket[]
    topic: string
    difficulty: string
    questionType: string
    language: string
    questionLength: number
    questions: any[] | null
    playerProgress = new Map<string, number>()
    playerScores = new Map<string, number>()
    playerStartTime = new Map<string, number>()
    playerFinishTime = new Map<string, number>()
    gameEndTime = 0
    globalTimer: NodeJS.Timeout | null = null

    constructor(
        players: CustomSocket[], fields: {
            topic: string
            difficulty: string
            questionType: string
            language: string
            questionLength: number
        }) {
        this.questions = null
        this.players = players
        this.topic = fields.topic
        this.difficulty = fields.difficulty
        this.questionType = fields.questionType
        this.language = fields.language
        this.questionLength = fields.questionLength
    }

    async findQuestions() {
        const input = {
            topic: this.topic,
            difficulty: this.difficulty,
            language: this.language,
            questionType: this.questionType,
            questionLength: this.questionLength
        }
        console.log("request goes to ques")
        this.questions = await ques(this.topic, this.difficulty, this.questionType, this.language, this.questionLength)
        if (!this.questions) {
            console.log("Questions not found")
            this.players.forEach((player) => {
                player.send(JSON.stringify({
                    type: "ERROR",
                    payload: {
                        error: "Server Error Questions not found"
                    }
                }))
            })
        }
    }
    async start() {
        await this.findQuestions();
        console.log("questions after findQuestions:", this.questions);

        if (!this.questions || this.questions.length === 0) {
            console.log("Questions not found in start()");
            return;
        }
        this.gameEndTime = Date.now() + (5 * 60 * 1000)

        this.players.forEach((player) => {
            const emailId = player.emailId!
            this.playerProgress.set(emailId, 0)
            this.playerScores.set(emailId, 0)
            this.playerStartTime.set(emailId, Date.now())
            if (!this.questions) {
                console.log("Unable to send the questions (game.ts)")
            }

        })

        startGlobalTimer(this);
    }

    endThisGame(type: "timer" | "manual" = "timer") {
        if (this.globalTimer) {
            clearTimeout(this.globalTimer)
            this.globalTimer = null
        }
        const results = endGame(this, type)

    }

    handleNextQuestion(player: CustomSocket) {
        const emailId = player.emailId
        console.log("NEXT_QUESTION from:", emailId);
        if (!emailId) {
            console.log("player email id not passed/ found")
            player.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    error: "Email not found / passed"
                }
            }))
            return
        }
        console.log("this.playerProgress.size :", this.playerProgress.size)
        console.log("this.ques :", this.questions)
        if (this.playerProgress.size === 0 || !this.questions) {
            player.send(JSON.stringify({
                type: "ERROR",
                payload: { error: "Game is still initializing kindly retry after 1 minutes" }
            }));
            return;
        }
        const index = this.playerProgress.get(emailId)
        console.log("index ", index)
        if (index === undefined) {
            player.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    error: "Index undefined"
                }
            }))
            return
        }
        if (index >= this.questions.length) {
            this.playerFinishTime.set(emailId, Date.now())
            return
        }
        sendQuestion(this, player)
        this.playerProgress.set(emailId, index + 1)
    }
}