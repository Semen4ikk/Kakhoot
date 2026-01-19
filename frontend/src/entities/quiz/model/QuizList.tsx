import {QuizCard} from "../../../widgets/ui/QuizCard.tsx";
import {useQuizs} from "./useQuizs.tsx";
import {useState} from "react";
import {Search} from "../../../shared/ui/search.tsx";
import {filterItems} from "../../../features/filterItems.tsx";

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

    let {quizs, loadMore, loading, hasMore} = useQuizs();
    const [searchQuery, setSearchQuery] = useState('');





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
    if (quizs){
        quizs = filterItems(quizs, searchQuery);
    }

    return (
        <div>

            <Search value={searchQuery} onChange={setSearchQuery} />

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
            {hasMore && (
                <button
                    type="button"
                    onClick={loadMore}
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Еще'}
                </button>
            )}
        </div>

    )
}