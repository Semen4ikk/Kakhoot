import {useEffect, useState} from "react";
import {getQuizs} from "../../../app/api.ts";
import type {QuizListCardOutput} from "./QuizList.tsx";




export function useQuizs() {

    const [quizs, setQuizs] = useState<null|Array<QuizListCardOutput>>(null);
    const [pageNumber, setPageNumber] = useState(1)
    const limit: number = 6;
    const loadMore = () => {setPageNumber(pageNumber + 1); return console.log(pageNumber);};
    useEffect(() => {


        getQuizs(pageNumber, limit).then(json => {
            if (pageNumber === 1) {
                setQuizs(json);
            } else {
                setQuizs(prev => [...(prev || []), ...json]);
            }
        }).catch(err => console.error(err));
    }, [pageNumber])

    return {quizs, loadMore};
}