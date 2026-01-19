import { useEffect, useState, useCallback } from "react";
import { getQuizs } from "../../../app/api.ts";
import type { QuizListCardOutput } from "./QuizList.tsx";

export function useQuizs() {
    const [quizs, setQuizs] = useState<QuizListCardOutput[] | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const limit = 6;

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            setPageNumber(prev => prev + 1);
        }
    }, [loading, hasMore]);

    useEffect(() => {
        if (pageNumber < 1) return;

        setLoading(true);
        getQuizs(pageNumber, limit)
            .then(data => {
                if (data.length < limit) {
                    setHasMore(false);
                }

                setQuizs(prev => {
                    if (pageNumber === 1) {
                        return data;
                    } else {
                        return [...(prev || []), ...data];
                    }
                });
            })
            .catch(err => {
                console.error("Ошибка загрузки квизов:", err);
                setHasMore(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [pageNumber, limit]);

    return { quizs, loadMore, loading, hasMore };
}