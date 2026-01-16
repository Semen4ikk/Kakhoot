import {Header} from "../widgets/ui/Header.tsx";
import styles from "./MainPage.module.css"
import {QuizList} from "../entities/quiz/model/QuizList.tsx";
export function MainPage(){

    return (
        <div>
            <Header/>
            <div className={styles.MainPage}>
                <QuizList/>
            </div>
        </div>
    )
}