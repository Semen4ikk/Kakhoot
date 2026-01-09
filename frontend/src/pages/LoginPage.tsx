import {AuthForm} from "../widgets/AuthForm.tsx";
import styles from './LoginPage.module.css'
export function LoginPage() {

    return (
        <div className={styles.login}>
            <AuthForm/>
        </div>
    )
}