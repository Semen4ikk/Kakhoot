import {useNavigate} from "react-router-dom";
import styles from './QuizCard.module.css'
type Props = {
    quiz: {
        id: string;
        name: string;
        category: string;
    }
}

export function QuizCard({quiz}: Props) {
    const navigate = useNavigate(); // спросить мб вынести

    const handleSelect = () => {
        navigate(`/quiz/${quiz.id}`);
    };

    return (
        <div key={quiz.id} className={styles.quizCard} onClick={handleSelect}>
            <div className={styles.quizCardContent}>
                <img src='../../../public/звезды.jpg' alt={quiz.name} />
                <h3>{quiz.name}</h3>
                <p>{quiz.category}</p>
                <button onClick={handleSelect}>Выбрать</button>
            </div>
        </div>
    )
}