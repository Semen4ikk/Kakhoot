import { useState, useMemo } from "react";
import type { IQuizQuestion } from "../../types/Quiz.ts";
import { ResultWindow } from "../ResultWindowMulti/ResultWindow.tsx";
import { Question } from "../../../entities/question/model/Question.tsx";
import { useSessionSocket } from "../../../entities/session/SessionContext.tsx";

export const MultiplayerQuiz = () => {
    const { gameState, sendAnswer, lobby, playerName, leaveLobby } = useSessionSocket();
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const currentQuestion: IQuizQuestion | null = useMemo(() => {
        if (!gameState?.currentQuestion) return null;

        const q = gameState.currentQuestion as any;
        return {
            id: q.id,
            ques: q.question || q.ques,
            correct_answer: q.correct_answer || q.correctAnswer,
            incorrect_answers: q.incorrect_answers,
            quizId: q.quizId
        };
    }, [gameState?.currentQuestion]);

    const correctAnswer = gameState?.correctAnswer;
    const isAnswered = gameState?.isAnswered || false;


    if (gameState?.isFinished) {
        return (
            <div>
                <ResultWindow />
            </div>
        );
    }

    if (!gameState?.isActive || !currentQuestion) {
        return (
            <div style={{ textAlign: 'center', marginTop: 50 }}>
                <h2>Ожидание...</h2>
                <p>Сервер готовит вопрос</p>
                {lobby?.status === 'waiting' && (
                    <p>Ожидайте начала игры</p>
                )}
            </div>
        );
    }

    const handleAnswerSelect = (answer: string) => {
        if (isAnswered) return;

        setSelectedAnswer(answer);
        sendAnswer(answer);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{lobby?.quizName || 'Квиз'}</h3>
                <span>Вопрос {gameState.questionIndex + 1} / {gameState.totalQuestions}</span>
            </div>

            <div style={{ background: '#f5f5f5', padding: 10, borderRadius: 8, marginBottom: 20 }}>
                <h4>Счет:</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {gameState.leaderboard?.map((p, i) => (
                        <li key={i} style={{ color: p.name === playerName ? '#007bff' : 'inherit', fontWeight: p.name === playerName ? 'bold' : 'normal' }}>
                            {i + 1}. {p.name}: <strong>{p.score}</strong> {p.name === playerName && '(Вы)'}
                        </li>
                    ))}
                </ul>
            </div>

            <Question
                question={currentQuestion}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswer={selectedAnswer}
                correctAnswer={correctAnswer}
                disabled={isAnswered}
            />

            {isAnswered && correctAnswer && (
                <p style={{ color: 'green', marginTop: 10 }}>
                    Ответ принят! Правильный: {correctAnswer}. Ждем остальных...
                </p>
            )}
            {isAnswered && !correctAnswer && (
                <p style={{ color: 'green', marginTop: 10 }}>Ответ принят! Ждем остальных игроков...</p>
            )}
        </div>
    );
};