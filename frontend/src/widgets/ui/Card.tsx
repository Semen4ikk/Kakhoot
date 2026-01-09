type Props = {
    quiz: {
        id: string;
        name: string;
        category: string;
    }
}

export function Card({quiz}: Props) {

    return (
        <li key={quiz.id}>
            <span>{quiz.name}</span>
            <span>{quiz.category}</span>
            <button>Выбрать</button>
        </li>
    )
}