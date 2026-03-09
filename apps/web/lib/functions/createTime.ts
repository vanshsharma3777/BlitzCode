export const createTime = (questionLength: number, difficulty: string) => {
    if (difficulty === 'easy') {
        if (questionLength === 15) return 15*60
        else if (questionLength === 10) return 10*60
        else if (questionLength === 5) return 5*60
    }
    else if (difficulty === 'medium') {
        if (questionLength === 15) return 20*60
        else if (questionLength === 10) return 15*60
        else if (questionLength === 5) return 10*60
    }
    else if (difficulty === 'hard') {
        if (questionLength === 15) return 30*60
        else if (questionLength === 10) return 20*60
        else if (questionLength === 5) return 10*60
    }
}