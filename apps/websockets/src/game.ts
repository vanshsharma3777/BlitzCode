import { sendQuestion } from "./Game Functions/sendQuestions.js"
import type { CustomSocket } from "./types.js";
import { generateQuestion } from "./LLM/router.js"
import { startGlobalTimer } from "./Game Functions/startGlobalTimer.js";
import { endGame } from "./Game Functions/endGame.js";
import { questions } from "./getQuestions.js";

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
        this.questions = await questions(this.topic , this.difficulty , this.questionType , this.language ,this.questionLength )
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
       await this.findQuestions()
        this.gameEndTime = Date.now() + (5 * 60 * 1000)

        this.players.forEach((player) => {
            const emailId = player.emailId!
            this.playerProgress.set(emailId, 0)
            this.playerScores.set(emailId, 0)
            this.playerStartTime.set(emailId, Date.now())
            if (!this.questions) {
                console.log("Unable to send the questions (game.ts)")
            }
            sendQuestion(this, player)
        })
         startGlobalTimer(this);
    }

    endThisGame(reason: "timer" | "manual" = "timer") {
        if (this.globalTimer) {
            clearTimeout(this.globalTimer)
            this.globalTimer = null
        }
        const results = endGame(this , reason)

    }

    handleNextQuestion(player: CustomSocket) {
        console.log("hit handlequestion")
        const emailId = player.emailId
        if(!emailId){
            console.log("player email id not passed/ found")
            player.send(JSON.stringify({
                type:"ERROR",
                payload:{
                    error:"Email not found / passed"
                }
            }))
            return
        }
        const index = this.playerProgress.get(emailId)
        console.log("index " , index)
        if (index === undefined){
            player.send(JSON.stringify({
                type:"ERROR",
                payload:{
                    error:"Index undefined"
                }
            }))
            return
        }
        console.log("sending qustion (game)")
        if (index >= this.questions!.length - 1) {
            this.playerFinishTime.set(emailId, Date.now())
            return
        }
        this.playerProgress.set(emailId, index + 1)
        console.log("sendques reached")
        sendQuestion(this, player)
    }
}