import { useState } from "react";
import { QuestionBlock } from "../../../shared/ui/questionBlock/QuestionBlock.tsx";

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

    // Удаление блока (возвращает Promise, как вы указали)
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
        <form onSubmit={handleSubmit}>
            <div className="quizBlock">
                <p>Введите название квиза</p>
                <input
                    placeholder="Название квиза"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {questions.map((q) => (
                <QuestionBlock
                    key={q.id}
                    id={q.id}
                    onDelete={removeQuestion}
                />
            ))}
            <button type="button" onClick={addQuestion} className="add-question-btn">
                +
            </button>

            <button type="submit">Создать</button>
        </form>
    );
}