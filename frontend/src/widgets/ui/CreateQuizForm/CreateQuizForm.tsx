import { useState } from "react";
import { QuestionBlock } from "../../../shared/ui/questionBlock/QuestionBlock.tsx";
import styles from "./CreateQuizForm.module.css";

type Question = {
    id: string;
};

export function CreateQuizForm() {
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            { id: crypto.randomUUID() },
        ]);
    };

    const removeQuestion = (id: string): Promise<void> => {
        return new Promise((resolve) => {
            setQuestions((prev) => prev.filter((q) => q.id !== id));
            resolve();
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Создание квиза:", { title, questions });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.quizBlock}>
                <p className={styles.label}>Введите название квиза</p>
                <input
                    className={styles.input}
                    placeholder="Название квиза"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className={styles.questions}>
                {questions.map((q) => (
                    <QuestionBlock
                        key={q.id}
                        id={q.id}
                        onDelete={removeQuestion}
                    />
                ))}
            </div>

            <button type="button" onClick={addQuestion} className={styles.addQuestionButton}>
                Добавить вопрос
            </button>

            <button className={styles.submitButton} type="submit">Создать</button>
        </form>
    );
}