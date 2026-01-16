export interface IQuizQuestion {
    id: number;
    ques: string;
    correct_answer: string;
    incorrect_answers: string[];
    quizId: number;
}

export interface IQuiz {
    id: number;
    name: string;
    category: string;
    questions: IQuizQuestion[];
}