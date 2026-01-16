import {QuizCard} from "../../../widgets/ui/QuizCard.tsx";
import {useQuizs} from "./useQuizs.tsx";

export type QuestionOutput = {
    id: string;
    ques: string;
    correct_answers: string;
    incorrect_answers: string[];
    quizId: number;
}

export type QuizListCardOutput = {
    id: string;
    name: string;
    category: string;
    question: QuestionOutput[]

}
export function QuizList() {

    const {quizs, loadMore} = useQuizs();



    if (quizs === null) {
        return (
            <div>
                <span>Загрузка...</span>
            </div>
        )
    }
    if ( quizs.length === 0 ) {
        return (
            <div>
                <span>Не нашел квизы</span>
            </div>

        )
    }

    return (
        <div>
            <ul>
                {quizs.map((quiz)=>{

                    return (
                        <QuizCard
                            key={quiz.id}
                            quiz={quiz}
                        />
                    )
                })
                }
            </ul>
            <button type={"button"} onClick={loadMore}>Eще</button>
        </div>

    )
}