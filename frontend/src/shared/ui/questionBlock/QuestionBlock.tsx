import {useEffect, useState} from "react";
import styles from "./QuestionBlock.module.css";

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
        <div className={styles.questionBlock}>
            <input
                className={styles.input}
                placeholder="Введите текст вопроса"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <input
                className={styles.input}
                placeholder="Введите правильный ответ"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
            />

            {wrongAnswers.map((answer, index) => (
                <input
                    key={index}
                    className={styles.input}
                    placeholder="Введите неправильный ответ"
                    value={answer}
                    onChange={(e) => updateWrongAnswer(index, e.target.value)}
                />
            ))}
            <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isDeleting}
            >
                {isDeleting ? "Удаление..." : "Удалить"}
            </button>
        </div>
    );
}