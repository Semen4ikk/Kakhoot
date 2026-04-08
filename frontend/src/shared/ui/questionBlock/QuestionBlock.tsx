import {useEffect, useState} from "react";

export interface QuestionBlockProps {
    id: string;
    onDelete: (id: string) => Promise<void>;
    onChange?: (data: { question: string; correct: string; wrongAnswers: string[] }) => void;
}

export function QuestionBlock({ id, onDelete, onChange }: QuestionBlockProps) {
    const [question, setQuestion] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [wrongAnswers, setWrongAnswers] = useState(["", "", ""]);
    const [isDeleting, setIsDeleting] = useState(false);

    const updateWrongAnswer = (index: number, value: string) => {
        setWrongAnswers((prev) => prev.map((ans, i) => (i === index ? value : ans)));
    };

    useEffect(() => {
        onChange?.({ question, correct: correctAnswer, wrongAnswers });
    }, [question, correctAnswer, wrongAnswers, onChange]);
    const handleDelete = async () => {

        setIsDeleting(true);
        try {
            await onDelete(id);
        } catch (error) {
            console.error("Ошибка при удалении вопроса:", error);
            alert("Не удалось удалить вопрос((((((");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="question-block">



            <input
                className="question-input"
                placeholder="Введите текст вопроса"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <input
                className="correct-input"
                placeholder="Введите правильный ответ"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
            />

            {wrongAnswers.map((answer, index) => (
                <input
                    key={index}
                    className="wrong-input"
                    placeholder="Введите неправильный ответ"
                    value={answer}
                    onChange={(e) => updateWrongAnswer(index, e.target.value)}
                />
            ))}
            <button
            type="button"
            className="delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
            >
                {isDeleting ? "Удаление..." : "Удалить"}
            </button>
        </div>
    );
}