import {BackMainButton} from "../../shared/ui/BackMainButton.tsx";

export function ResultWindow({score, lenQuestions}: {score: number, lenQuestions: number}) {

    return (
        <div>
            <h2>Квиз завершён!</h2>
            <p>
                Правильных ответов: <strong>{score}</strong> из{' '}
                <strong>{lenQuestions}</strong>
            </p>
            <BackMainButton/>
        </div>
    )
}