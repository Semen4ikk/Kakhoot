import {useNavigate} from "react-router-dom";

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
        <li key={quiz.id}>
            <span>{quiz.name}</span>
            <span>{quiz.category}</span>
            <button onClick={handleSelect}>Выбрать</button>
        </li>
    )
}