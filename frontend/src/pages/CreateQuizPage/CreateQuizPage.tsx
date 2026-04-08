import {CreateQuizForm} from "../../widgets/ui/CreateQuizForm/CreateQuizForm.tsx";
import {Header} from "../../widgets/ui/Header/Header.tsx";

export function CreateQuizPage() {
    return (
        <>
            <Header />
            <h1>Создать квиз</h1>
            <CreateQuizForm/>
        </>
    )
}