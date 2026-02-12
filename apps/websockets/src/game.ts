import { sendQuestion } from "./Game Functions/sendQuestions.js"
import type { CustomSocket } from "./gameManager.js"
import { generateQuestion } from "./LLM/router.js"




export class Game {
    private players: CustomSocket[]
    topic: string
    difficulty: string
    questionType: string
    language: string
    questionLength: number

    questions: string | null

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
        this.questions = await generateQuestion(input)
        if(!this.questions){
            console.log("Questions not found")
            this.players.forEach((player)=>{
                player.send(JSON.stringify({
                    type:"ERROR",
                    payload:{
                        error: "Server Error Questions not found"
                    }
                }))
            })
        }
    }
    async start() {
        await this.findQuestions()
        this.gameEndTime  = Date.now() + (5 * 60 * 1000)

        this.players.forEach((player) => {
            const email = player.emailId!
            this.playerProgress.set(email, 0)
            this.playerScores.set(email, 0)
            this.playerStartTime.set(email, 0)
            if(!this.questions){
                console.log("Unable to send the questions (game.ts)")
            }
            const sendQues = sendQuestion(player , this.questions!, this.playerProgress, this.gameEndTime)

        })
        this.startGlobalTimer();
    }
    startGlobalTimer() {
        // code to write

    }
    endGame() {
        // code to write
    }
}