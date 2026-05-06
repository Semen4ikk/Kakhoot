import {CreateQuizForm} from "../../widgets/ui/CreateQuizForm/CreateQuizForm.tsx";
import {Header} from "../../widgets/ui/Header/Header.tsx";
import styles from "./CreateQuizPage.module.css";

export function CreateQuizPage() {
    return (
        <>
            <Header />
            <div className={styles.page}>
                <div className={styles.content}>
                    <h1 className={styles.title}>Создать квиз</h1>
                    <CreateQuizForm/>
                </div>
            </div>
        </>
    )
}