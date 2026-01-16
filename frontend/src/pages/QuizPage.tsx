import {Question} from "../entities/question/model/Question.tsx";
import {useQuiz} from "../entities/quiz/model/useQuiz.tsx";
import {useState} from "react";
import {ResultWindow} from "../widgets/ui/ResultWindow.tsx";
import {useParams} from "react-router-dom";
import {BackMainButton} from "../shared/ui/BackMainButton.tsx";

export function QuizPage() {
    const { id } = useParams<{ id: string }>();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);


    if (!id) {
        return <div>ID квиза не указан. Перейдите через список квизов.</div>;
    }
    const {quiz} = useQuiz(id)
    if (quiz === null) {
        return (
            <div>
                <span>Загрузка...</span>
            </div>
        )
    }
    if (quiz.questions.length === 0) {
        return (
            <div>
                <div>В этом квизе нет вопросов.</div>
                <BackMainButton/>
            </div>
        );
    }


    const handleAnswerSelect = (answer: string) => {
        if (isAnswered) return;

        const currentQuestion = quiz.questions[currentQuestionIndex];
        const isCorrect = answer === currentQuestion.correct_answer;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < quiz.questions.length) {
                setCurrentQuestionIndex(nextIndex);
                setIsAnswered(false);
                setSelectedAnswer(null);
            } else {
                setShowResult(true);
            }
        }, 5000);
    };
    if (showResult) {
        return (
            <div>
                <ResultWindow
                    score={score}
                    lenQuestions={quiz.questions.length}
                />
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];



    return (
        <div >
            <h1>{quiz.name} — {quiz.category}</h1>
            <p>
                Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}
            </p>

            <Question
                question={currentQuestion}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswer={selectedAnswer}
                correctAnswer={currentQuestion.correct_answer}
                disabled={isAnswered}
            />
        </div>
    );
}