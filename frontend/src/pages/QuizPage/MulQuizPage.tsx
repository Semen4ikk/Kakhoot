
import { useParams } from "react-router-dom";

import {LobbyManager} from "../../widgets/ui/LobbyManager/LobbyManager.tsx";
import {QuizPage} from "./QuizPage.tsx";
import {useSessionSocket} from "../../entities/session/SessionContext.tsx"; // Ваш старый код

export function MulQuizPage() {
    const { id } = useParams<{ id: string }>();
    const { lobby, gameState } = useSessionSocket();
    if (lobby || gameState?.isActive) {
        return <LobbyManager/>;
    }

    // Иначе показываем одиночный режим (ваш существующий код)
    if (!id) {
        return (<div>ID квиза не указан.</div>)
    }

    return <QuizPage />;
}