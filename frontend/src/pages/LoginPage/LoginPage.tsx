import {AuthForm} from "../../widgets/ui/Auth/AuthForm.tsx";
import styles from './LoginPage.module.css'
import {Header} from "../../widgets/ui/Header/Header.tsx";
export function LoginPage() {

    return (
        <>
            <Header/>
            <div className={styles.form}>
                <AuthForm/>
            </div>
        </>

    )
}