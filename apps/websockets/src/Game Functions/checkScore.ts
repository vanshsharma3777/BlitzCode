
export function isCorrect(question: any, answer: any): boolean {
    const correct = question.correctOptions;

    const userAns = Array.isArray(answer) ? answer : [answer];

    if (correct.length !== userAns.length) return false;
    return correct.every((opt: string) => userAns.includes(opt));
}