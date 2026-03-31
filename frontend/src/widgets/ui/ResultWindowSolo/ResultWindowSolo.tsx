// widgets/ui/ResultWindowMulti/ResultWindow.tsx
import { BackMainButton } from "../../../shared/ui/BackMainButton/BackMainButton.tsx";
import styles from "./ResultWindowSolo.module.css";

interface ResultWindowProps {
    score: number;
    lenQuestions: number;
}

export function ResultWindowSolo({ score, lenQuestions }: ResultWindowProps) {
    const percentage = lenQuestions > 0 ? Math.round((score / lenQuestions) * 100) : 0;

    let message = "";
    let messageClass = "";

    if (percentage === 100) {
        message = "Идеально!";
        messageClass = styles.excellent;
    } else if (percentage >= 80) {
        message = "Отличный результат!";
        messageClass = styles.good;
    } else if (percentage >= 60) {
        message = "Хорошо!";
        messageClass = styles.average;
    } else if (percentage >= 40) {
        message = "Неплохо!";
        messageClass = styles.belowAverage;
    } else {
        message = "Попробуйте ещё раз!";
        messageClass = styles.poor;
    }

    return (
        <div className={styles.resultWindow}>
            <div className={styles.resultCard}>
                <h1 className={styles.resultTitle}>Результаты квиза</h1>

                <div className={`${styles.resultMessage} ${messageClass}`}>
                    {message}
                </div>

                <div className={styles.scoreContainer}>
                    <div className={styles.scoreCircle}>
                        <span className={styles.scoreValue}>{score}</span>
                        <span className={styles.scoreTotal}>из {lenQuestions}</span>
                    </div>
                </div>

                <div className={styles.scoreDetails}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Правильных ответов:</span>
                        <span className={styles.detailValueCorrect}>{score}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Неправильных ответов:</span>
                        <span className={styles.detailValueIncorrect}>{lenQuestions - score}</span>
                    </div>
                </div>

                <div className={styles.resultActions}>
                    <BackMainButton />
                </div>
            </div>
        </div>
    );
}