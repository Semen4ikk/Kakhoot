import {useEffect, useState} from "react";
import {getQuizQuestion} from "../../../app/api.ts";
import type {IQuiz} from "../../../widgets/types/Quiz.ts";


export function useQuiz(id: string) {
    const [quiz, setQuiz] = useState<null|IQuiz>(null);
    useEffect(() => {


        getQuizQuestion(id).then(json => setQuiz(json))
    }, [])

    return {quiz};

}