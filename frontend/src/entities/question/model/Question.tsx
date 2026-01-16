import { Heading } from "../../../shared/ui/Heading.tsx";
import type { IQuizQuestion } from "../../../widgets/types/Quiz.ts";
import {useMemo} from "react";

interface QuestionProps {
    question: IQuizQuestion;
    onAnswerSelect: (answer: string) => void;
    selectedAnswer: string | null;
    correctAnswer: string;
    disabled?: boolean;
}

export function Question({
                             question,
                             onAnswerSelect,
                             selectedAnswer,
                             correctAnswer,
                             disabled = false,
                         }: QuestionProps) {

    const allAnswers = useMemo(() => {
        const answers = [...question.incorrect_answers, question.correct_answer];
        return answers.sort(() => Math.random() - 0.5);
    }, [question.id]);

    return (
        <div>
            <Heading title={question.ques} />
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {allAnswers.map((answer, index) => {

                    let borderColor = '#f9f9f9';
                    if (disabled) {
                        if (answer === correctAnswer) {
                            borderColor = '#2eff00';
                        } else if (answer === selectedAnswer) {
                            borderColor = '#ff0017';
                        }
                    }

                    return (
                        <li key={index} style={{ margin: '8px 0' }}>
                            <button
                                onClick={() => onAnswerSelect(answer)}
                                disabled={disabled}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '1rem',
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: '6px',
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {answer}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}