import {useEffect, useState} from "react";
import {getQuizs} from "../../../app/api.ts";
import type {QuizListCardOutput} from "./QuizList.tsx";




export function useQuizs() {
    const [quizs, setQuizs] = useState<null|Array<QuizListCardOutput>>(null);
    useEffect(() => {


        getQuizs().then(json => setQuizs(json))
    }, [])

    return {quizs};
}